import type { Theme } from '@ant-design/cssinjs';

import type { AliasToken, MapToken, OverrideToken, SeedToken } from './interface';

// ================================ Context =================================

export type ComponentsToken = {
  [key in keyof OverrideToken]?: OverrideToken[key] & {
    theme?: Theme<SeedToken, MapToken>;
  };
};

export interface DesignTokenProviderProps {
  token: Partial<AliasToken>;
  theme?: Theme<SeedToken, MapToken>;
  components?: ComponentsToken;
  /** Just merge `token` & `override` at top to save perf */
  override: { override: Partial<AliasToken> } & ComponentsToken;
  hashed?: string | boolean;
  cssVar?: { prefix?: string; key?: string };
  /**
   * @descCN 开启零运行时模式，不会在运行时产生样式，需要手动引入 CSS 文件。
   * @descEN Enable zero-runtime mode, which will not generate style at runtime, need to import additional CSS file.
   * @default true
   * @since 2.0.0
   * @example
   * ```tsx
   * import { XProvider } from '@ant-design/x';
   * todo: 导出 antd 样式文件
   *
   * const Demo = () => (
   *   <XProvider theme={{ zeroRuntime: true }}>
   *     <App />
   *   </XProvider>
   *);
   * ```
   */
  // zeroRuntime?: boolean;
}
