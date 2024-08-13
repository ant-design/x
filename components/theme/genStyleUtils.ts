import { genStyleUtils } from '@ant-design/cssinjs-utils';
import type { ComponentTokenMap } from './components';

import useAntdToken from 'antd/es/theme/useToken';
import type { AliasToken, SeedToken } from 'antd/es/theme/internal';
import useConfigContext from '../config-provider/useConfigContext';

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
