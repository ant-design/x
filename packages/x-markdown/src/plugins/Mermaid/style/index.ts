import type { CSSObject } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { GenerateStyle } from '../../theme/interface';
import type { FullToken, GetDefaultToken } from '../../theme/useToken';

export interface MermaidToken extends FullToken<'Mermaid'> {}

const genMermaidStyle: GenerateStyle<MermaidToken> = (token: MermaidToken): CSSObject => {
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
        border: `1px solid ${token.colorBgTitle}`,
        borderTop: 'none',
        padding: token.paddingSM,
        background: token.colorBgContainer,
        overflow: 'auto',
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
        borderBottomRightRadius: token.borderRadius,
        borderBottomLeftRadius: token.borderRadius,
        borderBottom: `1px solid ${token.colorBgTitle}`,
        borderLeft: `1px solid ${token.colorBgTitle}`,
        borderRight: `1px solid ${token.colorBgTitle}`,
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
