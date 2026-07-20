import { useCallback, useEffect, useRef, useState } from 'react';
import { StreamCacheTokenType, XMarkdownProps } from '../interface';

/* ------------ Type ------------ */

export interface StreamCache {
  pending: string;
  token: StreamCacheTokenType;
  processedLength: number;
  completeMarkdown: string;
  fence: FenceState;
}

/**
 * Incremental fenced-code-block state over the processed text, updated in O(1)
 * per character. Recomputing over the full accumulated text on every character
 * is O(N²) and freezes the page on long single-line content such as base64
 * image data URIs.
 */
interface FenceState {
  /** Inside an open fence, considering completed lines only */
  inFenced: boolean;
  fenceChar: string;
  fenceLen: number;
  /** Leading `/~ run of the current (incomplete) line */
  lineFenceChar: string;
  lineFenceLen: number;
  lineFenceRunEnded: boolean;
  /** Whether every char after the leading run is whitespace (closing fences allow only whitespace) */
  lineTailBlank: boolean;
}

/**
 * When a token is about to be committed, if a non-empty string is returned,
 * only that prefix is committed and the rest of the pending content is left
 * for subsequent recognition (used for handover scenarios like list followed by `).
 * Returns null to commit the entire pending content by default.
 */
interface Recognizer {
  tokenType: StreamCacheTokenType;
  isStartOfToken: (markdown: string) => boolean;
  isStreamingValid: (markdown: string) => boolean;
  /** Optional: prefix for partial commit, useful for extending handover logic
   * when the current token ends and is immediately followed by the start symbol
   * of the next token */
  getCommitPrefix?: (pending: string) => string | null;
}

/* ------------ Constants ------------ */
// Validates whether a token is still incomplete in the streaming context.
// Returns true if the token is syntactically incomplete; false if it is complete or invalid.
const STREAM_INCOMPLETE_REGEX = {
  image: [/^!\[[^\]\r\n]{0,1000}$/, /^!\[[^\r\n]{0,1000}\]\(*[^)\r\n]{0,1000}$/],
  link: [/^\[[^\]\r\n]{0,1000}$/, /^\[[^\r\n]{0,1000}\]\(*[^)\r\n]{0,1000}$/],
  html: [/^<\/$/, /^<\/?[a-zA-Z][a-zA-Z0-9-]{0,100}[^>\r\n]{0,1000}$/],
  commonEmphasis: [/^(\*{1,3}|_{1,3})(?!\s)(?!.*\1$)[^\r\n]{0,1000}$/],
  // regex2 matches cases like "- **" (list item with emphasis start).
  list: [/^[-+*]\s{0,3}$/, /^[-+*]\s{1,3}(\*{1,3}|_{1,3})(?!\s)(?!.*\1$)[^\r\n]{0,1000}$/],
  'inline-code': [/^`[^`\r\n]{0,300}$/],
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
    // On backtick after list, commit only the prefix; treat the rest as inline code.
    getCommitPrefix: (pending: string) => {
      const listPrefix = pending.match(/^([-+*]\s{0,3})/)?.[1];
      const rest = listPrefix ? pending.slice(listPrefix.length) : '';
      return listPrefix && rest.startsWith('`') ? listPrefix : null;
    },
  },
  [StreamCacheTokenType.Table]: {
    tokenType: StreamCacheTokenType.Table,
    isStartOfToken: (markdown: string) => markdown.startsWith('|'),
    isStreamingValid: isTableInComplete,
  },
  [StreamCacheTokenType.InlineCode]: {
    tokenType: StreamCacheTokenType.InlineCode,
    isStartOfToken: (markdown: string) => markdown.startsWith('`'),
    isStreamingValid: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX['inline-code'].some((re) => re.test(markdown)),
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
    const prefix = recognizer.getCommitPrefix?.(pending);
    if (prefix) {
      cache.completeMarkdown += prefix;
      cache.pending = pending.slice(prefix.length);
      cache.token = StreamCacheTokenType.Text;
      return;
    }
    commitCache(cache);
  }
};

const recognizeHandlers = Object.values(tokenRecognizerMap).map((rec) => ({
  tokenType: rec.tokenType,
  recognize: (cache: StreamCache) => recognize(cache, rec.tokenType),
}));

/* ------------ Utils ------------ */
const getInitialFenceState = (): FenceState => ({
  inFenced: false,
  fenceChar: '',
  fenceLen: 0,
  lineFenceChar: '',
  lineFenceLen: 0,
  lineFenceRunEnded: false,
  lineTailBlank: true,
});

const getInitialCache = (): StreamCache => ({
  pending: '',
  token: StreamCacheTokenType.Text,
  processedLength: 0,
  completeMarkdown: '',
  fence: getInitialFenceState(),
});

const commitCache = (cache: StreamCache): void => {
  if (cache.pending) {
    cache.completeMarkdown += cache.pending;
    cache.pending = '';
  }
  cache.token = StreamCacheTokenType.Text;
};

const feedFenceState = (fence: FenceState, char: string): void => {
  if (char === '\n') {
    // Line completed: apply it to the fence state, then reset per-line tracking.
    if (fence.lineFenceLen >= 3) {
      if (!fence.inFenced) {
        fence.inFenced = true;
        fence.fenceChar = fence.lineFenceChar;
        fence.fenceLen = fence.lineFenceLen;
      } else if (
        fence.lineFenceChar === fence.fenceChar &&
        fence.lineFenceLen >= fence.fenceLen &&
        fence.lineTailBlank
      ) {
        // A closing fence only takes effect once its line is completed by a
        // newline; while it is still the last partial line the fence stays
        // open for potential streaming continuation.
        fence.inFenced = false;
        fence.fenceChar = '';
        fence.fenceLen = 0;
      }
    }
    fence.lineFenceChar = '';
    fence.lineFenceLen = 0;
    fence.lineFenceRunEnded = false;
    fence.lineTailBlank = true;
    return;
  }

  if (!fence.lineFenceRunEnded) {
    if (fence.lineFenceLen === 0 && (char === '`' || char === '~')) {
      fence.lineFenceChar = char;
      fence.lineFenceLen = 1;
    } else if (fence.lineFenceLen > 0 && char === fence.lineFenceChar) {
      fence.lineFenceLen += 1;
    } else {
      fence.lineFenceRunEnded = true;
      fence.lineTailBlank = fence.lineTailBlank && /\s/.test(char);
    }
  } else {
    fence.lineTailBlank = fence.lineTailBlank && /\s/.test(char);
  }
};

// An opening fence takes effect as soon as it appears, even on the partial last line.
const isInCodeBlock = (fence: FenceState): boolean => fence.inFenced || fence.lineFenceLen >= 3;

const sanitizeForURIComponent = (input: string): string => {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);

    // 处理代理对：保留合法，跳过孤立
    if (charCode >= 0xd800 && charCode <= 0xdbff) {
      // High surrogate
      // Check for a following low surrogate to form a valid pair
      if (
        i + 1 < input.length &&
        input.charCodeAt(i + 1) >= 0xdc00 &&
        input.charCodeAt(i + 1) <= 0xdfff
      ) {
        result += input[i] + input[i + 1];
        i++; // Skip the low surrogate as it's already processed
      }
      // Lone high surrogates are otherwise skipped
    } else if (charCode < 0xdc00 || charCode > 0xdfff) {
      // Append characters that are not lone low surrogates
      result += input[i];
    }
    // Lone low surrogates are otherwise skipped
  }
  return result;
};

const safeEncodeURIComponent = (str: string): string => {
  try {
    return encodeURIComponent(str);
  } catch (e) {
    if (e instanceof URIError) {
      return encodeURIComponent(sanitizeForURIComponent(str));
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
  const [streamingOutput, setStreamingOutput] = useState('');
  // Non-streaming: seed output with full input so the first paint renders complete content and avoids layout jitter.
  const output = enableCache ? streamingOutput : typeof input === 'string' ? input : '';
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
        setStreamingOutput('');
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
      for (const char of chunk) {
        cache.pending += char;
        feedFenceState(cache.fence, char);
        if (isInCodeBlock(cache.fence)) {
          commitCache(cache);
          continue;
        }
        if (cache.token === StreamCacheTokenType.Text) {
          for (const handler of recognizeHandlers) handler.recognize(cache);
        } else {
          const handler = recognizeHandlers.find((handler) => handler.tokenType === cache.token);
          handler?.recognize(cache);
          // After commit (e.g. list → Text), re-run all recognizers so pending (e.g. "`") becomes the new token (e.g. inline-code)
          const tokenAfterRecognize = cache.token as StreamCacheTokenType;
          if (tokenAfterRecognize === StreamCacheTokenType.Text) {
            for (const h of recognizeHandlers) h.recognize(cache);
          }
        }

        if (cache.token === StreamCacheTokenType.Text) {
          commitCache(cache);
        }
      }

      const incompletePlaceholder = handleIncompleteMarkdown(cache);
      setStreamingOutput(cache.completeMarkdown + (incompletePlaceholder || ''));
    },
    [handleIncompleteMarkdown],
  );

  useEffect(() => {
    if (typeof input !== 'string') {
      console.error(`X-Markdown: input must be string, not ${typeof input}.`);
      setStreamingOutput('');
      return;
    }

    if (enableCache) {
      processStreaming(input);
    }
  }, [input, enableCache, processStreaming]);

  return output;
};

export default useStreaming;
