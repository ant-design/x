import { createTheme, useCacheToken } from '@ant-design/cssinjs';
import { theme as antdTheme } from 'antd';
import formatToken from 'antd/es/theme/util/alias';
import React from 'react';

import version from '../version';

import type { Theme } from '@ant-design/cssinjs';
import type { DesignTokenProviderProps } from 'antd/es/theme/context';
import type { AliasToken, GlobalToken, SeedToken } from './cssinjs-utils';

const defaultTheme: Theme<SeedToken, AliasToken> = createTheme(antdTheme.defaultAlgorithm);

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
      cssVar,
    },
  );
  return [theme as Theme<SeedToken, AliasToken>, realToken, hashed ? hashId : '', token, cssVar];
}

export default function useToken() {
  const [theme, token, hashId] = useInternalToken();

  return { theme, token, hashId };
}
