import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface WelcomeToken extends FullToken<'Welcome'> {}

const genWelcomeStyle: GenerateStyle<WelcomeToken> = (token) => {
  const { componentCls, calc } = token;

  const titleHeight = calc(token.fontSizeHeading3).mul(token.lineHeightHeading3).equal();
  const descHeight = calc(token.fontSize).mul(token.lineHeight).equal();

  return {
    [componentCls]: {
      gap: token.padding,

      // ======================== Icon ========================
      [`${componentCls}-icon`]: {
        height: calc(titleHeight).add(descHeight).add(token.paddingXXS).equal(),
        display: 'flex',

        img: {
          height: '100%',
        },
      },

      // ==================== Content Wrap ====================
      [`${componentCls}-content-wrapper`]: {
        gap: token.paddingXS,
        flex: 'auto',
        minWidth: 0,

        [`${componentCls}-title-wrapper`]: {
          gap: token.paddingXS,
        },

        [`${componentCls}-title`]: {
          margin: 0,
        },
        [`${componentCls}-extra`]: {
          marginInlineStart: 'auto',
        },
      },
    },
  };
};

const genVariantStyle: GenerateStyle<WelcomeToken> = (token) => {
  const { componentCls, calc } = token;

  return {
    [componentCls]: {
      // ======================== Filled ========================
      '&-filled': {
        paddingInline: token.padding,
        paddingBlock: token.paddingSM,
        background: token.colorFillContent,
        borderRadius: token.borderRadiusLG,
      },

      // ====================== Borderless ======================
      '&-borderless': {
        [`${componentCls}-title`]: {
          fontSize: token.fontSizeHeading3,
          lineHeight: token.lineHeightHeading3,
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Welcome'> = () => ({});

export default genStyleHooks(
  'Welcome',
  (token) => {
    const compToken = mergeToken<WelcomeToken>(token, {});
    return [genWelcomeStyle(compToken), genVariantStyle(compToken)];
  },
  prepareComponentToken,
);
