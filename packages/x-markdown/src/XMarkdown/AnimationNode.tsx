import type { DOMNode } from 'html-react-parser';
import React, { useEffect, useRef, useState } from 'react';
import { HTMLTag } from './hooks/useAnimation';
import { AnimationConfig } from './interface';

export interface AnimationNodeProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode | React.ReactNode[];
  nodeTag: HTMLTag;
  animationConfig?: AnimationConfig;
  streamStatus?: 'loading' | 'done';
  domNode?: DOMNode;
  [key: string]: unknown;
}

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

const AnimationNode: React.FC<AnimationNodeProps> = (props) => {
  const { nodeTag, children, animationConfig, domNode: _, streamStatus: __, ...restProps } = props;

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
