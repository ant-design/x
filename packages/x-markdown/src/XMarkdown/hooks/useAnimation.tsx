import React, { useMemo } from 'react';
import AnimationNode from '../AnimationNode';
import { XMarkdownProps } from '../interface';

export type HTMLTag = 'div' | 'p' | 'li' | 'h1' | 'h2' | 'h3' | 'h4' | 'strong';
type AnimationComponents = Record<HTMLTag, React.FC<React.ComponentProps<HTMLTag>>>;

const ANIMATION_TAGS: HTMLTag[] = ['div', 'p', 'li', 'h1', 'h2', 'h3', 'h4', 'strong'];

const useAnimation = (streaming: XMarkdownProps['streaming']) => {
  const { enableAnimation = false, animationConfig } = streaming || {};

  const animatedComponents = useMemo(() => {
    if (!enableAnimation) return {};

    return ANIMATION_TAGS.reduce<AnimationComponents>((acc, tag) => {
      const AnimatedComponent: React.FC<React.ComponentProps<typeof tag>> = React.memo((props) => (
        <AnimationNode nodeTag={tag} animationConfig={animationConfig} {...props} />
      ));
      return { ...acc, [tag]: AnimatedComponent };
    }, {} as AnimationComponents);
  }, [enableAnimation, JSON.stringify(animationConfig)]);

  return animatedComponents;
};

export default useAnimation;
