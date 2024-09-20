import { ConfigProvider } from 'antd';
import React from 'react';

import XProviderContext from '../context';

export const defaultPrefixCls = 'ant';

function useXProvider() {
  const { getPrefixCls, direction, csp, iconPrefixCls } = React.useContext(
    ConfigProvider.ConfigContext,
  );

  const xProviderContext = React.useContext(XProviderContext);

  return {
    getPrefixCls,
    direction,
    csp,
    iconPrefixCls,
    ...xProviderContext,
  };
}

export default useXProvider;
