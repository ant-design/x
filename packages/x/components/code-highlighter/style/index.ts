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
}

export interface CodeHighlighterToken extends FullToken<'CodeHighlighter'> {}

const genCodeHighlighterStyle: GenerateStyle<CodeHighlighterToken> = (
  token: CodeHighlighterToken,
): CSSObject => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      '&-header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: token.colorText,
        background: token.colorFillContent,
        padding: token.paddingSM,
        borderStartStartRadius: token.borderRadius,
        borderStartEndRadius: token.borderRadius,
      },
      '&-header-title': {
        fontSize: token.fontSize,
        fontWeight: token.fontWeightStrong,
      },
      '&-code': {
        borderEndEndRadius: token.borderRadius,
        borderEndStartRadius: token.borderRadius,
        borderStartStartRadius: 0,
        borderStartEndRadius: 0,
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderTop: 'none',
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

export const prepareComponentToken: GetDefaultToken<'CodeHighlighter'> = (token) => ({
  colorBgTitle: token.colorFillContent,
  colorBorderCode: token.colorBorderSecondary,
  colorTextTitle: token.colorText,
});

export default genStyleHooks(
  'CodeHighlighter',
  (token) => {
    const codeHighlighterToken = mergeToken<CodeHighlighterToken>(token, {});
    return [genCodeHighlighterStyle(codeHighlighterToken)];
  },
  prepareComponentToken,
);
