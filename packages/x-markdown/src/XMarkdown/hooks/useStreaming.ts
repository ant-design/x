import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { XMarkdownProps } from '../interface';

/* ------------ Type ------------ */
export enum TokenType {
  Text = 0,
  IncompleteLink = 1,
  IncompleteImage = 2,
  IncompleteHeading = 3,
  IncompleteHtml = 4,
  IncompleteEmphasis = 5,
  IncompleteList = 6,
  MaybeImage = 7,
}

export interface StreamCache {
  pending: string;
  token: TokenType;
  processedLength: number;
  completeMarkdown: string;
}

/* ------------ Constants ------------ */
const INCOMPLETE_REGEX = {
  image: [/^!\[[^\]\r\n]*$/, /^!\[[^\r\n]*\]\(*[^)\r\n]*$/],
  link: [/^\[[^\]\r\n]*$/, /^\[[^\r\n]*\]\(*[^)\r\n]*$/],
  atxHeading: [/^#{1,6}(?=\s)*$/],
  html: [/^<[a-zA-Z][a-zA-Z0-9-]*[^>\r\n]*$/],
  commonEmphasis: [/^(\*+|_+)(?!\s)(?!.*\1$)[\s\S]*$/],
  list: [/^[-+*]\s*$/],
} as const;

const FENCED_CODE_REGEX = /^(`{3,}|~{3,})/;

/* ------------ Utils ------------ */
const getInitialCache = (): StreamCache => ({
  pending: '',
  token: TokenType.Text,
  processedLength: 0,
  completeMarkdown: '',
});

const commitCache = (cache: StreamCache): void => {
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

    const fenceMatch = line.match(FENCED_CODE_REGEX);
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

/* ------------ Recognizers ------------ */
const isTokenIncomplete = {
  image: (markdown: string): boolean => INCOMPLETE_REGEX.image.some((re) => re.test(markdown)),
  link: (markdown: string): boolean => INCOMPLETE_REGEX.link.some((re) => re.test(markdown)),
  atxHeading: (markdown: string): boolean =>
    INCOMPLETE_REGEX.atxHeading.some((re) => re.test(markdown)),
  html: (markdown: string): boolean => INCOMPLETE_REGEX.html.some((re) => re.test(markdown)),
  commonEmphasis: (markdown: string): boolean =>
    INCOMPLETE_REGEX.commonEmphasis.some((re) => re.test(markdown)),
  list: (markdown: string): boolean => INCOMPLETE_REGEX.list.some((re) => re.test(markdown)),
};

const recognizeImage = (cache: StreamCache): void => {
  const { token, pending } = cache;

  if (token === TokenType.Text && pending.startsWith('!')) {
    cache.token = TokenType.MaybeImage;
    return;
  }

  if (token !== TokenType.IncompleteImage && token !== TokenType.MaybeImage) return;

  if (isTokenIncomplete.image(pending)) {
    cache.token = TokenType.IncompleteImage;
  } else {
    commitCache(cache);
  }
};

const recognizeLink = (cache: StreamCache): void => {
  const { token, pending } = cache;

  if (token === TokenType.Text && pending.startsWith('[')) {
    cache.token = TokenType.IncompleteLink;
    return;
  }

  if (token !== TokenType.IncompleteLink) return;

  if (!isTokenIncomplete.link(pending)) {
    commitCache(cache);
  }
};

const recognizeAtxHeading = (cache: StreamCache): void => {
  const { token, pending } = cache;

  if (token === TokenType.Text && pending.startsWith('#')) {
    cache.token = TokenType.IncompleteHeading;
    return;
  }

  if (token !== TokenType.IncompleteHeading) return;

  if (!isTokenIncomplete.atxHeading(pending)) {
    commitCache(cache);
  }
};

const recognizeHtml = (cache: StreamCache): void => {
  const { token, pending } = cache;

  if (token === TokenType.Text && pending.startsWith('<')) {
    cache.token = TokenType.IncompleteHtml;
    return;
  }

  if (token !== TokenType.IncompleteHtml) return;

  if (!isTokenIncomplete.html(pending)) {
    commitCache(cache);
  }
};

const recognizeEmphasis = (cache: StreamCache): void => {
  const { token, pending } = cache;
  const isEmphasisStart = pending.startsWith('*') || pending.startsWith('_');

  if (token === TokenType.Text && isEmphasisStart) {
    cache.token = TokenType.IncompleteEmphasis;
    return;
  }

  if (token !== TokenType.IncompleteEmphasis) return;

  if (!isTokenIncomplete.commonEmphasis(pending)) {
    commitCache(cache);
  }
};

const recognizeList = (cache: StreamCache): void => {
  const { token, pending } = cache;

  if (token === TokenType.Text && /^[-+*]/.test(pending)) {
    cache.token = TokenType.IncompleteList;
    return;
  }

  if (token !== TokenType.IncompleteList) return;

  if (!isTokenIncomplete.list(pending)) {
    commitCache(cache);
  }
};

const recognizeText = (cache: StreamCache): void => {
  if (cache.token === TokenType.Text) {
    commitCache(cache);
  }
};

/* ------------ Main Hook ------------ */
const useStreaming = (input: string, config?: XMarkdownProps['streaming']) => {
  const { hasNextChunk: enableCache = false, incompleteMarkdownComponentMap } = config || {};
  const [output, setOutput] = useState('');
  const cacheRef = useRef<StreamCache>(getInitialCache());

  // Memoize recognizers to avoid recreation on each render
  const recognizers = useMemo(
    () => [
      recognizeImage,
      recognizeLink,
      recognizeAtxHeading,
      recognizeEmphasis,
      recognizeHtml,
      recognizeList,
      recognizeText,
    ],
    [],
  );

  const handleIncompleteMarkdown = useCallback(
    (cache: StreamCache): string | undefined => {
      if (cache.token === TokenType.Text) return;

      const componentMap = incompleteMarkdownComponentMap || {};

      switch (cache.token) {
        case TokenType.IncompleteImage:
          return `<${componentMap.image || 'incomplete-image'} />`;
        case TokenType.IncompleteLink:
          return `<${componentMap.link || 'incomplete-link'} />`;
        default:
          return undefined;
      }
    },
    [incompleteMarkdownComponentMap],
  );

  const processStreaming = useCallback(
    (text: string): void => {
      if (!text) {
        setOutput('');
        cacheRef.current = getInitialCache();
        return;
      }

      const cache = cacheRef.current;
      const expectedPrefix = cache.completeMarkdown + cache.pending;

      // Reset cache if input doesn't continue from previous state
      if (!text.startsWith(expectedPrefix)) {
        cacheRef.current = getInitialCache();
      }

      const chunk = text.slice(cache.processedLength);
      if (!chunk) return;

      cache.processedLength += chunk.length;

      // Skip processing if inside code block

      for (const char of chunk) {
        cache.pending += char;

        if (isInCodeBlock(text)) {
          commitCache(cache);
        } else {
          // Process all recognizers
          for (const recognizer of recognizers) {
            recognizer(cache);
          }
        }
      }

      const incompletePlaceholder = handleIncompleteMarkdown(cache);
      setOutput(cache.completeMarkdown + (incompletePlaceholder || ''));
    },
    [recognizers, handleIncompleteMarkdown],
  );

  useEffect(() => {
    if (typeof input !== 'string') {
      console.error(`X-Markdown: input must be string, not ${typeof input}.`);
      setOutput('');
      return;
    }

    if (enableCache) {
      processStreaming(input);
    } else {
      setOutput(input);
    }
  }, [input, enableCache, processStreaming]);

  return output;
};

export default useStreaming;
