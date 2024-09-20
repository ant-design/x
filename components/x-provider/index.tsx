import { ConfigProvider as AntdConfigProvider } from 'antd';
import React from 'react';

import XProviderContext from './context';
import useXProvider, { defaultPrefixCls } from './hooks/use-x-provider';

import type { ConfigProviderProps as AntdConfigProviderProps } from 'antd/es/config-provider';
import type { XProviderProps } from './context';

const XProvider: React.FC<XProviderProps & AntdConfigProviderProps> = (props) => {
  const { bubble, conversations, prompts, sender, suggestion, thoughtChain, ...antdConfProps } =
    props;

  const xProviderProps = React.useMemo(() => {
    return {
      bubble,
      conversations,
      prompts,
      sender,
      suggestion,
      thoughtChain,
    };
  }, [bubble, conversations, prompts, sender, suggestion, thoughtChain]);

  return (
    <XProviderContext.Provider value={xProviderProps}>
      <AntdConfigProvider
        {...antdConfProps}
        // antdx enable cssVar by default, and antd v6 will enable cssVar by default
        theme={{ cssVar: true, ...antdConfProps?.theme }}
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
