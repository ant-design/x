import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HTMLTag } from './hooks/useAnimation';
import { AnimationConfig } from './interface';

export interface AnimationNodeProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode | React.ReactNode[];
  nodeTag: HTMLTag;
  animationConfig?: AnimationConfig;
  [key: string]: unknown;
}

export interface AnimationTextProps {
  text: string;
  animationConfig?: AnimationConfig;
}

const AnimationText = React.memo<AnimationTextProps>((props) => {
  const { text, animationConfig } = props;
  const [displayText, setDisplayText] = useState('');
  const prevTextRef = useRef('');
  const fadingCharsRef = useRef<string>('');
  const startTimeRef = useRef<number | null>(null);

  const fadeDuration = useMemo(
    () => animationConfig?.fadeDuration ?? 200,
    [animationConfig?.fadeDuration],
  );
  const opacity = useMemo(() => animationConfig?.opacity ?? 0.2, [animationConfig?.opacity]);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) return;
      const elapsed = timestamp - startTimeRef.current;
      if (elapsed < fadeDuration) {
        requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        fadingCharsRef.current = '';
      }
    },
    [text, fadeDuration],
  );

  useEffect(() => {
    if (text === prevTextRef.current) return;

    if (!(prevTextRef.current && text.indexOf(prevTextRef.current) === 0)) {
      setDisplayText(text);
      fadingCharsRef.current = '';
      prevTextRef.current = text;
      return;
    }

    const prevText = prevTextRef.current;
    const newChars = text.slice(prevText.length);
    setDisplayText(prevText);

    fadingCharsRef.current = newChars;
    prevTextRef.current = text;

    startTimeRef.current = performance.now();
    requestAnimationFrame(animate);
  }, [text, animate]);

  return (
    <>
      {displayText}
      {fadingCharsRef.current ? (
        <span style={{ opacity: opacity }}>{fadingCharsRef.current}</span>
      ) : null}
    </>
  );
});

const AnimationNode: React.FC<AnimationNodeProps> = (props) => {
  const { nodeTag, children, animationConfig, _domNode, _streamStatus, ...restProps } = props;

  const renderChildren = (): React.ReactNode | React.ReactNode[] => {
    if (!children) return null;

    if (Array.isArray(children)) {
      return children.map((child, index) =>
        typeof child === 'string' ? (
          <AnimationText key={index} animationConfig={animationConfig} text={child} />
        ) : (
          child
        ),
      );
    }
    return typeof children === 'string' ? (
      <AnimationText text={children} animationConfig={animationConfig} />
    ) : (
      children
    );
  };

  return React.createElement(nodeTag, restProps, renderChildren());
};

export default AnimationNode;
export { AnimationText };
