import type { ThemeConfig } from 'antd';
import { theme as antdTheme, ConfigProvider } from 'antd';
import type { ThemeProviderProps } from 'antd-style';
import { ThemeProvider } from 'antd-style';
import React, { useContext } from 'react';

interface NewToken {
  bannerHeight: number;
  headerHeight: number;
  menuItemBorder: number;
  mobileMaxWidth: number;
  siteMarkdownCodeBg: string;
  antCls: string;
  iconCls: string;
  marginFarXS: number;
  marginFarSM: number;
  marginFar: number;
  codeFamily: string;
  contentMarginTop: number;
  anchorTop: number;
  indexRadius: number;
  pcMaxWidth: number;
  pcContainerMargin: number;
}

// 通过给 antd-style 扩展 CustomToken 对象类型定义，可以为 useTheme 中增加相应的 token 对象
declare module 'antd-style' {
  export interface CustomToken extends NewToken {}
}

const headerHeight = 80;
const bannerHeight = 38;
const indexRadius = 24;
const pcMaxWidth = 1560;

const SiteThemeProvider: React.FC<ThemeProviderProps<any>> = ({ children, theme, ...rest }) => {
  const { getPrefixCls, iconPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const { token } = antdTheme.useToken();
  React.useEffect(() => {
    // 需要注意与 components/config-provider/demo/holderRender.tsx 配置冲突
    ConfigProvider.config({ theme: theme as ThemeConfig });
  }, [theme]);

  return (
    <ThemeProvider<NewToken>
      {...rest}
      key={theme?.algorithm?.length}
      theme={theme}
      customToken={{
        headerHeight,
        bannerHeight,
        indexRadius,
        pcMaxWidth,
        pcContainerMargin: 100,
        menuItemBorder: 2,
        mobileMaxWidth: 767.99,
        siteMarkdownCodeBg: token.colorFillTertiary,
        antCls: `.${rootPrefixCls}`,
        iconCls: `.${iconPrefixCls}`,
        /** 56 */
        marginFarXS: (token.marginXXL / 6) * 7,
        /** 80 */
        marginFarSM: (token.marginXXL / 3) * 5,
        /** 96 */
        marginFar: token.marginXXL * 2,
        codeFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
        contentMarginTop: 40,
        anchorTop: headerHeight + token.margin,
      }}
    >
      {children}
    </ThemeProvider>
  );
};

export default SiteThemeProvider;
