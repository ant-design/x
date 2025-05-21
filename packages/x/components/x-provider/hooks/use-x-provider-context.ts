import { ConfigProvider } from 'antd';
import React from 'react';

export const defaultPrefixCls = 'ant';

function useXProviderContext() {
  const { getPrefixCls, direction, csp, iconPrefixCls, theme } = React.useContext(
    ConfigProvider.ConfigContext,
  );

  return {
    theme,
    getPrefixCls,
    direction,
    csp,
    iconPrefixCls,
  };
}

export default useXProviderContext;
