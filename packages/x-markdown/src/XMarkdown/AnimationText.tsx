import React, { useMemo, useRef, useEffect } from 'react';
import { AnimationConfig } from './interface';

export interface AnimationTextProps {
  text: string;
  animationConfig?: AnimationConfig;
}

const AnimationText = React.memo<AnimationTextProps>((props) => {
  const { text, animationConfig } = props;
  const { fadeDuration = 200, easing = 'ease-in-out' } = animationConfig || {};
  const prevTextRef = useRef('');
  const chunksRef = useRef<string[]>([]);

  const prevText = prevTextRef.current;
  let chunks: string[];

  if (text === prevText) {
    chunks = chunksRef.current;
  } else if (!(prevText && text.startsWith(prevText))) {
    chunks = [text];
  } else {
    const newText = text.slice(prevText.length);
    chunks = newText ? [...chunksRef.current, newText] : chunksRef.current;
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
