import { genStyleUtils } from '@ant-design/cssinjs-utils';
import useXProviderContext from '@ant-design/x/es/x-provider/hooks/use-x-provider-context';
import type { AliasToken, SeedToken } from 'antd/es/theme/internal';
import { ComponentTokenMap } from './interface/components';
import { useInternalToken } from './useToken';

export const { genStyleHooks, genComponentStyleHook, genSubStyleComponent } = genStyleUtils<
  ComponentTokenMap,
  AliasToken,
  SeedToken
>({
  usePrefix: () => {
    const { getPrefixCls, iconPrefixCls } = useXProviderContext();
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
    const { csp } = useXProviderContext();
    return csp ?? {};
  },
  layer: {
    name: 'antdx',
    dependencies: ['antd'],
  },
});
