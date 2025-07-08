import { ConfigProvider as AntdConfigProvider } from 'antd';
import React from 'react';
import LocaleProvider, { ANT_MARK } from '../locale';
import type { XProviderProps } from './context';
import XProviderContext from './context';
import useXProviderContext, { defaultPrefixCls } from './hooks/use-x-provider-context';

const XProvider: React.FC<XProviderProps> = (props) => {
  const {
    attachments,
    bubble,
    conversations,
    prompts,
    sender,
    suggestion,
    thoughtChain,
    welcome,
    theme,
    locale,
    children,
    ...antdConfProps
  } = props;

  const xProviderProps = React.useMemo(() => {
    return {
      attachments,
      bubble,
      conversations,
      prompts,
      sender,
      suggestion,
      thoughtChain,
      welcome,
    };
  }, [attachments, bubble, conversations, prompts, sender, suggestion, thoughtChain, welcome]);

  let childNode = children;
  if (locale) {
    childNode = (
      <LocaleProvider locale={locale} _ANT_MARK__={ANT_MARK}>
        {childNode}
      </LocaleProvider>
    );
  }
  return (
    <XProviderContext.Provider value={xProviderProps}>
      <AntdConfigProvider {...antdConfProps} theme={theme} locale={locale}>
        {childNode}
      </AntdConfigProvider>
    </XProviderContext.Provider>
  );
};

export { useXProviderContext, defaultPrefixCls };

export type { XProviderProps };

if (process.env.NODE_ENV !== 'production') {
  XProvider.displayName = 'XProvider';
}

export default XProvider;
