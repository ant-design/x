import React from 'react';
import XProviderContext from '../../x-provider/context';

import type { XComponentStyleConfig, XComponentsConfig } from '../../x-provider/context';

const defaultXComponentStyleConfig: XComponentStyleConfig = {
  classNames: {},
  styles: {},
  className: '',
  style: {},
};

const useXComponentConfig = <C extends keyof XComponentsConfig>(
  component: C,
): Required<XComponentsConfig>[C] & XComponentStyleConfig => {
  const xProviderContext = React.useContext(XProviderContext);

  return React.useMemo(
    () => ({
      ...defaultXComponentStyleConfig,
      ...xProviderContext[component],
    }),
    [xProviderContext[component]],
  );
};

export default useXComponentConfig;
