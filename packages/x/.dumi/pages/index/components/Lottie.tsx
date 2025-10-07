import React, { useEffect, useImperativeHandle } from 'react';
import useLottie from '../../../hooks/useLottie';

interface Props {
  path: string;
  className?: string;
  config?: {
    autoplay: boolean;
  };
  ref?: any;
}
const Lottie: React.FC<Props> = ({ path, className, config, ref }) => {
  const [lottieRef, animation] = useLottie({
    renderer: 'svg',
    loop: false,
    autoplay: config?.autoplay === undefined ? true : config?.autoplay,
    path,
  });
  useImperativeHandle(ref, () => {
    return {
      animation: animation,
    };
  }, [animation]);

  useEffect(() => {
    if (!animation) return;
    return () => {
      animation?.current?.destroy();
    };
  }, [animation]);
  return <div ref={lottieRef} className={className} />;
};

export default Lottie;
