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
  const { unit, delimiters, minCps, maxCps, pauseMs } = resolveConfig(typewriter);
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
          const cursor = Math.floor(cursorRef.current);
          next =
            cursor >= target ? target : Math.max(displayLengthRef.current, floorToBoundary(scanRef.current.boundaries, cursor));
        } else {
          next = Math.max(displayLengthRef.current + 1, Math.floor(cursorRef.current));
          next = Math.min(target, alignToCodePoint(text, next));
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
    [commit, delimiterSet, maxCps, minCps, pauseMs, stop, unit],
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
      stop();
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
