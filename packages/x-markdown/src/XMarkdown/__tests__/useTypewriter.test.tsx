import { act, render, renderHook } from '@testing-library/react';
import React from 'react';
import { useTypewriter } from '../hooks';
import { alignToClusterFallback, alignToGrapheme } from '../hooks/useTypewriter';
import type { TypewriterOption } from '../interface';

type Props = { input: string; typewriter?: boolean | TypewriterOption; active: boolean };

const setup = (initial: Props) =>
  renderHook(({ input, typewriter, active }: Props) => useTypewriter(input, typewriter, active), {
    initialProps: initial,
  });

/** Advance one animation frame (16ms) and return the hook output. */
const frame = <T,>(result: { current: T }, ms = 16): T => {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
  return result.current;
};

/**
 * Run frames until the output has not changed for a while; returns every
 * distinct output. The floor speed is 24 chars/s, so in sentence mode a long
 * final sentence can take a couple of seconds of frames to be reached.
 */
const drain = (result: { current: string }, maxFrames = 1000): string[] => {
  const seen: string[] = [result.current];
  let stableFrames = 0;
  for (let i = 0; i < maxFrames; i++) {
    const next = frame(result);
    if (next === seen[seen.length - 1]) {
      stableFrames += 1;
      if (stableFrames >= 250) break;
      continue;
    }
    stableFrames = 0;
    seen.push(next);
  }
  return seen;
};

describe('useTypewriter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('costs no extra render per chunk while disabled, and shows everything present when enabled later', () => {
    let renders = 0;
    const Probe = ({ input, active }: { input: string; active: boolean }) => {
      renders += 1;
      return <span>{useTypewriter(input, true, active)}</span>;
    };
    const { rerender, container } = render(<Probe input="a" active={false} />);
    for (const input of ['ab', 'abc', 'abcd']) {
      act(() => {
        rerender(<Probe input={input} active={false} />);
      });
    }
    // One render per rerender: the disabled hook must not schedule state updates.
    expect(renders).toBe(4);
    expect(container.textContent).toBe('abcd');

    // Switching on later shows what is present at that moment at once…
    act(() => {
      rerender(<Probe input="abcd efgh" active />);
    });
    expect(container.textContent).toBe('abcd efgh');
    // …and only types out what arrives afterwards.
    act(() => {
      rerender(<Probe input="abcd efgh and a longer sentence follows here" active />);
    });
    frame({ current: null });
    expect(container.textContent.length).toBeLessThan('abcd efgh and a longer sentence follows here'.length);
  });

  it('passes the input through when disabled or inactive', () => {
    const off = setup({ input: 'Hello', typewriter: undefined, active: true });
    expect(off.result.current).toBe('Hello');
    const inactive = setup({ input: 'Hello', typewriter: true, active: false });
    expect(inactive.result.current).toBe('Hello');
    act(() => {
      inactive.rerender({ input: 'Hello world', typewriter: true, active: false });
    });
    expect(inactive.result.current).toBe('Hello world');
  });

  it('shows what is present at mount immediately and types out what arrives later', () => {
    const { result, rerender } = setup({ input: 'Hello', typewriter: true, active: true });
    expect(result.current).toBe('Hello');

    const text = 'Hello, this is a fairly long sentence that should be revealed over several frames.';
    act(() => {
      rerender({ input: text, typewriter: true, active: true });
    });
    const outputs = drain(result);

    // Strictly growing prefixes of the input, ending with the full input.
    expect(outputs.length).toBeGreaterThan(3);
    for (let i = 1; i < outputs.length; i++) {
      expect(outputs[i].length).toBeGreaterThan(outputs[i - 1].length);
      expect(text.startsWith(outputs[i])).toBe(true);
    }
    expect(outputs[outputs.length - 1]).toBe(text);
  });

  it('reveals everything at once when the stream ends', () => {
    const { result, rerender } = setup({ input: '', typewriter: true, active: true });
    const text = 'A sentence that has not finished typing yet.';
    act(() => {
      rerender({ input: text, typewriter: true, active: true });
    });
    frame(result);
    expect(result.current.length).toBeLessThan(text.length);
    act(() => {
      rerender({ input: text, typewriter: true, active: false });
    });
    expect(result.current).toBe(text);
  });

  it('shows replaced content at once instead of typing it', () => {
    const { result, rerender } = setup({ input: '', typewriter: true, active: true });
    act(() => {
      rerender({ input: 'first answer being typed', typewriter: true, active: true });
    });
    frame(result);
    act(() => {
      rerender({ input: 'a completely different answer', typewriter: true, active: true });
    });
    expect(result.current).toBe('a completely different answer');
  });

  describe('never cuts inside an emoji or another grapheme cluster', () => {
    // Surrogate pairs, ZWJ families, flags (regional-indicator pairs), skin
    // tones, variation selectors, keycaps and combining accents, mixed with
    // plain text so cuts land everywhere.
    const text =
      '😀 family 👨‍👩‍👧‍👦 flags 🇨🇳🇯🇵 tone 👍🏽 heart ❤️ key 1️⃣ accent é (é) ' +
      '🧑‍💻🧑🏿‍🚀 end 😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺️🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫🥱😴😌😛';
    // Intl.Segmenter is not in the package's TS lib target, but Node has it.
    type SegmenterCtor = new (
      locales?: string,
      options?: { granularity: 'grapheme' },
    ) => { segment(input: string): Iterable<{ segment: string }> };
    const intl = Intl as typeof Intl & { Segmenter?: SegmenterCtor };
    const boundaries = new Set<number>([0]);
    let pos = 0;
    for (const { segment } of new (intl.Segmenter as SegmenterCtor)(undefined, {
      granularity: 'grapheme',
    }).segment(text)) {
      pos += segment.length;
      boundaries.add(pos);
    }

    const check = () => {
      const { result, rerender } = setup({ input: '', typewriter: true, active: true });
      act(() => {
        rerender({ input: text, typewriter: true, active: true });
      });
      const outputs = drain(result);
      for (const output of outputs) {
        expect(text.startsWith(output)).toBe(true);
        expect(boundaries.has(output.length)).toBe(true);
      }
      expect(outputs.length).toBeGreaterThan(5);
      expect(result.current).toBe(text);
    };

    it('with Intl.Segmenter', () => {
      check();
    });

    // Exhaustive: every possible cut position must be moved forward to a
    // cluster boundary, by the Intl.Segmenter path and by the fallback used
    // where Intl.Segmenter is missing.
    it('alignToGrapheme (Intl.Segmenter) lands on a boundary for every cut', () => {
      for (let len = 0; len <= text.length; len++) {
        const aligned = alignToGrapheme(text, len);
        expect(aligned).toBeGreaterThanOrEqual(len);
        expect(boundaries.has(aligned)).toBe(true);
      }
    });

    it('alignToClusterFallback lands on a boundary for every cut', () => {
      const wrong: string[] = [];
      for (let len = 0; len <= text.length; len++) {
        const aligned = alignToClusterFallback(text, len);
        if (aligned < len || !boundaries.has(aligned)) wrong.push(`${len}→${aligned} …${text.slice(Math.max(0, aligned - 6), aligned)}|`);
      }
      expect(wrong).toEqual([]);
    });
  });

  describe("unit: 'sentence'", () => {
    it('reveals up to a delimiter at a time', () => {
      const { result, rerender } = setup({
        input: '',
        typewriter: { unit: 'sentence', delimiters: ['.', '!'] },
        active: true,
      });
      const text = 'First one. Second one! Third one which is much longer than the others.';
      act(() => {
        rerender({ input: text, typewriter: { unit: 'sentence', delimiters: ['.', '!'] }, active: true });
      });
      const outputs = drain(result);
      expect(outputs).toEqual([
        '',
        'First one.',
        'First one. Second one!',
        'First one. Second one! Third one which is much longer than the others.',
      ]);
    });

    it('ignores delimiters inside fenced and inline code', () => {
      const config: TypewriterOption = { unit: 'sentence', delimiters: ['.'] };
      const { result, rerender } = setup({ input: '', typewriter: config, active: true });
      const text = 'Run `a.b.c` now.\n```\nx.y();\nz.w();\n```\nDone. `d.e` end.';
      act(() => {
        rerender({ input: text, typewriter: config, active: true });
      });
      const outputs = drain(result);
      expect(outputs[outputs.length - 1]).toBe(text);
      // Every intermediate reveal stops at a sentence end or a line end,
      // never at a `.` that sits inside inline or fenced code.
      for (const output of outputs.slice(1, -1)) {
        expect(output.endsWith('.') || output.endsWith('\n')).toBe(true);
        expect(['`a.', '`a.b.', '\nx.', '\nz.', '`d.'].some((s) => output.endsWith(s))).toBe(false);
      }
      // The first sentence is revealed on its own (with or without its line end).
      expect(outputs.some((o) => o === 'Run `a.b.c` now.' || o === 'Run `a.b.c` now.\n')).toBe(true);
    });

    it('treats a newline as a boundary even inside code and even if not listed as a delimiter', () => {
      const config: TypewriterOption = { unit: 'sentence', delimiters: ['.'] };
      const { result, rerender } = setup({ input: '', typewriter: config, active: true });
      const text = '```\nx.y();\nz.w();\n```\n';
      act(() => {
        rerender({ input: text, typewriter: config, active: true });
      });
      const outputs = drain(result);
      expect(outputs).toEqual(['', '```\n', '```\nx.y();\n', '```\nx.y();\nz.w();\n', text]);
    });
  });

  it('falls back to character reveal after maxSentenceChars without a delimiter', () => {
    const config: TypewriterOption = { unit: 'sentence', delimiters: ['.'], maxSentenceChars: 40 };
    const { result, rerender } = setup({ input: '', typewriter: config, active: true });
    // No '.' anywhere in the run (a '.' in a URL is a delimiter like any other).
    const longRun = 'https://example-com/a-very-long-path-without-any-punctuation-' + 'x'.repeat(120);
    const text = `${longRun} and then a sentence. done`;
    act(() => {
      rerender({ input: text, typewriter: config, active: true });
    });
    const outputs = drain(result);
    // Something shows before the delimiter arrives (not just '' and the whole run)…
    const beforeDelimiter = outputs.filter((o) => o.length > 0 && o.length < longRun.length);
    expect(beforeDelimiter.length).toBeGreaterThan(3);
    // …and none of it before the cap was reached.
    expect(beforeDelimiter.every((o) => o.length > 40)).toBe(true);
    // Once a delimiter shows up, sentence mode takes over again.
    expect(outputs).toContain(`${longRun} and then a sentence.`);
    expect(outputs[outputs.length - 1]).toBe(text);
  });

  it('treats one or two backticks at a line start as inline code, not a fence', () => {
    const config: TypewriterOption = { unit: 'sentence', delimiters: ['.'] };
    const { result, rerender } = setup({ input: '', typewriter: config, active: true });
    const text = '`a.b` first. second.';
    act(() => {
      rerender({ input: text, typewriter: config, active: true });
    });
    const outputs = drain(result);
    for (const output of outputs.slice(1, -1)) {
      expect(output.endsWith('`a.')).toBe(false);
    }
    expect(outputs).toContain('`a.b` first.');
    expect(outputs[outputs.length - 1]).toBe(text);
  });

  it('rescans boundaries when the not-yet-shown tail is rewritten', () => {
    const config: TypewriterOption = { unit: 'sentence', delimiters: ['.'] };
    const { result, rerender } = setup({ input: 'A. B.', typewriter: config, active: true });
    expect(result.current).toBe('A. B.');
    // An unfinished fence arrives and is scanned (but not yet shown)…
    act(() => {
      rerender({ input: 'A. B. ```\nx.y', typewriter: config, active: true });
    });
    // …then the caller rewrites that tail while the shown prefix survives.
    act(() => {
      rerender({ input: 'A. B. done. And a longer tail after it', typewriter: config, active: true });
    });
    const outputs = drain(result);
    // Stale "inside a fence" state would have hidden the boundary after "done.".
    expect(outputs).toContain('A. B. done.');
    expect(outputs[outputs.length - 1]).toBe('A. B. done. And a longer tail after it');
  });

  it('pauses after a delimiter in char mode when pauseMs is set', () => {
    const config: TypewriterOption = { pauseMs: 200, delimiters: ['.'] };
    const { result, rerender } = setup({ input: '', typewriter: config, active: true });
    const text = 'Ab. Cd';
    act(() => {
      rerender({ input: text, typewriter: config, active: true });
    });
    const outputs = drain(result);
    // The pause shows up as repeated frames on 'Ab.'; drain collapses them,
    // but the reveal must have stopped exactly at the delimiter.
    expect(outputs).toContain('Ab.');
    expect(outputs[outputs.length - 1]).toBe(text);
  });
});
