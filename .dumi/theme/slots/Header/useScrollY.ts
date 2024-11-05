import React from 'react';

const getSnapshot = () => window.scrollY;

const useScrollY = () => {
  const [scrollYDirection, setScrollYDirection] = React.useState<'down' | 'up'>();

  const subscribe = React.useCallback((callback: () => void) => {
    let ticking = false;
    let scrollY = window.scrollY;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback();
          setScrollYDirection(scrollY > window.scrollY ? 'up' : 'down');
          scrollY = window.scrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollY = React.useSyncExternalStore<number>(subscribe, getSnapshot);

  return {
    scrollY,
    scrollYDirection,
  };
};

export default useScrollY;
