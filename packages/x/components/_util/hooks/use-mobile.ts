import getIsMobile from '@rc-component/util/lib/isMobile';
import React from 'react';

/**
 * Hook to detect if the current device is mobile.
 * SSR-safe: returns `false` on the server and updates on the client.
 */
const useMobile = () => {
  const [mobile, setMobile] = React.useState(false);

  React.useLayoutEffect(() => {
    setMobile(getIsMobile());
  }, []);

  return mobile;
};

export default useMobile;
