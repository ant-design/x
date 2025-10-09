import type { AnimationConfig, AnimationItem, LottiePlayer } from 'lottie-web';
import React from 'react';

interface UseLottieOptions extends Omit<AnimationConfig, 'container' | 'renderer'> {
  renderer?: 'svg' | 'canvas' | 'html';
  lazyLoad?: boolean;
  disabled?: boolean;
  rootMargin?: string;
  path?: string;
}

// 用于确保 lottie-web 只加载一次
let lottiePromise: Promise<LottiePlayer> | null = null;

const loadLottie = async (): Promise<LottiePlayer> => {
  if (!lottiePromise) {
    lottiePromise = new Promise((resolve, reject) => {
      if ((window as any)?.lottie) {
        resolve((window as any).lottie);
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://gw.alipayobjects.com/os/lib/lottie-web/5.12.2/build/player/lottie_svg.min.js';
      script.async = true;
      script.onload = () => resolve((window as any).lottie);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return lottiePromise;
};

const useLottie = (options: UseLottieOptions) => {
  const { lazyLoad = true, rootMargin = '200px', disabled = false, ...lottieOptions } = options;
  const stableLottieOptions = React.useMemo(() => lottieOptions, []);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isIntersected, setIsIntersected] = React.useState(!lazyLoad);
  const animationInstanceRef = React.useRef<AnimationItem | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [animationInstance, setAnimationInstance] = React.useState<AnimationItem>();
  React.useEffect(() => {
    if (disabled) return;
    let mounted = true;

    const initAnimation = async () => {
      if (!animationInstanceRef.current && (!lazyLoad || isIntersected)) {
        if (!containerRef.current) return;

        try {
          const lottie = await loadLottie();

          if (!mounted) return;

          const animation = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg', // 默认使用 SVG 渲染，性能更好
            ...stableLottieOptions,
          });
          setAnimationInstance(animation);
          animationInstanceRef.current = animation;
        } catch (err) {
          if (mounted) {
            setError(err as Error);
            console.error('Failed to load Lottie animation:', err);
          }
        }
      }
    };

    initAnimation();

    return () => {
      mounted = false;
      if (animationInstanceRef.current) {
        animationInstanceRef.current.destroy();
        animationInstanceRef.current = null;
      }
    };
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
    animationInstance,
    {
      isIntersected,
      error,
    },
  ] as const;
};

export default useLottie;
