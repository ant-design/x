import { useCallback, useEffect, useRef, useState } from 'react';
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
  IncompleteTable = 7,
}

export interface StreamCache {
  pending: string;
  token: TokenType;
  processedLength: number;
  completeMarkdown: string;
}

interface Recognizer {
  tokenType: TokenType;
  isStartOfToken: (markdown: string) => boolean;
  isInComplete: (markdown: string) => boolean;
}

/* ------------ Constants ------------ */
const FENCED_CODE_REGEX = /^(`{3,}|~{3,})/;

// Validates whether a token is still incomplete in the streaming context.
// Returns true if the token is syntactically incomplete; false if it is complete or invalid.
const STREAM_INCOMPLETE_REGEX = {
  image: [/^!\[[^\]\r\n]{0,1000}$/, /^!\[[^\r\n]{0,1000}\]\(*[^)\r\n]{0,1000}$/],
  link: [/^\[[^\]\r\n]{0,1000}$/, /^\[[^\r\n]{0,1000}\]\(*[^)\r\n]{0,1000}$/],
  atxHeading: [/^#{1,6}\s*$/],
  html: [/^<\/$/, /^<\/?[a-zA-Z][a-zA-Z0-9-]{0,100}[^>\r\n]{0,1000}$/],
  commonEmphasis: [/^(\*{1,3}|_{1,3})(?!\s)(?!.*\1$)[^\r\n]{0,1000}$/],
  // regex2 matches cases like "- **"
  list: [/^[-+*]\s{0,3}$/, /^[-+*]\s{1,3}(\*{1,3}|_{1,3})(?!\s)(?!.*\1$)[^\r\n]{0,1000}$/],
} as const;

const isTableInComplete = (markdown: string) => {
  if (markdown.includes('\n\n')) return false;

  const lines = markdown.split('\n');
  if (lines.length <= 1) return true;

  const [header, separator] = lines;
  const trimmedHeader = header.trim();
  if (!/^\|.*\|$/.test(trimmedHeader)) return false;

  const trimmedSeparator = separator.trim();
  const columns = trimmedSeparator
    .split('|')
    .map((col) => col.trim())
    .filter(Boolean);

  const separatorRegex = /^:?-+:?$/;
  return columns.every((col, index) =>
    index === columns.length - 1
      ? col === ':' || separatorRegex.test(col)
      : separatorRegex.test(col),
  );
};

const tokenRecognizerMap: Partial<Record<TokenType, Recognizer>> = {
  [TokenType.IncompleteLink]: {
    tokenType: TokenType.IncompleteLink,
    isStartOfToken: (markdown: string) => markdown.startsWith('['),
    isInComplete: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.link.some((re) => re.test(markdown)),
  },
  [TokenType.IncompleteImage]: {
    tokenType: TokenType.IncompleteImage,
    isStartOfToken: (markdown: string) => markdown.startsWith('!'),
    isInComplete: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.image.some((re) => re.test(markdown)),
  },
  [TokenType.IncompleteHeading]: {
    tokenType: TokenType.IncompleteHeading,
    isStartOfToken: (markdown: string) => markdown.startsWith('#'),
    isInComplete: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.atxHeading.some((re) => re.test(markdown)),
  },
  [TokenType.IncompleteHtml]: {
    tokenType: TokenType.IncompleteHtml,
    isStartOfToken: (markdown: string) => markdown.startsWith('<'),
    isInComplete: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.html.some((re) => re.test(markdown)),
  },
  [TokenType.IncompleteEmphasis]: {
    tokenType: TokenType.IncompleteEmphasis,
    isStartOfToken: (markdown: string) => markdown.startsWith('*') || markdown.startsWith('_'),
    isInComplete: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.commonEmphasis.some((re) => re.test(markdown)),
  },
  [TokenType.IncompleteList]: {
    tokenType: TokenType.IncompleteList,
    isStartOfToken: (markdown: string) => /^[-+*]/.test(markdown),
    isInComplete: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.list.some((re) => re.test(markdown)),
  },
  [TokenType.IncompleteTable]: {
    tokenType: TokenType.IncompleteTable,
    isStartOfToken: (markdown: string) => markdown.startsWith('|'),
    isInComplete: isTableInComplete,
  },
};

const recognize = (cache: StreamCache, tokenType: TokenType): void => {
  const recognizer = tokenRecognizerMap[tokenType];
  if (!recognizer) return;

  const { token, pending } = cache;
  if (token === TokenType.Text && recognizer.isStartOfToken(pending)) {
    cache.token = tokenType;
    return;
  }

  if (token === tokenType && !recognizer.isInComplete(pending)) {
    commitCache(cache);
  }
};

const recognizeHandlers = Object.values(tokenRecognizerMap).map((rec) => ({
  tokenType: rec.tokenType,
  recognize: (cache: StreamCache) => recognize(cache, rec.tokenType),
}));

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

/* ------------ Main Hook ------------ */
const useStreaming = (input: string, config?: XMarkdownProps['streaming']) => {
  const { hasNextChunk: enableCache = false, incompleteMarkdownComponentMap } = config || {};
  const [output, setOutput] = useState('');
  const cacheRef = useRef<StreamCache>(getInitialCache());

  const handleIncompleteMarkdown = useCallback(
    (cache: StreamCache): string | undefined => {
      const { token, pending } = cache;
      if (token === TokenType.Text) return;

      const componentMap = incompleteMarkdownComponentMap || {};
      switch (token) {
        case TokenType.IncompleteImage:
          return pending === '!' ? undefined : `<${componentMap.image || 'incomplete-image'} />`;
        case TokenType.IncompleteLink:
          return `<${componentMap.link || 'incomplete-link'} />`;
        case TokenType.IncompleteTable:
          return pending.split('\n').length <= 2
            ? `<${componentMap.table || 'incomplete-table'} />`
            : pending;
        case TokenType.IncompleteHtml:
          return `<${componentMap.html || 'incomplete-html'} />`;
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
      const isTextInBlock = isInCodeBlock(text);
      for (const char of chunk) {
        cache.pending += char;
        // Skip processing if inside code block
        if (isTextInBlock) {
          commitCache(cache);
          continue;
        }

        if (cache.token === TokenType.Text) {
          for (const handler of recognizeHandlers) handler.recognize(cache);
        } else {
          const handler = recognizeHandlers.find((handler) => handler.tokenType === cache.token);
          handler?.recognize(cache);
        }

        if (cache.token === TokenType.Text) {
          commitCache(cache);
        }
      }

      const incompletePlaceholder = handleIncompleteMarkdown(cache);
      setOutput(cache.completeMarkdown + (incompletePlaceholder || ''));
    },
    [handleIncompleteMarkdown],
  );

  useEffect(() => {
    if (typeof input !== 'string') {
      console.error(`X-Markdown: input must be string, not ${typeof input}.`);
      setOutput('');
      return;
    }

    enableCache ? processStreaming(input) : setOutput(input);
  }, [input, enableCache, processStreaming]);

  return output;
};

export default useStreaming;
