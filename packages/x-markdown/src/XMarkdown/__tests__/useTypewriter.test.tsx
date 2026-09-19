import { act, renderHook } from '@testing-library/react';
import { useTypewriter } from '../hooks';
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

  it('never cuts a surrogate pair in half', () => {
    const { result, rerender } = setup({ input: '', typewriter: true, active: true });
    const text = '😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺️🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫🥱😴😌😛';
    act(() => {
      rerender({ input: text, typewriter: true, active: true });
    });
    for (const output of drain(result)) {
      if (output.length === 0) continue;
      const last = output.charCodeAt(output.length - 1);
      expect(last >= 0xd800 && last <= 0xdbff).toBe(false);
    }
    expect(result.current).toBe(text);
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
      expect(outputs).toEqual([
        '',
        'Run `a.b.c` now.',
        'Run `a.b.c` now.\n```\nx.y();\nz.w();\n```\nDone.',
        text,
      ]);
    });

    it('treats a newline as a boundary even inside code', () => {
      const config: TypewriterOption = { unit: 'sentence', delimiters: ['.', '\n'] };
      const { result, rerender } = setup({ input: '', typewriter: config, active: true });
      const text = '```\nx.y();\nz.w();\n```\n';
      act(() => {
        rerender({ input: text, typewriter: config, active: true });
      });
      const outputs = drain(result);
      expect(outputs).toEqual(['', '```\n', '```\nx.y();\n', '```\nx.y();\nz.w();\n', text]);
    });
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
