import type { AnimationConfig, AnimationItem, LottiePlayer } from 'lottie-web';
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
  const animationInstanceRef = React.useRef<AnimationItem | null>(null);

  React.useEffect(() => {
    if (disabled) return;

    let animation: AnimationItem | undefined;

    const lottie: LottiePlayer = (window as any)?.lottie;

    if (!animationInstanceRef.current) {
      if (!lazyLoad || isIntersected) {
        if (containerRef.current && lottie) {
          animation = lottie.loadAnimation({
            container: containerRef.current,
            ...stableLottieOptions,
          });

          animationInstanceRef.current = animation;
        }
      }
    } else {
      return () => {
        if (animation) {
          animation.destroy();
          animationInstanceRef.current = null;
        }
      };
    }
  }, [isIntersected, lazyLoad, stableLottieOptions, disabled]);

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
    animationInstanceRef.current,
    {
      isIntersected,
    },
  ] as const;
};

export default useLottie;
