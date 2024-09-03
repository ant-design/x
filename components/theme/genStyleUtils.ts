import { genStyleUtils } from '@ant-design/cssinjs-utils';

import { useInternalToken } from './useToken';
import { useConfigContext } from '../config-provider';

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
  useToken: () => {
    const [theme, realToken, hashId, token, cssVar] = useInternalToken();
    return { theme, realToken, hashId, token, cssVar };
  },
  useCSP: () => {
    const { csp } = useConfigContext();
    return csp ?? {};
  },
});
