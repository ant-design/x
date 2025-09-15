import React from 'react';
import type { XComponentConfig, XComponentsConfig } from '../../x-provider/context';
import XProviderContext from '../../x-provider/context';
import { MarkdownComponentsConfig as XMarkdownComponentsConfig } from '../../x-provider/XMarkdownComponents';

const defaultXComponentStyleConfig: XComponentConfig = {
  classNames: {},
  styles: {},
  className: '',
  style: {},
  shortcutKeys: {},
};

type MergeXComponentsConfig = XComponentsConfig & XMarkdownComponentsConfig;
const useXComponentConfig = <C extends keyof MergeXComponentsConfig>(
  component: C,
): Required<MergeXComponentsConfig>[C] & XComponentConfig => {
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
