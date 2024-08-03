import { ConfigProvider } from 'antd';
import * as React from 'react';

export default function useConfigContext() {
  const context = React.useContext(ConfigProvider.ConfigContext);
  return context;
}
