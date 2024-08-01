import { genStyleUtils } from '@ant-design/cssinjs-utils';
import React from 'react';
import useAntdToken from 'antd/lib/theme/useToken';
import { ConfigContext } from 'antd/lib/config-provider';

import type { AliasToken, SeedToken } from 'antd/es/theme/internal';
import type { ComponentTokenMap } from './components';


export const { genStyleHooks, genComponentStyleHook, genSubStyleComponent } = genStyleUtils<
  ComponentTokenMap,
  AliasToken,
  SeedToken
>({
  usePrefix: () => {
    const { getPrefixCls, iconPrefixCls } = React.useContext(ConfigContext);
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
    const { csp } = React.useContext(ConfigContext);
    return csp ?? {};
  },
});
