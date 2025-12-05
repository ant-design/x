import type { CSSObject } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

export interface ComponentToken {
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
}

export interface MermaidToken extends FullToken<'Mermaid'> {}

const genMermaidStyle: GenerateStyle<MermaidToken> = (token: MermaidToken): CSSObject => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      [`${componentCls}-header`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: token.colorBgTitle,
        color: token.colorTextTitle,
        padding: token.paddingSM,
        borderStartStartRadius: token.borderRadius,
        borderStartEndRadius: token.borderRadius,
      },
      [`${componentCls}-graph`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${token.colorBgTitle}`,
        borderTop: 'none',
        padding: token.paddingSM,
        background: token.colorBgContainer,
        overflow: 'auto',
        borderEndEndRadius: token.borderRadius,
        borderEndStartRadius: token.borderRadius,
      },
      [`${componentCls}-graph-hidden`]: {
        display: 'none',
      },
      [`${componentCls}-graph svg`]: {
        maxWidth: '100%',
        height: 'auto',
      },
      [`${componentCls}-code`]: {
        borderEndEndRadius: token.borderRadius,
        borderEndStartRadius: token.borderRadius,
        borderBottom: `1px solid ${token.colorBgTitle}`,
        borderInlineStart: `1px solid ${token.colorBgTitle}`,
        borderInlineEnd: `1px solid ${token.colorBgTitle}`,
        background: token.colorBgContainer,
        paddingInline: token.paddingSM,
        paddingBlock: token.paddingSM,
        overflow: 'hidden',
        'pre,code': {
          whiteSpace: 'pre',
          fontSize: token.fontSize,
          fontFamily: token.fontFamilyCode,
          lineHeight: 2,
          borderRadius: 0,
          border: 'none',
        },
        "code[class*='language-'],pre[class*='language-']": {
          background: 'none',
        },
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Mermaid'> = (token) => ({
  colorBgTitle: token.colorFillContent,
  colorBorderCode: token.colorBorderSecondary,
  colorBorderGraph: token.colorBorderSecondary,
  colorTextTitle: token.colorText,
});

export default genStyleHooks<'Mermaid'>(
  'Mermaid',
  (token) => {
    const mermaidToken = mergeToken<MermaidToken>(token, {});
    return [genMermaidStyle(mermaidToken)];
  },
  prepareComponentToken,
);
