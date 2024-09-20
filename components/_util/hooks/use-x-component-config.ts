import React from 'react';
import XProviderContext, { defaultXComponentConfig } from '../../x-provider/context';

import type { DefaultXComponentConfig, XComponentsConfig } from '../../x-provider/context';

const useXComponentConfig = <C extends keyof XComponentsConfig>(
  component: C,
): Required<XComponentsConfig>[C] & DefaultXComponentConfig => {
  const xProviderContext = React.useContext(XProviderContext);

  return React.useMemo(
    () => ({
      ...defaultXComponentConfig,
      ...xProviderContext[component],
    }),
    [xProviderContext[component]],
  );
};

export default useXComponentConfig;
