import { mergeToken } from '@ant-design/cssinjs-utils';
import type { GenerateStyle } from 'antd/es/theme/internal';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GetDefaultToken } from '../../theme/useToken';

export type ComponentToken = {
  /**
   * @desc 标题背景颜色
   * @descEN Title background color
   */
  colorBgTitle: string;

  /**
   * @desc 标题文本颜色
   * @descEN Title text color
   */
  colorTextTitle: string;

  /**
   * @desc 代码块边框颜色
   * @descEN Code block border color
   */
  colorBorderCode: string;

  /**
   * @desc 图表边框颜色
   * @descEN Graph border color
   */
  colorBorderGraph: string;
};

export interface MermaidToken extends FullToken<'Mermaid'> {}

const genMermaidStyle: GenerateStyle<MermaidToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      '&-header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: token.colorBgTitle,
        color: token.colorTextTitle,
        padding: token.paddingSM,
        borderTopLeftRadius: token.borderRadius,
        borderTopRightRadius: token.borderRadius,
      },
      '&-graph': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        borderColor: token.colorBorderGraph,
        borderTop: 0,
        padding: token.paddingSM,
        overflow: 'auto',
        minHeight: 200,
        borderBottomRightRadius: token.borderRadius,
        borderBottomLeftRadius: token.borderRadius,
      },
      '&-graph-hidden': {
        display: 'none',
      },
      '&-graph svg': {
        maxWidth: '100%',
        height: 'auto',
      },
      '&-code': {
        border: '1px solid',
        borderColor: token.colorBorderCode,
        borderBottomRightRadius: token.borderRadius,
        borderBottomLeftRadius: token.borderRadius,
        background: 'transparent',
        borderTop: 0,
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Mermaid'> = (token) => {
  return {
    colorBgTitle: token.colorFillContent,
    colorBorderCode: token.colorBorderSecondary,
    colorBorderGraph: token.colorBorderSecondary,
    colorTextTitle: token.colorText,
  };
};

export default genStyleHooks<'Mermaid'>(
  'Mermaid',
  (token) => {
    const mermaidToken = mergeToken<MermaidToken>(token, {});
    return [genMermaidStyle(mermaidToken)];
  },
  prepareComponentToken,
);
