import React from 'react';
import XProviderContext from '../../x-provider/context';

import type { XComponentConfig, XComponentsConfig } from '../../x-provider/context';

const defaultXComponentStyleConfig: XComponentConfig = {
  classNames: {},
  styles: {},
  className: '',
  style: {},
  shortcutKeys: {}
};

const useXComponentConfig = <C extends keyof XComponentsConfig>(
  component: C,
): Required<XComponentsConfig>[C] & XComponentConfig => {
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
