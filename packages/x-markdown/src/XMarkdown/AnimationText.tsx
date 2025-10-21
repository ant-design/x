import React, { useEffect, useRef, useState } from 'react';
import { AnimationConfig } from './interface';

export interface AnimationTextProps {
  text: string;
  animationConfig?: AnimationConfig;
}

const AnimationText = React.memo<AnimationTextProps>((props) => {
  const { text, animationConfig } = props;
  const { fadeDuration = 200, easing = 'ease-in-out' } = animationConfig || {};
  const [chunks, setChunks] = useState<string[]>([]);
  const prevTextRef = useRef('');

  useEffect(() => {
    if (text === prevTextRef.current) return;

    if (!(prevTextRef.current && text.indexOf(prevTextRef.current) === 0)) {
      setChunks([text]);
      prevTextRef.current = text;
      return;
    }

    const newText = text.slice(prevTextRef.current.length);
    if (!newText) return;

    setChunks((prev) => [...prev, newText]);
    prevTextRef.current = text;
  }, [text]);

  return (
    <>
      {chunks.map((text, index) => {
        return (
          <span
            style={{
              animation: `x-markdown-fadeIn ${fadeDuration}ms ${easing} forwards`,
            }}
            key={`${index}-${text}`}
          >
            {text}
          </span>
        );
      })}
    </>
  );
});

export default AnimationText;
