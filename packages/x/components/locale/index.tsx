import * as React from 'react';
import { devUseWarning } from '../_util/warning';
import type { LocaleContextProps } from './context';
import LocaleContext from './context';

export { default as useLocale } from './useLocale';

export const ANT_MARK = 'internalMark';

export interface Locale {
  locale: string;
  Conversations?: {
    create: string;
  };
}

export interface LocaleProviderProps {
  locale: Locale;
  children?: React.ReactNode;
  /** @internal */
  _ANT_MARK__?: string;
}

const LocaleProvider: React.FC<LocaleProviderProps> = (props) => {
  const { locale = {} as Locale, children, _ANT_MARK__ } = props;

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('LocaleProvider');

    warning(
      _ANT_MARK__ === ANT_MARK,
      'deprecated',
      '`LocaleProvider` is deprecated. Please use `locale` with `XProvider` instead: https://x.ant.design/components/x-provider-cn#x-provider-demo-locale',
    );
  }

  const getMemoizedContextValue = React.useMemo<LocaleContextProps>(
    () => ({ ...locale, exist: true }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={getMemoizedContextValue}>{children}</LocaleContext.Provider>
  );
};

if (process.env.NODE_ENV !== 'production') {
  LocaleProvider.displayName = 'LocaleProvider';
}

export default LocaleProvider;
