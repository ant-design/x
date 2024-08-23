import { genStyleUtils } from '@ant-design/cssinjs-utils';

import useAntdToken from 'antd/lib/theme/useToken';
import { useConfigContext } from '../config-provider';

import type { AliasToken, SeedToken } from 'antd/es/theme/internal';
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
    const [theme, token, hashId, realToken, cssVar] = useAntdToken();
    return { theme, token, hashId, realToken, cssVar };
  },
  useCSP: () => {
    const { csp } = useConfigContext();
    return csp ?? {};
  },
});
