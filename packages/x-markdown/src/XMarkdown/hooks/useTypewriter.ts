import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TypewriterConfig } from '../interface';

/**
 * Paces a growing string so it is revealed character by character (or
 * sentence by sentence) at a rate that follows the incoming chunks: content
 * that arrives in bursts is smoothed out instead of appearing as blocks.
 *
 * The output is always a prefix of the input, so downstream prefix caches
 * (useStreaming) keep working. When `active` is false the input is passed
 * through untouched, which also makes the hook a no-op outside the browser.
 */

const DEFAULT_MIN_CPS = 24;
const DEFAULT_MAX_CPS = 3000;
const DEFAULT_DELIMITERS = ['。', '！', '？', '.', '!', '?', '\n'];
// Longest run without a delimiter that sentence mode will hold back before
// falling back to character-by-character reveal.
const DEFAULT_MAX_SENTENCE_CHARS = 120;
// Interval between chunks is tracked as an exponential moving average and
// used as the horizon over which the current backlog should be drained.
const DEFAULT_CHUNK_INTERVAL_MS = 140;
const MIN_HORIZON_MS = 80;
const MAX_HORIZON_MS = 260;
const EWMA_ALPHA = 0.28;

const clamp = (value: number, min: number, max: number): number =>
  value < min ? min : value > max ? max : value;

const isHighSurrogate = (text: string, index: number): boolean => {
  const code = text.charCodeAt(index);
  return code >= 0xd800 && code <= 0xdbff;
};

/** Never cut between the two halves of a surrogate pair. */
const alignToCodePoint = (text: string, length: number): number =>
  length > 0 && length < text.length && isHighSurrogate(text, length - 1) ? length + 1 : length;

const ZWJ = 0x200d;
const isVariationSelector = (cp: number) => cp === 0xfe0e || cp === 0xfe0f;
const isSkinTone = (cp: number) => cp >= 0x1f3fb && cp <= 0x1f3ff;
const isCombiningMark = (cp: number) =>
  (cp >= 0x0300 && cp <= 0x036f) || (cp >= 0x1ab0 && cp <= 0x1aff) || (cp >= 0x20d0 && cp <= 0x20ff);
const isRegionalIndicator = (cp: number) => cp >= 0x1f1e6 && cp <= 0x1f1ff;
const isTagCharacter = (cp: number) => cp >= 0xe0020 && cp <= 0xe007f;
const KEYCAP = 0x20e3;

/** Code point starting at `index`, and the index right after it. */
const codePointAt = (text: string, index: number): [number, number] => {
  const cp = text.codePointAt(index) as number;
  return [cp, index + (cp > 0xffff ? 2 : 1)];
};

const codePointBefore = (text: string, index: number): [number, number] => {
  const start = index >= 2 && isHighSurrogate(text, index - 2) ? index - 2 : index - 1;
  return [text.codePointAt(start) as number, start];
};

// Exported for tests only.
// Grapheme-cluster alignment without Intl.Segmenter: extend past anything
// that continues the cluster that ends at `length` — a zero-width joiner and
// the code point it joins (👨‍👩‍👧), variation selectors (❤️), skin tones (👍🏽),
// combining marks, keycaps (1️⃣), flag tag sequences, and the second half of a
// regional-indicator pair (🇨🇳). Conservative: it only ever moves forward.
export const alignToClusterFallback = (text: string, length: number): number => {
  let end = alignToCodePoint(text, length);
  // Count regional indicators ending at `end` so pairs are kept together.
  let indicators = 0;
  for (let i = end; i > 0; ) {
    const [cp, start] = codePointBefore(text, i);
    if (!isRegionalIndicator(cp)) break;
    indicators += 1;
    i = start;
  }
  for (;;) {
    if (end >= text.length) return text.length;
    const [prev] = codePointBefore(text, end);
    const [next, after] = codePointAt(text, end);
    if (
      next === ZWJ ||
      prev === ZWJ ||
      isVariationSelector(next) ||
      isSkinTone(next) ||
      isCombiningMark(next) ||
      next === KEYCAP ||
      isTagCharacter(next)
    ) {
      end = after;
      continue;
    }
    if (isRegionalIndicator(next) && isRegionalIndicator(prev) && indicators % 2 === 1) {
      end = after;
      indicators += 1;
      continue;
    }
    return end;
  }
};

// Intl.Segmenter is not in this package's TS lib target; type the subset used.
interface GraphemeSegmenter {
  segment(input: string): Iterable<{ segment: string; index: number }>;
}
type IntlWithSegmenter = typeof Intl & {
  Segmenter?: new (
    locales?: string | string[],
    options?: { granularity: 'grapheme' | 'word' | 'sentence' },
  ) => GraphemeSegmenter;
};

let segmenter: GraphemeSegmenter | null | undefined;
const getSegmenter = (): GraphemeSegmenter | null => {
  if (segmenter === undefined) {
    const Segmenter = typeof Intl !== 'undefined' ? (Intl as IntlWithSegmenter).Segmenter : undefined;
    segmenter =
      typeof Segmenter === 'function' ? new Segmenter(undefined, { granularity: 'grapheme' }) : null;
  }
  return segmenter;
};

// Clusters are short; segmenting a small window around the cut is enough.
const CLUSTER_WINDOW = 32;

/**
 * Never cut inside a user-perceived character: a cut is moved forward to the
 * next grapheme-cluster boundary so an emoji, a flag or an accented letter
 * is never shown half-built (or as a replacement glyph) for a frame.
 */
export const alignToGrapheme = (text: string, length: number): number => {
  if (length <= 0 || length >= text.length) return length;
  const seg = getSegmenter();
  if (!seg) return alignToClusterFallback(text, length);
  const start = Math.max(0, alignToCodePoint(text, length - CLUSTER_WINDOW));
  const windowEnd = Math.min(text.length, alignToCodePoint(text, length + CLUSTER_WINDOW));
  for (const { index, segment } of seg.segment(text.slice(start, windowEnd))) {
    const clusterStart = start + index;
    const clusterEnd = clusterStart + segment.length;
    if (clusterStart >= length) return clusterStart;
    if (clusterEnd >= length) return clusterEnd;
  }
  return windowEnd;
};

interface BoundaryScan {
  /** Number of characters of the input already scanned */
  scanned: number;
  /** Offsets (exclusive ends) at which a sentence may be cut */
  boundaries: number[];
  inFence: boolean;
  fenceChar: string;
  fenceLen: number;
  /** Leading `/~ run of the current line, while still at the line start */
  atLineStart: boolean;
  lineFenceChar: string;
  lineFenceLen: number;
  inInlineCode: boolean;
}

const initialScan = (): BoundaryScan => ({
  scanned: 0,
  boundaries: [],
  inFence: false,
  fenceChar: '',
  fenceLen: 0,
  atLineStart: true,
  lineFenceChar: '',
  lineFenceLen: 0,
  inInlineCode: false,
});

/**
 * Extend the sentence-boundary scan to cover `text`. Delimiters inside fenced
 * or inline code are not boundaries (`a.b.c`, `foo();`), newlines always are.
 * Incremental: only the characters appended since the last call are visited.
 */
const scanBoundaries = (scan: BoundaryScan, text: string, delimiters: Set<string>): void => {
  for (let i = scan.scanned; i < text.length; i++) {
    const char = text[i];
    if (char === '\n') {
      if (scan.lineFenceLen >= 3) {
        if (!scan.inFence) {
          scan.inFence = true;
          scan.fenceChar = scan.lineFenceChar;
          scan.fenceLen = scan.lineFenceLen;
        } else if (scan.lineFenceChar === scan.fenceChar && scan.lineFenceLen >= scan.fenceLen) {
          scan.inFence = false;
        }
      }
      scan.lineFenceChar = '';
      scan.lineFenceLen = 0;
      scan.atLineStart = true;
      scan.inInlineCode = false;
      // A line end is always a boundary, code included: revealing code line
      // by line is the natural typewriter rhythm, and a paragraph break is a
      // sentence boundary whatever `delimiters` says.
      scan.boundaries.push(i + 1);
      continue;
    }
    if (scan.atLineStart) {
      if ((char === '`' || char === '~') && (scan.lineFenceLen === 0 || scan.lineFenceChar === char)) {
        scan.lineFenceChar = char;
        scan.lineFenceLen += 1;
        continue;
      }
      scan.atLineStart = false;
      // One or two leading backticks were not a fence: they opened inline code.
      if (scan.lineFenceChar === '`' && scan.lineFenceLen < 3) {
        scan.inInlineCode = scan.lineFenceLen % 2 === 1;
      }
    }
    if (scan.inFence) continue;
    if (char === '`') {
      scan.inInlineCode = !scan.inInlineCode;
      continue;
    }
    if (!scan.inInlineCode && delimiters.has(char)) {
      scan.boundaries.push(i + 1);
    }
  }
  scan.scanned = text.length;
};

/** Largest boundary that is <= `length`, or 0. */
const floorToBoundary = (boundaries: number[], length: number): number => {
  let lo = 0;
  let hi = boundaries.length - 1;
  let best = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (boundaries[mid] <= length) {
      best = boundaries[mid];
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
};

const resolveConfig = (typewriter: boolean | TypewriterConfig | undefined) => {
  const config = typeof typewriter === 'object' ? typewriter : {};
  return {
    unit: config.unit ?? 'char',
    delimiters: config.delimiters ?? DEFAULT_DELIMITERS,
    minCps: config.minCps ?? DEFAULT_MIN_CPS,
    maxCps: config.maxCps ?? DEFAULT_MAX_CPS,
    pauseMs: config.pauseMs ?? 0,
    maxSentenceChars: config.maxSentenceChars ?? DEFAULT_MAX_SENTENCE_CHARS,
  };
};

const canAnimate = (): boolean =>
  typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function';

const useTypewriter = (
  input: string,
  typewriter: boolean | TypewriterConfig | undefined,
  active: boolean,
): string => {
  const enabled = !!typewriter && active && canAnimate();
  const { unit, delimiters, minCps, maxCps, pauseMs, maxSentenceChars } =
    resolveConfig(typewriter);
  const delimiterSet = useMemo(() => new Set(delimiters), [delimiters]);

  // Everything already present when the hook mounts is shown at once; only
  // text that arrives afterwards is typed out.
  const [displayLength, setDisplayLength] = useState(input.length);
  const displayLengthRef = useRef(displayLength);
  const inputRef = useRef(input);
  const enabledRef = useRef(enabled);
  const cursorRef = useRef(input.length); // fractional position in char mode
  const lastChunkAtRef = useRef<number | null>(null);
  const chunkIntervalRef = useRef(DEFAULT_CHUNK_INTERVAL_MS);
  const rafRef = useRef<number | null>(null);
  const lastFrameAtRef = useRef<number | null>(null);
  const pauseUntilRef = useRef(0);
  const scanRef = useRef<BoundaryScan>(initialScan());

  const wasEnabledRef = useRef(enabled);

  inputRef.current = input;
  enabledRef.current = enabled;

  const stop = useCallback(() => {
    if (rafRef.current != null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastFrameAtRef.current = null;
  }, []);

  const commit = useCallback((length: number) => {
    if (length !== displayLengthRef.current) {
      displayLengthRef.current = length;
      setDisplayLength(length);
    }
  }, []);

  const tick = useCallback(
    (now: number) => {
      rafRef.current = null;
      const text = inputRef.current;
      const target = text.length;
      if (!enabledRef.current || displayLengthRef.current >= target) {
        stop();
        return;
      }

      const prev = lastFrameAtRef.current ?? now;
      const deltaMs = Math.max(8, now - prev);
      lastFrameAtRef.current = now;

      if (now >= pauseUntilRef.current) {
        const backlog = target - cursorRef.current;
        const horizonMs = clamp(chunkIntervalRef.current, MIN_HORIZON_MS, MAX_HORIZON_MS);
        const cps = clamp((backlog / horizonMs) * 1000, minCps, maxCps);
        cursorRef.current = Math.min(target, cursorRef.current + (cps * deltaMs) / 1000);

        let next: number;
        if (unit === 'sentence') {
          scanBoundaries(scanRef.current, text, delimiterSet);
          const { boundaries } = scanRef.current;
          const shown = displayLengthRef.current;
          const cursor = Math.floor(cursorRef.current);
          const boundary = floorToBoundary(boundaries, cursor);
          if (cursor >= target) {
            next = target;
          } else if (boundary > shown) {
            next = boundary;
          } else if (cursor - floorToBoundary(boundaries, shown) > maxSentenceChars) {
            // No delimiter for a long stretch (a URL, a one-line JSON blob…):
            // fall back to revealing character by character until one shows up,
            // instead of showing nothing until the whole run has arrived.
            next = Math.min(target, alignToGrapheme(text, Math.max(shown + 1, cursor)));
          } else {
            next = shown;
          }
        } else {
          next = Math.max(displayLengthRef.current + 1, Math.floor(cursorRef.current));
          next = Math.min(target, alignToGrapheme(text, next));
          if (pauseMs > 0 && next > displayLengthRef.current) {
            // Hold briefly after a delimiter, but never inside code.
            scanBoundaries(scanRef.current, text, delimiterSet);
            const boundary = floorToBoundary(scanRef.current.boundaries, next);
            if (boundary > displayLengthRef.current) {
              next = boundary;
              cursorRef.current = boundary;
              pauseUntilRef.current = now + pauseMs;
            }
          }
        }
        commit(next);
      }

      if (displayLengthRef.current < inputRef.current.length) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        stop();
      }
    },
    [commit, delimiterSet, maxCps, maxSentenceChars, minCps, pauseMs, stop, unit],
  );

  const schedule = useCallback(() => {
    if (rafRef.current != null || !enabledRef.current) return;
    if (displayLengthRef.current >= inputRef.current.length) return;
    lastFrameAtRef.current = null;
    rafRef.current = window.requestAnimationFrame(tick);
  }, [tick]);

  const prevInputRef = useRef(input);
  
  useEffect(() => {
    const previous = prevInputRef.current;
    prevInputRef.current = input;

    if (!enabled) {
      // Off: touch no state, so the hook costs no extra render per chunk —
      // the memo below passes the input straight through.
      stop();
      wasEnabledRef.current = false;
      return;
    }

    if (!wasEnabledRef.current) {
      // Just switched on: everything present now is shown at once, as at
      // mount; only text arriving from here on is typed out.
      wasEnabledRef.current = true;
      scanRef.current = initialScan();
      cursorRef.current = input.length;
      commit(input.length);
      lastChunkAtRef.current = null;
      chunkIntervalRef.current = DEFAULT_CHUNK_INTERVAL_MS;
      return;
    }

    if (!input.startsWith(previous.slice(0, displayLengthRef.current))) {
      // Replaced rather than extended: show the new content at once.
      stop();
      scanRef.current = initialScan();
      cursorRef.current = input.length;
      commit(input.length);
      lastChunkAtRef.current = null;
      chunkIntervalRef.current = DEFAULT_CHUNK_INTERVAL_MS;
      return;
    }

    if (!input.startsWith(previous)) {
      // The shown prefix survived but the not-yet-shown tail was rewritten:
      // boundaries and code state scanned over the old tail are stale.
      scanRef.current = initialScan();
      cursorRef.current = Math.min(cursorRef.current, input.length);
    }

    if (input.length > previous.length) {
      const now = performance.now();
      const previousChunkAt = lastChunkAtRef.current;
      if (previousChunkAt != null) {
        const interval = clamp(now - previousChunkAt, 30, 500);
        chunkIntervalRef.current = clamp(
          (1 - EWMA_ALPHA) * chunkIntervalRef.current + EWMA_ALPHA * interval,
          MIN_HORIZON_MS,
          MAX_HORIZON_MS,
        );
      }
      lastChunkAtRef.current = now;
    }
    schedule();
  }, [input, enabled, commit, schedule, stop]);

  useEffect(() => stop, [stop]);

  return useMemo(() => {
    if (!enabled) return input;
    return displayLength >= input.length ? input : input.slice(0, displayLength);
  }, [enabled, input, displayLength]);
};

export default useTypewriter;
