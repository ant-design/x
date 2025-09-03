import type { LocaleComponentName as AntdLocaleContextProps } from 'antd/es/locale/useLocale';
import defaultAntdEnUS from 'antd/locale/en_US';
import * as React from 'react';
import type { Locale, xLocale, xMarkdownLocale } from '.';
import type { LocaleContextProps } from './context';
import LocaleContext from './context';
import defaultLocaleData from './en_US';

type LocaleComponentName = Exclude<keyof xLocale, 'locale'>;
type MarkdownComponentName = Exclude<keyof xMarkdownLocale, 'locale'>;
type mergeLocaleComponentName =
  | LocaleComponentName
  | AntdLocaleContextProps
  | MarkdownComponentName;
const useLocale = <C extends mergeLocaleComponentName = LocaleComponentName>(
  componentName: C,
  defaultLocale?: Locale[C] | (() => Locale[C]),
): readonly [NonNullable<Locale[C]>, string] => {
  const fullLocale = React.useContext<LocaleContextProps | undefined>(LocaleContext);
  console.log(fullLocale, 'fullLocale');
  const getLocale = React.useMemo<NonNullable<Locale[C]>>(() => {
    const locale =
      defaultLocale ||
      defaultLocaleData?.[componentName as LocaleComponentName] ||
      defaultAntdEnUS?.[componentName as AntdLocaleContextProps];
    const localeFromContext = fullLocale?.[componentName] ?? {};
    return {
      ...(typeof locale === 'function' ? locale() : locale),
      ...(localeFromContext || {}),
    };
  }, [componentName, defaultLocale, fullLocale]);

  const getLocaleCode = React.useMemo<string>(() => {
    const localeCode = fullLocale?.locale;
    // Had use LocaleProvide but didn't set locale
    if (fullLocale?.exist && !localeCode) {
      return defaultLocaleData.locale;
    }
    return localeCode!;
  }, [fullLocale]);

  return [getLocale, getLocaleCode] as const;
};

export default useLocale;
