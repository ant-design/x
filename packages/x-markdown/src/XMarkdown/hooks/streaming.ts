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
  IncompleteTable = 11,
  IncompleteBlockquote = 12,
}

interface StreamCache {
  pending: string;
  token: TokenType;
  processedLength: number;
  completeMarkdown: string;
  codeStartSymbols: string;
  // 优化：缓存正则匹配结果
  lastMatchIndex: number;
  // 优化：减少重复计算
  context: {
    inCodeBlock: boolean;
    codeBlockTicks: number;
    inHtml: boolean;
    htmlTagStack: string[];
  };
}

/* ------------ tools ------------ */
const getInitialCache = (): StreamCache => ({
  pending: '',
  token: TokenType.Text,
  processedLength: 0,
  completeMarkdown: '',
  codeStartSymbols: '',
  lastMatchIndex: -1,
  context: {
    inCodeBlock: false,
    codeBlockTicks: 0,
    inHtml: false,
    htmlTagStack: [],
  },
});

// 优化：批量提交缓存，减少字符串拼接
const commitCache = (cache: StreamCache) => {
  if (cache.pending) {
    cache.completeMarkdown += cache.pending;
    cache.pending = '';
  }
  cache.token = TokenType.Text;
  cache.lastMatchIndex = -1;
};

// 优化：使用更高效的状态检查
const isTokenComplete = (text: string, type: string): boolean => {
  if (!text.trim()) return false;

  // 快速检查结尾符号
  switch (type) {
    case 'image':
      return /!\[[^\]]*\]\([^)]*\)$/.test(text);
    case 'link':
      return /\[[^\]]*\]\([^)]*\)$/.test(text);
    case 'code':
      return text.includes('```') && text.match(/```/g)!.length >= 2;
    case 'heading':
      return /^#{1,6}\s+[^\n]+$/.test(text);
    case 'emphasis':
      return /[*_][^*_]*[*_]$/.test(text);
    default:
      return false;
  }
};

/* ------------ 优化的识别器 ------------ */

// 代码块识别器 - 优化性能
const recognizeCode = (cache: StreamCache, char: string) => {
  const { pending, context } = cache;

  if (context.inCodeBlock) {
    // 已经在代码块中，检查是否结束
    if (char === '`' && pending.endsWith('``')) {
      context.inCodeBlock = false;
      context.codeBlockTicks = 0;
      commitCache(cache);
    }
    return;
  }

  if (cache.token === TokenType.Text && char === '`') {
    const backticks = (pending.match(/`+$/g) || [''])[0].length + 1;
    if (backticks >= 3) {
      context.inCodeBlock = true;
      context.codeBlockTicks = backticks;
      cache.token = TokenType.IncompleteCode;
    }
  }
};

// 图片识别器 - 优化逻辑
const recognizeImage = (cache: StreamCache, char: string) => {
  const { pending } = cache;

  if (cache.token === TokenType.Text && char === '!') {
    cache.token = TokenType.MaybeImage;
    return;
  }

  if (cache.token === TokenType.MaybeImage) {
    if (!pending.endsWith('![')) {
      commitCache(cache);
    } else {
      cache.token = TokenType.IncompleteImage;
    }
  } else if (cache.token === TokenType.IncompleteImage) {
    // 快速检查是否完成
    if (isTokenComplete(pending + char, 'image')) {
      commitCache(cache);
    } else if (pending.endsWith(']') && char !== '(') {
      // 无效的图片语法
      commitCache(cache);
    }
  }
};

// 链接识别器
const recognizeLink = (cache: StreamCache, char: string) => {
  const { pending } = cache;

  if (cache.token === TokenType.Text && char === '[' && !pending.endsWith('!')) {
    cache.token = TokenType.IncompleteLink;
    return;
  }

  if (cache.token === TokenType.IncompleteLink) {
    if (isTokenComplete(pending + char, 'link')) {
      commitCache(cache);
    } else if (pending.endsWith(']') && char !== '(') {
      commitCache(cache);
    }
  }
};

// 标题识别器 - 优化正则
const recognizeHeading = (cache: StreamCache, char: string) => {
  const { pending } = cache;

  if (cache.token === TokenType.Text && char === '#' && !pending.trim()) {
    cache.token = TokenType.IncompleteHeading;
    return;
  }

  if (cache.token === TokenType.IncompleteHeading) {
    const text = pending + char;

    // 检查是否是无效的标题（超过6个#或没有空格）
    if (/^#{7,}/.test(text) || /^#{1,6}[^#\s]/.test(text)) {
      commitCache(cache);
    } else if (isTokenComplete(text, 'heading')) {
      commitCache(cache);
    }
  }
};

// HTML识别器 - 支持嵌套标签
const recognizeHtml = (cache: StreamCache, char: string) => {
  const { pending, context } = cache;

  if (!context.inHtml && cache.token === TokenType.Text && char === '<') {
    cache.token = TokenType.IncompleteHtml;
    context.inHtml = true;
    return;
  }

  if (context.inHtml) {
    // 简单的标签匹配逻辑
    const tagMatch = pending.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)/g);
    if (tagMatch) {
      const openTags = tagMatch.filter((tag) => !tag.startsWith('</')).length;
      const closeTags = tagMatch.filter((tag) => tag.startsWith('</')).length;

      if (openTags === closeTags && pending.endsWith('>')) {
        context.inHtml = false;
        commitCache(cache);
      }
    }

    // 简单的自闭合标签检查
    if (/<[^>]*\/>$/.test(pending + char)) {
      context.inHtml = false;
      commitCache(cache);
    }
  }
};

// 行内代码识别器
const recognizeInlineCode = (cache: StreamCache, char: string) => {
  const { pending } = cache;

  if (cache.token === TokenType.Text && char === '`' && !cache.context.inCodeBlock) {
    const backtickCount = (pending.match(/`+$/g) || [''])[0].length + 1;
    if (backtickCount <= 2) {
      cache.token = TokenType.IncompleteCode;
    }
  } else if (cache.token === TokenType.IncompleteCode && !cache.context.inCodeBlock) {
    const backtickCount = (pending.match(/`+$/g) || [''])[0].length;
    if (backtickCount >= 1 && char !== '`') {
      // 检查是否闭合
      const ticks = pending.match(/(`+)[^`]*$/);
      if (ticks && pending.endsWith(ticks[1])) {
        commitCache(cache);
      }
    }
  }
};

// 水平线识别器
const recognizeHr = (cache: StreamCache, char: string) => {
  const { pending } = cache;

  if (cache.token === TokenType.Text && (char === '-' || char === '=' || char === '*')) {
    cache.token = TokenType.IncompleteHr;
    return;
  }

  if (cache.token === TokenType.IncompleteHr) {
    const text = pending + char;

    // 检查是否是有效的水平线
    if (/^(---+|===+|\*\*\*+)[\s\n]*$/.test(text)) {
      commitCache(cache);
    } else if (!/^[-=*\s]*$/.test(text)) {
      // 包含其他字符，不是水平线
      commitCache(cache);
    }
  }
};

// 强调识别器
const recognizeEmphasis = (cache: StreamCache, char: string) => {
  const { pending } = cache;

  if (cache.token === TokenType.Text && (char === '*' || char === '_')) {
    cache.token = TokenType.IncompleteEmphasis;
    return;
  }

  if (cache.token === TokenType.IncompleteEmphasis) {
    const text = pending + char;

    // 检查是否是有效的强调语法
    if (
      /\*\*[^*\n]*\*\*$/.test(text) ||
      /__[^_\n]*__$/.test(text) ||
      /\*[^*\n]*\*$/.test(text) ||
      /_[^_\n]*_$/.test(text)
    ) {
      commitCache(cache);
    } else if (char === '\n' || /^\s/.test(text)) {
      // 遇到换行或空格，结束强调
      commitCache(cache);
    }
  }
};

// 列表识别器
const recognizeList = (cache: StreamCache, char: string) => {
  const { pending } = cache;

  if (cache.token === TokenType.Text && /^\s*[-*+]\s$/.test(pending + char)) {
    cache.token = TokenType.IncompleteList;
    return;
  }

  if (cache.token === TokenType.IncompleteList) {
    const text = pending + char;

    // 检查是否是有效的列表项
    if (/^\s*[-*+]\s+\S/.test(text)) {
      commitCache(cache);
    } else if (!/^\s*[-*+\s]*$/.test(text)) {
      commitCache(cache);
    }
  }
};

// 表格识别器
const recognizeTable = (cache: StreamCache, char: string) => {
  const { pending } = cache;

  if (cache.token === TokenType.Text && char === '|') {
    cache.token = TokenType.IncompleteTable;
    return;
  }

  if (cache.token === TokenType.IncompleteTable) {
    const text = pending + char;

    // 检查是否是有效的表格行
    if (/\|.*\|\s*$/.test(text)) {
      commitCache(cache);
    }
  }
};

// 引用识别器
const recognizeBlockquote = (cache: StreamCache, char: string) => {
  const { pending } = cache;

  if (cache.token === TokenType.Text && char === '>' && !pending.trim()) {
    cache.token = TokenType.IncompleteBlockquote;
    return;
  }

  if (cache.token === TokenType.IncompleteBlockquote) {
    const text = pending + char;

    if (/^>\s+\S/.test(text)) {
      commitCache(cache);
    }
  }
};

const recognizers = [
  recognizeCode,
  recognizeInlineCode,
  recognizeImage,
  recognizeLink,
  recognizeEmphasis,
  recognizeHeading,
  recognizeHtml,
  recognizeHr,
  recognizeList,
  recognizeTable,
  recognizeBlockquote,
];

// 优化的未完成markdown处理
const handleIncompleteMarkdown = (
  cache: StreamCache,
  incompleteMarkdownComponentMap: NonNullable<
    XMarkdownProps['streaming']
  >['incompleteMarkdownComponentMap'],
) => {
  if (cache.token === TokenType.Text) return;

  const components: Record<number, string> = {
    [TokenType.IncompleteImage]: 'image',
    [TokenType.IncompleteLink]: 'link',
    [TokenType.IncompleteCode]: 'code',
    [TokenType.IncompleteHeading]: 'heading',
    [TokenType.IncompleteHtml]: 'html',
    [TokenType.IncompleteHr]: 'hr',
    [TokenType.IncompleteList]: 'list',
    [TokenType.IncompleteEmphasis]: 'emphasis',
    [TokenType.IncompleteTable]: 'table',
    [TokenType.IncompleteBlockquote]: 'blockquote',
  };

  const componentType = components[cache.token];
  if (
    componentType &&
    incompleteMarkdownComponentMap &&
    componentType in incompleteMarkdownComponentMap
  ) {
    const tagName =
      incompleteMarkdownComponentMap[componentType as keyof typeof incompleteMarkdownComponentMap];
    if (tagName) {
      return `<${tagName} />`;
    }
  }

  // 默认占位符
  const defaultPlaceholders: Record<number, string> = {
    [TokenType.IncompleteImage]: '<incomplete-image />',
    [TokenType.IncompleteLink]: '<incomplete-link />',
    [TokenType.IncompleteCode]: '<incomplete-code />',
    [TokenType.IncompleteHeading]: '<incomplete-heading />',
    [TokenType.IncompleteHtml]: '<incomplete-html />',
    [TokenType.IncompleteHr]: '<incomplete-hr />',
    [TokenType.IncompleteList]: '<incomplete-list />',
    [TokenType.IncompleteEmphasis]: '<incomplete-emphasis />',
    [TokenType.IncompleteTable]: '<incomplete-table />',
    [TokenType.IncompleteBlockquote]: '<incomplete-blockquote />',
  };

  return defaultPlaceholders[cache.token] || '';
};

// 优化的流式处理hooks
const useStreaming = (input: string, config?: XMarkdownProps['streaming']) => {
  const { hasNextChunk: enableCache = false, incompleteMarkdownComponentMap } = config || {};
  const [output, setOutput] = useState('');
  const cacheRef = useRef<StreamCache>(getInitialCache());
  const processingRef = useRef(false);

  const processChunk = useCallback(
    (text: string) => {
      if (processingRef.current) return;
      processingRef.current = true;

      try {
        const cache = cacheRef.current;

        if (!text) {
          setOutput('');
          cacheRef.current = getInitialCache();
          return;
        }

        // 检查连续性
        if (!text.startsWith(cache.completeMarkdown + cache.pending)) {
          cacheRef.current = getInitialCache();
        }

        const chunk = text.slice(cache.processedLength);
        if (!chunk) {
          processingRef.current = false;
          return;
        }

        cache.processedLength += chunk.length;

        // 批量处理字符，减少循环次数
        let buffer = '';
        for (let i = 0; i < chunk.length; i++) {
          const char = chunk[i];

          // 批量处理连续的普通字符
          if (cache.token === TokenType.Text && !isSpecialChar(char)) {
            buffer += char;
            continue;
          }

          if (buffer) {
            cache.pending += buffer;
            buffer = '';
          }

          for (const recognizer of recognizers) {
            recognizer(cache, char);
          }
          cache.pending += char;
        }

        if (buffer) {
          cache.pending += buffer;
        }

        if (cache.token === TokenType.Text && cache.pending) {
          commitCache(cache);
        }

        const incompletePlaceholder = handleIncompleteMarkdown(
          cache,
          incompleteMarkdownComponentMap,
        );
        const markdownString = cache.completeMarkdown + (incompletePlaceholder || '');
        setOutput(markdownString);
      } catch (error) {
        console.error('Error processing markdown chunk:', error);
        setOutput(input);
      } finally {
        processingRef.current = false;
      }
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

    processChunk(input);
  }, [input, enableCache, processChunk]);

  return output;
};

// 工具函数：检查是否是特殊字符
function isSpecialChar(char: string): boolean {
  return /[![\]()`#*\-_=<>|]/.test(char);
}

export default useStreaming;
