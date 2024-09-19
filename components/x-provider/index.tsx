import { ConfigProvider as AntdConfigProvider } from 'antd';
import React from 'react';

import XProviderContext from './context';
import useXProvider, { defaultPrefixCls } from './hooks/use-x-provider';

import type { ConfigProviderProps as AntdConfigProviderProps } from 'antd/es/config-provider';
import type { XProviderProps } from './context';

const XProvider: React.FC<XProviderProps & AntdConfigProviderProps> = (props) => {
  const { bubble, conversations, prompts, sender, suggestion, thoughtChain, ...antdConfProps } =
    props;

  return (
    <XProviderContext.Provider
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
    </XProviderContext.Provider>
  );
};

export { useXProvider, defaultPrefixCls };

export type { XProviderProps };

if (process.env.NODE_ENV !== 'production') {
  XProvider.displayName = 'XProvider';
}

export default XProvider;
