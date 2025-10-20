import { marked } from 'marked';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { XMarkdownProps } from '../interface';

/* ------------ Type ------------ */
enum TokenType {
  Text = 0,
  IncompleteLink = 1,
  IncompleteImage = 2,
  IncompleteHeading = 3,
  IncompleteHtml = 4,
  IncompleteCode = 5,
  IncompleteHr = 6,
  IncompleteList = 7,
  IncompleteEmphasis = 8,
  CompleteCode = 9,
  MaybeImage = 10,
}

interface StreamCache {
  pending: string;
  token: TokenType;
  processedLength: number;
  completeMarkdown: string;
  codeStartSymbols: string;
}

/* ------------ tools ------------ */
const getInitialCache = (): StreamCache => ({
  pending: '',
  token: TokenType.Text,
  processedLength: 0,
  completeMarkdown: '',
  codeStartSymbols: '',
});

// 清空 pending
const commitCache = (cache: StreamCache) => {
  if (cache.pending) {
    cache.completeMarkdown += cache.pending;
    cache.pending = '';
  }

  cache.token = TokenType.Text;
};

const isTokenClose = (markdown: string, tokenType: string) => {
  try {
    const tokens = marked.lexer(markdown);
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return false;
    }

    const firstToken = tokens[0];
    return (
      firstToken?.type === 'paragraph' &&
      'tokens' in firstToken &&
      Array.isArray(firstToken.tokens) &&
      firstToken.tokens?.[0]?.type === tokenType
    );
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return false;
  }
};

const isInCode = (text: string): boolean => {
  let inFenced = false; // 是否在 ``` 块内
  let fenceChar = ''; // 记录开启栅栏的字符 (` or ~)
  let fenceLen = 0; // 开启栅栏的长度
  let inIndent = false; // 是否在缩进代码块内
  let tickRun = 0; // 连续反引号计数（行内）
  let afterFence = false; // 栅栏行后是否立即接内容
  let escaped = false; // 转义标志

  const lines = text.split(/\n/);
  for (const rawLine of lines) {
    const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine;

    /* ---------- 1. fence code ---------- */
    if (!inIndent) {
      const m = line.match(/^(`{3,}|~{3,})([^`\s]*)\s*$/);
      if (m) {
        if (!inFenced) {
          // 开启
          inFenced = true;
          fenceChar = m[1][0];
          fenceLen = m[1].length;
          afterFence = true;
          continue;
        }
        if (m[1][0] === fenceChar && m[1].length >= fenceLen) {
          // 闭合
          inFenced = false;
          fenceChar = '';
          fenceLen = 0;
          afterFence = false;
          continue;
        }
      }
    }
    if (inFenced) {
      afterFence = false;
      continue;
    }

    /* ---------- 2. 缩进代码块 ---------- */
    const indentMatch = line.match(/^([ \t]*)(.*)/)!;
    const indent = indentMatch[1];
    const content = indentMatch[2];
    const isIndent = indent.length >= 4 || indent.includes('\t');

    if (!inIndent && isIndent && content) {
      inIndent = true;
    } else if (inIndent && !isIndent && content) {
      inIndent = false;
    }
    if (inIndent) continue;

    /* ---------- 3. inline code ---------- */
    for (const ch of line) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === '`') {
        tickRun++;
      } else {
        if (tickRun > 0 && tickRun % 2 === 1) {
          // 奇数个 ` 会切换行内代码状态
          // 这里简化：只要遇到未配对的 ` 就认为“仍在行内代码”
          return true;
        }
        tickRun = 0;
      }
    }
  }

  return inFenced || inIndent;
};

/* ------------ recognizer ------------ */
const recognizeImage = (cache: StreamCache) => {
  const { token, pending } = cache;
  if (token !== TokenType.Text && token !== TokenType.IncompleteImage) return;

  const isIncomplete = /!\[[^\]\r\n]*?(?:\[|$)|!\[[^\]\r\n]*\]\([^)\r\n]*$/g.test(pending);
  if (!isIncomplete) {
    commitCache(cache);
  }
};

const recognizeLink = (cache: StreamCache) => {
  const { token, pending } = cache;
  if (token !== TokenType.Text && token !== TokenType.IncompleteLink) return;

  const isIncomplete = /^\[[^\]\r\n]*\]\([^)\r\n]*$|^\[[^\]\r\n]*$/m.test(pending);
  if (!isIncomplete) {
    commitCache(cache);
  }
};

const recognizeHeading = (cache: StreamCache) => {
  const { token, pending } = cache;
  if (token !== TokenType.Text && token !== TokenType.IncompleteHeading) return;

  const isIncomplete = /^#{1,6}(?:[^#\r\n]|#{1,6}(?!\s*$))*#{0,5}$/m.test(pending);
  if (!isIncomplete) {
    commitCache(cache);
  }
};

const recognizeHtml = (cache: StreamCache) => {
  const { token, pending } = cache;
  if (token !== TokenType.Text && token !== TokenType.IncompleteHtml) return;

  const isIncomplete = /^#{1,6}(?:[^#\r\n]|#{1,6}(?!\s*$))*#{0,5}$/m.test(pending);
  if (!isIncomplete) {
    commitCache(cache);
  }
};

const recognizeEmphasis = (cache: StreamCache) => {
  const { token, pending } = cache;

  const isEmphasisStart = char === '_' || char === '*';
  if (token === TokenType.Text && isEmphasisStart) {
    cache.token = TokenType.IncompleteEmphasis;
    return;
  }

  if (token === TokenType.IncompleteEmphasis) {
    /**
     * _ list
     *  ^
     */
    const isInvalidStart = /[*_][ \n]$/.test(pending);
    /**
     * _list_
     *      ^
     */
    const isCompleteEmphasis = isTokenClose(pending, 'strong') || isTokenClose(pending, 'em');
    const isEmphasisBreak = char === '\n';

    const shouldCommit = isInvalidStart || isCompleteEmphasis || isEmphasisBreak;
    if (shouldCommit) {
      commitCache(cache);
    }
  }
};

const recognizeText = (cache: StreamCache) => {
  const { token } = cache;
  if (token === TokenType.Text) {
    commitCache(cache);
  }
};

const recognizers = [
  recognizeImage,
  recognizeLink,
  recognizeEmphasis,
  recognizeHeading,
  recognizeHtml,
  recognizeText,
];

const handleIncompleteMarkdown = (
  cache: StreamCache,
  incompleteMarkdownComponentMap: NonNullable<
    XMarkdownProps['streaming']
  >['incompleteMarkdownComponentMap'],
) => {
  if (cache.token === TokenType.Text) return;

  if (cache.token === TokenType.IncompleteImage) {
    return `<${incompleteMarkdownComponentMap?.image || 'incomplete-image'} />`;
  }
  if (cache.token === TokenType.IncompleteLink) {
    return `<${incompleteMarkdownComponentMap?.link || 'incomplete-link'} />`;
  }
};

// cache incomplete markdown
const useStreaming = (input: string, config?: XMarkdownProps['streaming']) => {
  const { hasNextChunk: enableCache = false, incompleteMarkdownComponentMap } = config || {};
  const [output, setOutput] = useState('');
  const cacheRef = useRef<StreamCache>(getInitialCache());

  const processStreaming = useCallback(
    (text: string) => {
      const cache = cacheRef.current;
      if (!text) {
        setOutput('');
        cacheRef.current = getInitialCache();
        return;
      }

      const currentText = cache.completeMarkdown + cache.pending;
      if (!text.startsWith(currentText)) {
        cacheRef.current = getInitialCache();
      }

      if (isInCode(text)) {
        setOutput(text);
        return;
      }

      // handle new chunk
      const chunk = text.slice(cache.processedLength);
      if (!chunk) {
        return;
      }
      cache.processedLength += chunk.length;

      cache.pending += chunk;
      for (const recognizer of recognizers) {
        recognizer(cache);
      }

      const incompletePlaceholder = handleIncompleteMarkdown(cache, incompleteMarkdownComponentMap);
      setOutput(cache.completeMarkdown + (incompletePlaceholder || ''));
    },
    [incompleteMarkdownComponentMap],
  );

  useEffect(() => {
    if (typeof input !== 'string') {
      console.error(`X-Markdown: input must be string, not ${typeof input}.`);
      return;
    }

    if (!enableCache) {
      setOutput(input);
      return;
    }

    processStreaming(input);
  }, [input, enableCache, processStreaming]);

  return output;
};

export default useStreaming;
