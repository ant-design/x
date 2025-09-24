import { mergeToken } from '@ant-design/cssinjs-utils';
import type { GenerateStyle } from 'antd/es/theme/internal';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GetDefaultToken } from '../../theme/useToken';

export interface HighlightCodeToken extends FullToken<'HighlightCode'> {}

const genHighlightCodeStyle: GenerateStyle<HighlightCodeToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      '&-header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: token.colorTextTitle,
        background: token.colorBgTitle,
        padding: token.paddingSM,
        borderTopLeftRadius: token.borderRadius,
        borderTopRightRadius: token.borderRadius,
      },
      '&-code': {
        borderBottomRightRadius: token.borderRadius,
        borderBottomLeftRadius: token.borderRadius,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBgTitle}`,
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

export const prepareComponentToken: GetDefaultToken<'HighlightCode'> = (token) => {
  return {
    colorBgTitle: token.colorFillContent,
    colorBorderCode: token.colorBorderSecondary,
    colorTextTitle: token.colorText,
  };
};

export default genStyleHooks<'HighlightCode'>(
  'HighlightCode',
  (token) => {
    const highlightCodeToken = mergeToken<HighlightCodeToken>(token, {});
    return [genHighlightCodeStyle(highlightCodeToken)];
  },
  prepareComponentToken,
);
