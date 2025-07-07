import formatToken from 'antd/es/theme/util/alias';
import { createTheme, useCacheToken } from '@ant-design/cssinjs';
import { theme as antdTheme } from 'antd';
import type { Theme } from '@ant-design/cssinjs';
import type { AliasToken, SeedToken } from 'antd/es/theme/internal';
import type { DesignTokenProviderProps } from 'antd/es/theme/context';
import React from 'react';
import { ignore, unitless } from 'antd/es/theme/useToken';
import version from '../version';
import type {
  GlobalToken as GlobalTokenTypeUtil,
  TokenMapKey,
  GetDefaultToken as GetDefaultTokenTypeUtil,
  FullToken as FullTokenTypeUtil,
} from '@ant-design/cssinjs-utils';
import { ComponentTokenMap } from './interface/components';

const defaultTheme: Theme<SeedToken, AliasToken> = createTheme(antdTheme.defaultAlgorithm);

export type GlobalToken = GlobalTokenTypeUtil<ComponentTokenMap, AliasToken>;

export type GetDefaultToken<C extends TokenMapKey<ComponentTokenMap>> = GetDefaultTokenTypeUtil<
  ComponentTokenMap,
  AliasToken,
  C
>;

export type FullToken<C extends TokenMapKey<ComponentTokenMap>> = FullTokenTypeUtil<
  ComponentTokenMap,
  AliasToken,
  C
>;

const preserve: {
  [key in keyof AliasToken]?: boolean;
} = {
  screenXS: true,
  screenXSMin: true,
  screenXSMax: true,
  screenSM: true,
  screenSMMin: true,
  screenSMMax: true,
  screenMD: true,
  screenMDMin: true,
  screenMDMax: true,
  screenLG: true,
  screenLGMin: true,
  screenLGMax: true,
  screenXL: true,
  screenXLMin: true,
  screenXLMax: true,
  screenXXL: true,
  screenXXLMin: true,
};

export const getComputedToken = (
  originToken: SeedToken,
  overrideToken: DesignTokenProviderProps['components'] & {
    override?: Partial<AliasToken>;
  },
  theme: Theme<any, any>,
) => {
  const derivativeToken = theme.getDerivativeToken(originToken);

  const { override, ...components } = overrideToken;

  // Merge with override
  let mergedDerivativeToken = {
    ...derivativeToken,
    override,
  };

  // Format if needed
  mergedDerivativeToken = formatToken(mergedDerivativeToken);

  if (components) {
    Object.entries(components).forEach(([key, value]) => {
      const { theme: componentTheme, ...componentTokens } = value;
      let mergedComponentToken = componentTokens;
      if (componentTheme) {
        mergedComponentToken = getComputedToken(
          {
            ...mergedDerivativeToken,
            ...componentTokens,
          },
          {
            override: componentTokens,
          },
          componentTheme,
        );
      }
      mergedDerivativeToken[key] = mergedComponentToken;
    });
  }

  return mergedDerivativeToken;
};

export function useInternalToken(): [
  theme: Theme<SeedToken, AliasToken>,
  token: GlobalToken,
  hashId: string,
  realToken: GlobalToken,
  cssVar?: DesignTokenProviderProps['cssVar'],
] {
  const {
    token: rootDesignToken,
    hashed,
    theme = defaultTheme,
    override,
    cssVar,
  } = React.useContext(antdTheme._internalContext);

  const [token, hashId, realToken] = useCacheToken<GlobalToken, SeedToken>(
    theme,
    [antdTheme.defaultSeed, rootDesignToken],
    {
      salt: `${version}-${hashed || ''}`,
      override,
      getComputedToken,
      cssVar: cssVar && {
        prefix: cssVar.prefix,
        key: cssVar.key,
        unitless,
        ignore,
        preserve,
      },
    },
  );

  return [theme as Theme<SeedToken, AliasToken>, realToken, hashed ? hashId : '', token, cssVar];
}
