import { useCallback, useEffect, useRef, useState } from 'react';
import { StreamCacheTokenType, XMarkdownProps } from '../interface';

/* ------------ Type ------------ */

export interface StreamCache {
  pending: string;
  token: StreamCacheTokenType;
  processedLength: number;
  completeMarkdown: string;
}

interface Recognizer {
  tokenType: StreamCacheTokenType;
  isStartOfToken: (markdown: string) => boolean;
  isStreamingValid: (markdown: string) => boolean;
}

/* ------------ Constants ------------ */
const FENCED_CODE_REGEX = /^(`{3,}|~{3,})/;

// Validates whether a token is still incomplete in the streaming context.
// Returns true if the token is syntactically incomplete; false if it is complete or invalid.
const STREAM_INCOMPLETE_REGEX = {
  image: [/^!\[[^\]\r\n]{0,1000}$/, /^!\[[^\r\n]{0,1000}\]\(*[^)\r\n]{0,1000}$/],
  link: [/^\[[^\]\r\n]{0,1000}$/, /^\[[^\r\n]{0,1000}\]\(*[^)\r\n]{0,1000}$/],
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

const tokenRecognizerMap: Partial<Record<StreamCacheTokenType, Recognizer>> = {
  [StreamCacheTokenType.Link]: {
    tokenType: StreamCacheTokenType.Link,
    isStartOfToken: (markdown: string) => markdown.startsWith('['),
    isStreamingValid: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.link.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.Image]: {
    tokenType: StreamCacheTokenType.Image,
    isStartOfToken: (markdown: string) => markdown.startsWith('!'),
    isStreamingValid: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.image.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.Html]: {
    tokenType: StreamCacheTokenType.Html,
    isStartOfToken: (markdown: string) => markdown.startsWith('<'),
    isStreamingValid: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.html.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.Emphasis]: {
    tokenType: StreamCacheTokenType.Emphasis,
    isStartOfToken: (markdown: string) => markdown.startsWith('*') || markdown.startsWith('_'),
    isStreamingValid: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.commonEmphasis.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.List]: {
    tokenType: StreamCacheTokenType.List,
    isStartOfToken: (markdown: string) => /^[-+*]/.test(markdown),
    isStreamingValid: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.list.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.Table]: {
    tokenType: StreamCacheTokenType.Table,
    isStartOfToken: (markdown: string) => markdown.startsWith('|'),
    isStreamingValid: isTableInComplete,
  },
};

const recognize = (cache: StreamCache, tokenType: StreamCacheTokenType): void => {
  const recognizer = tokenRecognizerMap[tokenType];
  if (!recognizer) return;

  const { token, pending } = cache;
  if (token === StreamCacheTokenType.Text && recognizer.isStartOfToken(pending)) {
    cache.token = tokenType;
    return;
  }

  if (token === tokenType && !recognizer.isStreamingValid(pending)) {
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
  token: StreamCacheTokenType.Text,
  processedLength: 0,
  completeMarkdown: '',
});

const commitCache = (cache: StreamCache): void => {
  if (cache.pending) {
    cache.completeMarkdown += cache.pending;
    cache.pending = '';
  }
  cache.token = StreamCacheTokenType.Text;
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

const safeEncodeURIComponent = (str: string): string => {
  try {
    return encodeURIComponent(str);
  } catch (e) {
    if (e instanceof URIError) {
      const cleanedStr = str.replace(
        /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
        '',
      );
      return encodeURIComponent(cleanedStr);
    }

    return '';
  }
};

/* ------------ Main Hook ------------ */
const useStreaming = (
  input: string,
  config?: { streaming: XMarkdownProps['streaming']; components?: XMarkdownProps['components'] },
) => {
  const { streaming, components = {} } = config || {};
  const { hasNextChunk: enableCache = false, incompleteMarkdownComponentMap } = streaming || {};
  const [output, setOutput] = useState('');
  const cacheRef = useRef<StreamCache>(getInitialCache());

  const handleIncompleteMarkdown = useCallback(
    (cache: StreamCache): string | undefined => {
      const { token, pending } = cache;
      if (token === StreamCacheTokenType.Text) return;
      /**
       * An image tag starts with '!', if it's the only character, it's incomplete and should be stripped.
       * ！
       * ^
       */
      if (token === StreamCacheTokenType.Image && pending === '!') return undefined;

      /**
       * If a table has more than two lines (header, separator, and at least one row),
       * it's considered complete enough to not be replaced by a placeholder.
       * | column1 | column2 |\n| -- | --|\n
       *                                   ^
       */
      if (token === StreamCacheTokenType.Table && pending.split('\n').length > 2) {
        return pending;
      }

      const componentMap = incompleteMarkdownComponentMap || {};
      const componentName = componentMap[token] || `incomplete-${token}`;
      const encodedPending = safeEncodeURIComponent(pending);

      return components?.[componentName]
        ? `<${componentName} data-raw="${encodedPending}" />`
        : undefined;
    },
    [incompleteMarkdownComponentMap, components],
  );

  const processStreaming = useCallback(
    (text: string): void => {
      if (!text) {
        setOutput('');
        cacheRef.current = getInitialCache();
        return;
      }

      const expectedPrefix = cacheRef.current.completeMarkdown + cacheRef.current.pending;
      // Reset cache if input doesn't continue from previous state
      if (!text.startsWith(expectedPrefix)) {
        cacheRef.current = getInitialCache();
      }

      const cache = cacheRef.current;
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

        if (cache.token === StreamCacheTokenType.Text) {
          for (const handler of recognizeHandlers) handler.recognize(cache);
        } else {
          const handler = recognizeHandlers.find((handler) => handler.tokenType === cache.token);
          handler?.recognize(cache);
        }

        if (cache.token === StreamCacheTokenType.Text) {
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
