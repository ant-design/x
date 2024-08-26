import { genStyleUtils } from '@ant-design/cssinjs-utils';

import useToken from './useToken';
import useConfigContext from '../config-provider/useConfigContext';

import type { AliasToken, SeedToken } from './cssinjs-utils';
import type { ComponentTokenMap } from './components';

export const { genStyleHooks, genComponentStyleHook, genSubStyleComponent } = genStyleUtils<
  ComponentTokenMap,
  AliasToken,
  SeedToken
>({
  usePrefix: () => {
    const { getPrefixCls, iconPrefixCls } = useConfigContext();
    return {
      iconPrefixCls,
      rootPrefixCls: getPrefixCls(),
    };
  },
  useToken,
  useCSP: () => {
    const { csp } = useConfigContext();
    return csp ?? {};
  },
});
