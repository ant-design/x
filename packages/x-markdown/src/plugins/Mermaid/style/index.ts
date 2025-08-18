import { mergeToken } from '@ant-design/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import type { GenerateStyle } from 'antd/es/theme/internal';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GetDefaultToken } from '../../theme/useToken';

export interface ComponentToken {
  /**
   * @desc 头部背景色
   * @descEN Mermaid header background color
   */
  mermaidHeaderBgColor: string;
  /**
   * @desc 内边距
   * @descEN Mermaid padding
   */
  mermaidPadding: number;
  /**
   * @desc 内边距
   * @descEN Mermaid padding
   */
  mermaidBorderRadius: number;
  /**
   * @desc 内边距
   * @descEN Mermaid padding
   */
  mermaidFontSize: number;
}

export interface MermaidToken extends FullToken<'Mermaid'> {}

const genMermaidStyle: GenerateStyle<MermaidToken> = (token) => {
  const { componentCls, mermaidBorderRadius, mermaidHeaderBgColor, mermaidPadding } = token;

  return {
    [componentCls]: {
      '&-header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: mermaidHeaderBgColor,
        padding: mermaidPadding,
        paddingLeft: mermaidPadding,
        borderTopLeftRadius: mermaidBorderRadius,
        borderTopRightRadius: mermaidBorderRadius,
      },
      '&-graph': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #f6f6f6',
        borderTop: 0,
        padding: mermaidPadding,
      },
      '&-graph-hidden': {
        display: 'none',
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Mermaid'> = (token) => {
  const mermaidHeaderBgColor = new FastColor(token.colorBgLayout).toRgbString();
  const mermaidPadding = token.paddingMD;
  const mermaidBorderRadius = token.borderRadius;
  const mermaidFontSize = token.fontSizeHeading5;

  return { mermaidHeaderBgColor, mermaidPadding, mermaidBorderRadius, mermaidFontSize };
};

export default genStyleHooks<'Mermaid'>(
  'Mermaid',
  (token) => {
    const mermaidToken = mergeToken<MermaidToken>(token, {});
    return [genMermaidStyle(mermaidToken)];
  },
  prepareComponentToken,
);
