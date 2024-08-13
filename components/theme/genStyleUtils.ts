import { genStyleUtils } from '@ant-design/cssinjs-utils';
import type { ComponentTokenMap } from './components';
import type { AnyObject } from '../_util/type';
import useAntdToken from 'antd/es/theme/useToken';
import useConfigContext from '../config-provider/useConfigContext';

export const { genStyleHooks, genComponentStyleHook, genSubStyleComponent } = genStyleUtils<
  ComponentTokenMap,
  AnyObject,
  AnyObject
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
