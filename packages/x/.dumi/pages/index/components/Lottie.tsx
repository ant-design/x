import React, { useEffect } from 'react';
import useLottie from '../../../hooks/useLottie';

interface Props {
  path: string;
  className?: string;
}
const Lottie: React.FC<Props> = ({ path, className }) => {
  const [lottieRef, animation] = useLottie({
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path,
  });

  useEffect(() => {
    if (!animation) return;
    return () => {
      animation.destroy();
    };
  }, [animation]);
  return <div ref={lottieRef} className={className} />;
};

export default Lottie;
