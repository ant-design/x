import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { GenerateStyle } from 'antd/es/theme/internal';
import type { GetDefaultToken, FullToken } from '../../theme/useToken';

export interface ComponentToken {}

export interface XMarkdownToken extends FullToken<'Mermaid'> {}

const genXMarkdownStyle: GenerateStyle<XMarkdownToken> = (token) => {
  const {
    componentCls,
    paddingXS,
    paddingSM,
    marginSM,
    marginLG,
    marginMD,
    margin,
    fontSizeHeading3,
    fontSizeHeading4,
    fontSizeHeading5,
    paddingXXS,
    lineHeightLG,
    lineHeight,
  } = token;

  return {
    [componentCls]: {
      fontSize: fontSizeHeading5,
      lineHeight,

      '& h1, & h2, & h3, & h4, & p, & pre': {
        marginBottom: margin,
      },

      '& p+h1': {
        marginTop: marginLG,
      },

      '& p+h2': {
        marginTop: marginMD,
      },

      '& p+h3, & p+h4': {
        marginTop: margin,
      },

      '& h1': {
        fontSize: fontSizeHeading3,
        fontWeight: 500,
        lineHeight: lineHeightLG,
      },

      '& h2': {
        fontSize: fontSizeHeading4,
        fontWeight: 500,
        lineHeight: lineHeightLG,
      },

      '& h3': {
        fontSize: 18,
        fontWeight: 500,
        lineHeight: lineHeightLG,
      },

      '& h4': {
        fontSize: fontSizeHeading5,
        fontWeight: 500,
      },

      '& p': {
        fontSize: fontSizeHeading5,
      },

      '& hr': {
        marginBottom: marginLG,
        marginTop: marginLG,
      },

      '& code': {
        backgroundColor: 'transparent',
        display: 'inline-flex',
      },

      '& ul, & ol': {
        marginBottom: marginSM,
        marginTop: paddingXS,
        paddingLeft: paddingSM,
        textAlign: 'left',
      },

      '& ul': {
        listStyle: 'disc',
        '& ul': {
          listStyle: 'circle',
          '& ul': {
            listStyle: 'square',
          },
        },
      },

      '& ol': {
        listStyle: 'decimal',
      },

      '& li': {
        marginBottom: paddingXXS,
        marginLeft: paddingXXS,
        wordBreak: 'break-word',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'XMarkdown'> = () => ({});

export default genStyleHooks<'XMarkdown'>(
  'XMarkdown',
  (token) => {
    const xmarkdownToken = mergeToken<XMarkdownToken>(token, {});
    return [genXMarkdownStyle(xmarkdownToken)];
  },
  prepareComponentToken,
);
