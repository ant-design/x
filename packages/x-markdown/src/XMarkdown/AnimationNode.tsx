import React, { useState, useEffect, useRef, useMemo } from 'react';
import { animated, ControllerUpdate, useSpring } from '@react-spring/web';
import { HTMLTag } from './hooks/useAnimation';

interface AnimationTextProps {
  text: string;
  animationConfig?: ControllerUpdate;
}

export interface AnimationNodeProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode | React.ReactNode[];
  nodeTag: HTMLTag;
  animationConfig?: ControllerUpdate;
  [key: string]: unknown;
}

const DEFAULT_ANIMATION_CONFIG: ControllerUpdate = {
  from: { opacity: 0 },
  to: { opacity: 1 },
  config: { tension: 170, friction: 26 },
};

const AnimationText: React.FC<AnimationTextProps> = React.memo((props) => {
  const { text, animationConfig } = props;
  const [displayText, setDisplayText] = useState({
    base: '',
    animated: '',
  });
  const prevTextRef = useRef('');

  const mergedAnimationConfig = useMemo(
    () => ({ ...DEFAULT_ANIMATION_CONFIG, ...animationConfig }),
    [animationConfig],
  );
  const [springs, api] = useSpring(() => mergedAnimationConfig);

  useEffect(() => {
    if (text === prevTextRef.current) return;

    const newChars = text.slice(prevTextRef.current.length);
    setDisplayText({
      base: prevTextRef.current,
      animated: newChars,
    });
    prevTextRef.current = text;
  }, [text]);

  useEffect(() => {
    if (displayText.animated) {
      api.start(mergedAnimationConfig);
    }
  }, [displayText.animated, mergedAnimationConfig]);

  return (
    <>
      {displayText.base}
      {displayText.animated ? (
        <animated.span style={springs}>{displayText.animated}</animated.span>
      ) : null}
    </>
  );
});

const AnimationNode: React.FC<AnimationNodeProps> = (props) => {
  const { nodeTag, children, animationConfig, ...restProps } = props;

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
