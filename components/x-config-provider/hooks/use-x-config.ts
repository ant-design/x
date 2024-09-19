import { ConfigProvider } from 'antd';
import React from 'react';

import XConfigContext from '../context';

export const defaultPrefixCls = 'ant';

function useXConfig() {
  const { getPrefixCls, direction, csp, iconPrefixCls } = React.useContext(
    ConfigProvider.ConfigContext,
  );

  const xContext = React.useContext(XConfigContext);

  return {
    getPrefixCls,
    direction,
    csp,
    iconPrefixCls,
    ...xContext,
  };
}

export default useXConfig;
