import { ConfigProvider as AntdConfigProvider } from 'antd';
import React from 'react';

import XConfigContext from './context';
import useXConfig, { defaultPrefixCls } from './hooks/use-x-config';

import type { ConfigProviderProps as AntdConfigProviderProps } from 'antd/es/config-provider';
import type { XConfigProviderProps } from './context';

const XConfigProvider: React.FC<XConfigProviderProps & AntdConfigProviderProps> = (props) => {
  const { bubble, conversations, prompts, sender, suggestion, thoughtChain, ...antdConfProps } =
    props;

  return (
    <XConfigContext.Provider
      value={{
        bubble,
        conversations,
        prompts,
        sender,
        suggestion,
        thoughtChain,
      }}
    >
      <AntdConfigProvider
        {...antdConfProps}
        // antdx enable cssVar by default, and antd v6 will enable cssVar by default
        theme={{ ...(antdConfProps?.theme || {}), cssVar: true }}
      />
    </XConfigContext.Provider>
  );
};

export { useXConfig, defaultPrefixCls };

export type { XConfigProviderProps };

if (process.env.NODE_ENV !== 'production') {
  XConfigProvider.displayName = 'XConfigProvider';
}

export default XConfigProvider;
