import React, { useMemo, useRef, useEffect } from 'react';
import { AnimationConfig } from './interface';

export interface AnimationTextProps {
  text: string;
  animationConfig?: AnimationConfig;
}

const DEFAULT_DELIMITERS = ['。', '！', '？', '.', '!', '?', '\n'];
const DEFAULT_MAX_SENTENCE_CHARS = 120;

const endsWithDelimiter = (chunk: string, delimiters: string[]): boolean =>
  chunk.length > 0 && delimiters.includes(chunk[chunk.length - 1]);

/**
 * Append `newText` sentence-wise: text that continues the current (unfinished)
 * sentence is merged into its chunk so it does not fade in separately, and a
 * new chunk starts only after a delimiter. Text that is already on screen is
 * never moved to another chunk, so nothing that has faded in fades in again.
 */
const appendBySentence = (
  chunks: string[],
  newText: string,
  delimiters: string[],
  maxChars: number,
): string[] => {
  const next = chunks.slice();
  let rest = newText;
  const last = next[next.length - 1];
  // Keep merging into the open sentence unless it is already at the cap.
  if (next.length > 0 && !endsWithDelimiter(last, delimiters) && last.length < maxChars) {
    let cut = -1;
    for (let i = 0; i < rest.length; i++) {
      if (delimiters.includes(rest[i])) {
        cut = i + 1;
        break;
      }
    }
    if (cut === -1) {
      next[next.length - 1] += rest;
      return next;
    }
    next[next.length - 1] += rest.slice(0, cut);
    rest = rest.slice(cut);
  }
  let start = 0;
  for (let i = 0; i < rest.length; i++) {
    if (delimiters.includes(rest[i])) {
      next.push(rest.slice(start, i + 1));
      start = i + 1;
    }
  }
  if (start < rest.length) next.push(rest.slice(start));
  return next;
};

const AnimationText = React.memo<AnimationTextProps>((props) => {
  const { text, animationConfig } = props;
  const {
    fadeDuration = 200,
    easing = 'ease-in-out',
    splitBy = 'chunk',
    delimiters = DEFAULT_DELIMITERS,
    maxSentenceChars = DEFAULT_MAX_SENTENCE_CHARS,
  } = animationConfig || {};
  const prevTextRef = useRef('');
  const chunksRef = useRef<string[]>([]);

  const prevText = prevTextRef.current;
  let chunks: string[];

  if (text === prevText) {
    chunks = chunksRef.current;
  } else if (!(prevText && text.startsWith(prevText))) {
    chunks = [text];
  } else {
    // text !== prevText and text starts with prevText, so newText is non-empty.
    const newText = text.slice(prevText.length);
    chunks =
      splitBy === 'sentence'
        ? appendBySentence(chunksRef.current, newText, delimiters, maxSentenceChars)
        : [...chunksRef.current, newText];
  }

  useEffect(() => {
    prevTextRef.current = text;
    chunksRef.current = chunks;
  }, [text, chunks]);

  const animationStyle = useMemo(
    () => ({
      animation: `x-markdown-fade-in ${fadeDuration}ms ${easing} forwards`,
      color: 'inherit',
    }),
    [fadeDuration, easing],
  );

  return (
    <>
      {chunks.map((text, index) => (
        <span style={animationStyle} key={`animation-text-${index}`}>
          {text}
        </span>
      ))}
    </>
  );
});

export default AnimationText;
