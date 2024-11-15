import lottie, { type AnimationConfig, type AnimationItem } from 'lottie-web';
import React from 'react';

interface UseLottieOptions extends Omit<AnimationConfig, 'container' | 'renderer'> {
  renderer?: 'svg' | 'canvas' | 'html';
  lazyLoad?: boolean;
  disabled?: boolean;
  rootMargin?: string;
  path?: string;
}

const useLottie = (options: UseLottieOptions) => {
  const { lazyLoad = true, rootMargin = '200px', disabled = false, ...lottieOptions } = options;
  const stableLottieOptions = React.useMemo(() => lottieOptions, []);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isIntersected, setIsIntersected] = React.useState(!lazyLoad);
  const [animationInstance, setAnimationInstance] = React.useState<AnimationItem | null>(null);

  React.useEffect(() => {
    if (disabled) return;

    let animation: AnimationItem | undefined;

    if (!animationInstance) {
      if (!lazyLoad || isIntersected) {
        if (containerRef.current) {
          animation = lottie.loadAnimation({
            container: containerRef.current,
            ...stableLottieOptions,
          });

          setAnimationInstance(animation);
        }
      }
    } else {
      return () => {
        if (animation) {
          animation.destroy();
          setAnimationInstance(null);
        }
      };
    }
  }, [isIntersected, lazyLoad, stableLottieOptions, animationInstance, disabled]);

  React.useEffect(() => {
    if (disabled) return;

    if (lazyLoad) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersected(true);
          }
        },
        { root: null, rootMargin, threshold: 0 },
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    }
  }, [lazyLoad, rootMargin, disabled]);

  return [
    containerRef,
    animationInstance,
    {
      isIntersected,
    },
  ] as const;
};

export default useLottie;
