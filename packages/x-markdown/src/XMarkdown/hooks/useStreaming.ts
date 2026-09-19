import { useCallback, useEffect, useMemo, useRef } from 'react';
import { detectUnclosedComponentTags } from '../core/detectUnclosedComponentTags';
import { StreamCacheTokenType, StreamingOption, XMarkdownProps } from '../interface';

/* ------------ Type ------------ */

export interface StreamCache {
  pending: string;
  token: StreamCacheTokenType;
  processedLength: number;
  completeMarkdown: string;
  fence: FenceState;
  table: TableState;
  sections: SectionState;
}

/**
 * Incremental section-boundary state for `streaming.incremental`. A section
 * boundary is an offset (into the input) where a new top-level block starts
 * and everything before it can be parsed on its own with the same result as
 * parsing the whole document. Only column-0 ATX headings preceded by a blank
 * line qualify; see `trackSectionBoundary` for the constructs that veto one.
 */
interface SectionState {
  /** Offsets where a new section starts. The first section implicitly starts at 0. */
  offsets: number[];
  /** Offset of the first character of the line currently being streamed */
  lineStart: number;
  /**
   * Inside an HTML block of CommonMark type 3–7, which ends at the next blank
   * line. A `#` line inside it is HTML text, not a heading.
   */
  inHtmlBlock: boolean;
  /**
   * Set once a construct that can be referenced from another section has been
   * seen (link reference / footnote definitions). Splitting is disabled for the
   * rest of the stream and any offsets recorded so far are discarded.
   */
  noSplit: boolean;
  /**
   * An open block whose body may contain blank lines and heading-looking lines
   * (`<pre>`, `<script>`, `<style>`, `<textarea>`, HTML comments, `$$` math,
   * `\[` math). No boundary is recorded until it closes.
   */
  rawBlock: { close: string; exact: boolean } | null;
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
 * Incremental table-shape state over `pending`, updated in O(1) per character —
 * the same trick FenceState already uses. The table recognizer used to re-scan
 * the whole pending buffer on every character (`includes('\n\n')` plus
 * `split('\n')`), and a table stays pending until its terminating blank line,
 * so a long table cost O(N²) in total.
 */
interface TableState {
  /** Number of '\n' seen in pending */
  newlines: number;
  /** Whether the previous character was '\n' (used to detect the '\n\n' terminator) */
  lastWasNewline: boolean;
  /** pending contains a blank line, i.e. the table block already ended */
  hasBlankLine: boolean;
  /** pending's first line — the header row */
  firstLine: string;
  /** pending's second line — the delimiter row; may still be growing */
  secondLine: string;
  /**
   * Memoized header/delimiter verdict. Stays null while the delimiter row is
   * still being streamed (the verdict can change as it grows) and is frozen
   * once that row is terminated, after which it never changes again.
   */
  shape: boolean | null;
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
  isStreamingValid: (markdown: string, cache: StreamCache) => boolean;
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

/** Header + delimiter row shape check. Cost is bounded by those two rows, not by pending. */
const isTableShapeValid = (header: string, separator: string) => {
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

/**
 * Same verdict as scanning the whole pending buffer, but read off the
 * incrementally maintained state instead — O(1) once the delimiter row is
 * terminated, which is where a long table spends all of its characters.
 */
const isTableInComplete = (table: TableState) => {
  if (table.hasBlankLine) return false;
  // Only the header row so far: still incomplete by definition.
  if (table.newlines === 0) return true;
  if (table.shape !== null) return table.shape;
  return isTableShapeValid(table.firstLine, table.secondLine);
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
    isStreamingValid: (_markdown: string, cache: StreamCache) => isTableInComplete(cache.table),
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

  if (token === tokenType && !recognizer.isStreamingValid(pending, cache)) {
    const prefix = recognizer.getCommitPrefix?.(pending);
    if (prefix) {
      cache.completeMarkdown += prefix;
      cache.pending = pending.slice(prefix.length);
      // pending was rewritten rather than appended to, so the incremental state
      // has to be rebuilt from it — a one-off cost over a single token's text.
      rebuildTableState(cache.table, cache.pending);
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

const getInitialTableState = (): TableState => ({
  newlines: 0,
  lastWasNewline: false,
  hasBlankLine: false,
  firstLine: '',
  secondLine: '',
  shape: null,
});

const resetTableState = (table: TableState): void => {
  table.newlines = 0;
  table.lastWasNewline = false;
  table.hasBlankLine = false;
  table.firstLine = '';
  table.secondLine = '';
  table.shape = null;
};

/** Advance the table state by one appended character. O(1). */
const feedTableState = (table: TableState, char: string): void => {
  if (char === '\n') {
    if (table.lastWasNewline) table.hasBlankLine = true;
    table.lastWasNewline = true;
    table.newlines += 1;
    // The delimiter row is terminated: its verdict can no longer change, so
    // freeze it and stop re-deriving it for every remaining character.
    if (table.newlines === 2) {
      table.shape = isTableShapeValid(table.firstLine, table.secondLine);
    }
    return;
  }
  table.lastWasNewline = false;
  if (table.newlines === 0) {
    table.firstLine += char;
  } else if (table.newlines === 1) {
    table.secondLine += char;
  }
};

/** Rebuild from scratch. Only used when pending is replaced instead of appended to. */
const rebuildTableState = (table: TableState, pending: string): void => {
  resetTableState(table);
  for (const char of pending) feedTableState(table, char);
};

const getInitialSectionState = (): SectionState => ({
  offsets: [],
  lineStart: 0,
  inHtmlBlock: false,
  noSplit: false,
  rawBlock: null,
});

const getInitialCache = (): StreamCache => ({
  pending: '',
  token: StreamCacheTokenType.Text,
  processedLength: 0,
  completeMarkdown: '',
  fence: getInitialFenceState(),
  table: getInitialTableState(),
  sections: getInitialSectionState(),
});

/* ------------ Sections ------------ */

/** Sections shorter than this are merged into the next one. */
export const DEFAULT_MIN_SECTION_CHARS = 200;

// Column-0 ATX heading. Indented (1–3 spaces) headings are deliberately not
// split on: the fence tracker only follows column-0 fences, so a column-0
// heading is the only line start that cannot be the body of an indented fence.
const HEADING_LINE = /^#{1,6}(?:[ \t]|$)/;
// Link reference definition or footnote definition. Either can be referenced
// from any other block of the document, so once one is seen the document is
// no longer splittable.
const DEFINITION_LINE = /^ {0,3}\[[^\]]*\]:/;
// HTML blocks of CommonMark type 1 (end only at their closing tag) and type 2
// (comments), plus the Latex plugin's block delimiters. All of them may
// contain blank lines followed by a `#` line that is *not* a heading.
const RAW_HTML_BLOCK_OPEN = /^ {0,3}<(pre|script|style|textarea)(?=[\s>]|$)/i;
const HTML_COMMENT_OPEN = /^ {0,3}<!--/;
const MATH_DOLLAR_LINE = /^(\${1,2})\s*$/;
const MATH_BRACKET_OPEN = /^\\\[/;
// Any other HTML block start (CommonMark types 3–7): a tag, closing tag,
// declaration or processing instruction at the start of a line. Such a block
// runs to the next blank line; treating every `<x` line this way is slightly
// conservative (type 7 cannot interrupt a paragraph) but never wrong.
const HTML_BLOCK_OPEN = /^ {0,3}<(?:[a-zA-Z]|\/[a-zA-Z]|!|\?)/;

const detectRawBlockOpen = (line: string): SectionState['rawBlock'] => {
  const html = line.match(RAW_HTML_BLOCK_OPEN);
  if (html) {
    const close = `</${html[1].toLowerCase()}`;
    return line.toLowerCase().includes(close) ? null : { close, exact: false };
  }
  if (HTML_COMMENT_OPEN.test(line)) {
    return line.includes('-->') ? null : { close: '-->', exact: false };
  }
  const dollar = line.match(MATH_DOLLAR_LINE);
  if (dollar) return { close: dollar[1], exact: true };
  if (MATH_BRACKET_OPEN.test(line)) {
    return line.includes('\\]') ? null : { close: '\\]', exact: false };
  }
  return null;
};

const closesRawBlock = (line: string, rawBlock: NonNullable<SectionState['rawBlock']>): boolean =>
  rawBlock.exact ? line.trim() === rawBlock.close : line.toLowerCase().includes(rawBlock.close);

/**
 * Called once per completed line (right after its '\n' has been fed to the
 * fence state). Decides whether the line that just ended starts a new section.
 * O(line) per line, so O(N) over the whole stream.
 */
const trackSectionBoundary = (
  cache: StreamCache,
  text: string,
  newlineIndex: number,
  componentNames: string[],
  minSectionChars: number,
): void => {
  const state = cache.sections;
  const lineStart = state.lineStart;
  const line = text.slice(lineStart, newlineIndex);
  const blank = line.trim() === '';
  state.lineStart = newlineIndex + 1;

  if (state.noSplit) return;
  if (state.rawBlock) {
    if (closesRawBlock(line, state.rawBlock)) state.rawBlock = null;
    return;
  }
  if (state.inHtmlBlock) {
    if (blank) state.inHtmlBlock = false;
    return;
  }
  // The fence state has already consumed this line's '\n': for a body line of
  // a fence it is still open, for the opening line it has just opened, and for
  // the closing line it has just closed. Neither an opening nor a closing
  // fence line can match the patterns below, so checking after the feed is safe.
  if (cache.fence.inFenced) return;

  const rawBlock = detectRawBlockOpen(line);
  if (rawBlock) {
    state.rawBlock = rawBlock;
    return;
  }
  if (HTML_BLOCK_OPEN.test(line)) {
    state.inHtmlBlock = true;
    return;
  }
  if (DEFINITION_LINE.test(line)) {
    state.noSplit = true;
    state.offsets = [];
    return;
  }
  // An ATX heading can interrupt a paragraph, a list, a blockquote and a GFM
  // table, so outside the constructs tracked above a column-0 heading line
  // always starts a new block — no blank line before it is required.
  if (!HEADING_LINE.test(line)) return;

  const sectionStart = state.offsets.length ? state.offsets[state.offsets.length - 1] : 0;
  // A boundary at the very start of the document (or of the current section)
  // would only produce an empty section.
  if (lineStart <= sectionStart || lineStart - sectionStart < minSectionChars) return;
  // A custom component opened in this section and closed in a later one would
  // be reported as unclosed (and auto-closed by DOMPurify) if the section were
  // parsed on its own.
  if (
    componentNames.length > 0 &&
    detectUnclosedComponentTags(text.slice(sectionStart, lineStart), componentNames).size > 0
  ) {
    return;
  }
  state.offsets.push(lineStart);
};

/**
 * Slice `output` at the recorded boundaries. A boundary past `limit` falls
 * inside the pending token — a heading right after a table row is held in the
 * table's pending text until the table's terminating blank line — and is left
 * for a later chunk.
 */
const buildSections = (cache: StreamCache, output: string, limit: number): string[] | null => {
  const { offsets } = cache.sections;
  if (cache.sections.noSplit || offsets.length === 0) return null;
  const sections: string[] = [];
  let start = 0;
  for (const offset of offsets) {
    if (offset > limit) break;
    sections.push(output.slice(start, offset));
    start = offset;
  }
  if (sections.length === 0) return null;
  sections.push(output.slice(start));
  return sections;
};

const commitCache = (cache: StreamCache): void => {
  if (cache.pending) {
    cache.completeMarkdown += cache.pending;
    cache.pending = '';
  }
  resetTableState(cache.table);
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

export interface StreamingConfig {
  streaming: XMarkdownProps['streaming'];
  components?: XMarkdownProps['components'];
}

export interface StreamingResult {
  /** The markdown to parse: committed text plus the placeholder for the pending token */
  output: string;
  /**
   * `output` split at section boundaries when `streaming.incremental` is on
   * and at least one boundary exists; `null` means render `output` as a whole.
   * Joining the sections always gives back `output`.
   */
  sections: string[] | null;
}

const EMPTY_RESULT: StreamingResult = { output: '', sections: null };

const resolveMinSectionChars = (incremental: StreamingOption['incremental']): number =>
  typeof incremental === 'object' && typeof incremental.minSectionChars === 'number'
    ? incremental.minSectionChars
    : DEFAULT_MIN_SECTION_CHARS;

/**
 * Streaming state machine plus, when `streaming.incremental` is on, the
 * section boundaries the renderer can memoise on. `useStreaming` is the
 * public string-only view of this hook.
 */
const useStreamingCore = (input: string, config?: StreamingConfig): StreamingResult => {
  const { streaming, components = {} } = config || {};
  const {
    hasNextChunk: enableCache = false,
    incompleteMarkdownComponentMap,
    incremental,
  } = streaming || {};
  const minSectionChars = resolveMinSectionChars(incremental);
  const trackSections = !!incremental;
  const cacheRef = useRef<StreamCache>(getInitialCache());
  // Only the names matter for the boundary guard; keep the array identity
  // stable across renders so processStreaming is not rebuilt per chunk.
  const componentNamesKey = Object.keys(components).join(' ');
  const componentNames = useMemo(
    () => (componentNamesKey ? componentNamesKey.split(' ') : []),
    [componentNamesKey],
  );

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
      if (token === StreamCacheTokenType.Table && cache.table.newlines > 1) {
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

  /**
   * Advance the cache to `text` and return the streaming output. Runs during
   * render (not in an effect) so a chunk is painted in the same render it
   * arrives in instead of one render later. It is idempotent: re-running it
   * for the same `text` finds an empty chunk and only re-derives the output,
   * which is what makes it safe under StrictMode's double render.
   */
  const processStreaming = useCallback(
    (text: string): string => {
      if (!text) {
        cacheRef.current = getInitialCache();
        return '';
      }

      const expectedPrefix = cacheRef.current.completeMarkdown + cacheRef.current.pending;
      // Reset cache if input doesn't continue from previous state
      if (!text.startsWith(expectedPrefix)) {
        cacheRef.current = getInitialCache();
      }

      const cache = cacheRef.current;
      const chunk = text.slice(cache.processedLength);

      // Absolute offset of `char` in `text`; advanced by the UTF-16 length of
      // each code point because the loop iterates code points.
      let offset = cache.processedLength;
      cache.processedLength += chunk.length;
      for (const char of chunk) {
        cache.pending += char;
        feedFenceState(cache.fence, char);
        feedTableState(cache.table, char);
        if (trackSections && char === '\n') {
          trackSectionBoundary(cache, text, offset, componentNames, minSectionChars);
        }
        offset += char.length;
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
      return cache.completeMarkdown + (incompletePlaceholder || '');
    },
    [handleIncompleteMarkdown, trackSections, componentNames, minSectionChars],
  );

  const isStringInput = typeof input === 'string';

  useEffect(() => {
    if (!isStringInput) {
      console.error(`X-Markdown: input must be string, not ${typeof input}.`);
    }
  }, [input, isStringInput]);

  return useMemo<StreamingResult>(() => {
    if (!isStringInput) return EMPTY_RESULT;

    if (!enableCache) {
      const cache = cacheRef.current;
      const continuesStream =
        trackSections &&
        cache.processedLength > 0 &&
        input.startsWith(cache.completeMarkdown + cache.pending);
      if (continuesStream) {
        // The stream just ended (or the caller re-rendered after it ended).
        // Keep the sections so already-mounted custom components are not
        // remounted; only the last section re-parses. The output is the raw
        // input: nothing is pending any more.
        processStreaming(input);
        return { output: input, sections: buildSections(cache, input, input.length) };
      }
      // Non-streaming: pass the full input through so the first paint renders
      // complete content and avoids layout jitter.
      cacheRef.current = getInitialCache();
      return { output: input, sections: null };
    }

    const output = processStreaming(input);
    const cache = cacheRef.current;
    return {
      output,
      sections: trackSections
        ? buildSections(cache, output, cache.completeMarkdown.length)
        : null,
    };
  }, [input, isStringInput, enableCache, trackSections, processStreaming]);
};

const useStreaming = (input: string, config?: StreamingConfig): string =>
  useStreamingCore(input, config).output;

export { useStreamingCore };
export default useStreaming;
