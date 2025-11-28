import type { CSSObject } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

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
        borderTopLeftRadius: token.borderRadius,
        borderTopRightRadius: token.borderRadius,
      },
      '&-header-title': {
        fontSize: token.fontSize,
        fontWeight: token.fontWeightStrong,
      },
      '&-code': {
        borderBottomRightRadius: token.borderRadius,
        borderBottomLeftRadius: token.borderRadius,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
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

export const prepareComponentToken: GetDefaultToken<'CodeHighlighter'> = () => ({});

export default genStyleHooks(
  'CodeHighlighter',
  (token) => {
    const codeHighlighterToken = mergeToken<CodeHighlighterToken>(token, {});
    return [genCodeHighlighterStyle(codeHighlighterToken)];
  },
  prepareComponentToken,
);
