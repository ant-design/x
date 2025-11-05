import type { Theme } from '@ant-design/cssinjs';
import { createTheme, useCacheToken } from '@ant-design/cssinjs';
import { theme as antdTheme } from 'antd';
import type { DesignTokenProviderProps } from 'antd/es/theme/context';
import { ignore, unitless } from 'antd/es/theme/useToken';
import formatToken from 'antd/es/theme/util/alias';
import React from 'react';
import version from '../version';
import type { AliasToken, GlobalToken, SeedToken } from './cssinjs-utils';

const defaultTheme: Theme<SeedToken, AliasToken> = createTheme(antdTheme.defaultAlgorithm);

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
          componentTheme as unknown as Theme<any, any>,
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
    cssVar: ctxCssVar,
  } = React.useContext(antdTheme._internalContext);

  const cssVar = {
    prefix: ctxCssVar?.prefix || 'ant',
    key: ctxCssVar?.key || 'css-var-root',
  };

  const mergedTheme = theme || defaultTheme;

  const [token, hashId, realToken] = useCacheToken<GlobalToken, SeedToken>(
    mergedTheme,
    [antdTheme.defaultSeed, rootDesignToken],
    {
      salt: `${version}-${hashed || ''}`,
      override,
      getComputedToken,
      cssVar: {
        ...cssVar,
        unitless,
        ignore,
        preserve,
      },
    },
  );
  return [theme as Theme<SeedToken, AliasToken>, realToken, hashed ? hashId : '', token, cssVar];
}

export default function useToken() {
  const [theme, token, hashId] = useInternalToken();

  return { theme, token, hashId };
}
