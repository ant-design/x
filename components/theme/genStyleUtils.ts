import { genStyleUtils } from '@ant-design/cssinjs-utils';
import type { ComponentTokenMap } from './components';
import type { AnyObject } from '../_util/type';
import React from 'react';
import useAntdToken from 'antd/lib/theme/useToken';
import { ConfigContext } from 'antd/lib/config-provider';

export const { genStyleHooks, genComponentStyleHook } = genStyleUtils<
  ComponentTokenMap,
  AnyObject,
  AnyObject
>({
  usePrefix: () => {
    const { getPrefixCls, iconPrefixCls } = React.useContext(ConfigContext);
    return {
      iconPrefixCls,
      rootPrefixCls: getPrefixCls(),
    };
  },
  useToken: () => {
    const [, token, , realToken] = useAntdToken();
    return { token, realToken };
  },
  useCSP: () => {
    const { csp } = React.useContext(ConfigContext);
    return csp ?? {};
  },
});
