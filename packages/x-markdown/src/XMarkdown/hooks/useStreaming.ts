import { useCallback, useEffect, useRef, useState } from 'react';
import type { XMarkdownProps } from '../interface';

/* ------------ Type ------------ */
enum TokenType {
  Text = 0,
  IncompleteLink = 1,
  IncompleteImage = 2,
  IncompleteHeading = 3,
  IncompleteHtml = 4,
  IncompleteEmphasis = 5,
  MaybeImage = 6,
}

interface StreamCache {
  pending: string;
  token: TokenType;
  processedLength: number;
  completeMarkdown: string;
}

/* ------------ tools ------------ */
const getInitialCache = (): StreamCache => ({
  pending: '',
  token: TokenType.Text,
  processedLength: 0,
  completeMarkdown: '',
});

// 清空 pending
const commitCache = (cache: StreamCache) => {
  if (cache.pending) {
    cache.completeMarkdown += cache.pending;
    cache.pending = '';
  }

  cache.token = TokenType.Text;
};

const isInCodeBlock = (text: string): boolean => {
  const lines = text.split('\n');
  let inFenced = false;
  let fenceChar = '';
  let fenceLen = 0;

  for (const rawLine of lines) {
    const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine;

    // 检查 fenced 代码块（``` 或 ~~~）
    const fenceMatch = line.match(/^(`{3,}|~{3,})/);
    if (fenceMatch) {
      const currentFence = fenceMatch[1];
      const char = currentFence[0];
      const len = currentFence.length;

      if (!inFenced) {
        inFenced = true;
        fenceChar = char;
        fenceLen = len;
      } else if (char === fenceChar && len >= fenceLen) {
        inFenced = false;
        fenceChar = '';
        fenceLen = 0;
      }
    }
  }

  return inFenced;
};

/* ------------ recognizer ------------ */
const isTokenIncomplete = {
  image: (markdown: string) =>
    [/^!\[[^\]\r\n]*$/, /^!\[[^\r\n]*\]\(*[^)\r\n]*$/].some((re) => re.test(markdown)),
  link: (markdown: string) =>
    [/^\[[^\]\r\n]*$/, /^\[[^\r\n]*\]\(*[^)\r\n]*$/].some((re) => re.test(markdown)),
  atxHeading: (markdown: string) =>
    [/^#{1,6}$/, /^#{1,6}(?=\s)[^\r\n]*$/].some((re) => re.test(markdown)),
  html: (markdown: string) => [/^<[a-zA-Z][a-zA-Z0-9-]*[^>\r\n]*$/].some((re) => re.test(markdown)),
  commonEmphasis: (markdown: string) =>
    [
      /^\*(?!\s)[^*\r\n]*$/,
      /^\*\*(?!\s)[^**\r\n]*$/,
      /^_(?!\s)[^_\r\n]*$/,
      /^__(?!\s)[^__\r\n]*$/,
    ].some((re) => re.test(markdown)),
};

const recognizeImage = (cache: StreamCache) => {
  const { token, pending } = cache;
  if (token === TokenType.Text && pending.startsWith('!')) {
    cache.token = TokenType.MaybeImage;
    return;
  }

  if (token === TokenType.IncompleteImage || token === TokenType.MaybeImage) {
    const isIncomplete = isTokenIncomplete.image(pending);
    if (isIncomplete) {
      cache.token = TokenType.IncompleteImage;
    } else {
      commitCache(cache);
    }
  }
};

const recognizeLink = (cache: StreamCache) => {
  const { token, pending } = cache;
  if (token === TokenType.Text && pending.startsWith('[')) {
    cache.token = TokenType.IncompleteLink;
    return;
  }

  if (token === TokenType.IncompleteLink) {
    const isIncomplete = isTokenIncomplete.link(pending);
    if (isIncomplete) {
      cache.token = TokenType.IncompleteLink;
    } else {
      commitCache(cache);
    }
  }
};

const recognizeAtxHeading = (cache: StreamCache) => {
  const { token, pending } = cache;
  if (token === TokenType.Text && pending.startsWith('#')) {
    cache.token = TokenType.IncompleteHeading;
    return;
  }

  if (token === TokenType.IncompleteHeading) {
    const isIncomplete = isTokenIncomplete.atxHeading(pending);
    if (isIncomplete) {
      cache.token = TokenType.IncompleteHeading;
    } else {
      commitCache(cache);
    }
  }
};

const recognizeHtml = (cache: StreamCache) => {
  const { token, pending } = cache;
  if (token === TokenType.Text && pending.startsWith('<')) {
    cache.token = TokenType.IncompleteHtml;
    return;
  }

  if (token === TokenType.IncompleteHtml) {
    const isIncomplete = isTokenIncomplete.html(pending);
    if (!isIncomplete) {
      commitCache(cache);
    }
  }
};

const recognizeEmphasis = (cache: StreamCache) => {
  const { token, pending } = cache;
  const isEmphasisStart = pending.startsWith('*') || pending.startsWith('_');
  if (token === TokenType.Text && isEmphasisStart) {
    cache.token = TokenType.IncompleteEmphasis;
    return;
  }

  if (token === TokenType.IncompleteEmphasis) {
    const isIncomplete = isTokenIncomplete.commonEmphasis(pending);
    if (!isIncomplete) {
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
  recognizeAtxHeading,
  recognizeEmphasis,
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

      if (!isInCodeBlock(text)) {
        // handle new chunk
        const chunk = text.slice(cache.processedLength);
        if (!chunk) return;

        cache.processedLength += chunk.length;
        cache.pending += chunk;
        for (const recognizer of recognizers) {
          recognizer(cache);
        }
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
