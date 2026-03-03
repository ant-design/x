import type { AnimationItem } from 'lottie-web';
import React, { useEffect, useImperativeHandle } from 'react';
import useLottie from '../../../hooks/useLottie';

interface Props {
  path: string;
  className?: string;
  onLoad?: (animation: AnimationItem, lottieRef: React.RefObject<HTMLDivElement | null>) => void;
  config?: {
    autoplay: boolean;
  };
  ref?: any;
}
const Lottie: React.FC<Props> = ({ path, className, config, ref, onLoad }) => {
  const [lottieRef, animation] = useLottie({
    renderer: 'svg',
    loop: false,
    autoplay: config?.autoplay === undefined ? true : config?.autoplay,
    path,
  });

  useImperativeHandle(ref, () => {
    return {
      animation,
      lottieRef,
    };
  }, [animation, lottieRef.current]);

  useEffect(() => {
    if (!animation) return;
    onLoad?.(animation, lottieRef);
    return () => {
      animation?.destroy();
    };
  }, [animation]);
  return <div ref={lottieRef} className={className} />;
};

export default Lottie;
