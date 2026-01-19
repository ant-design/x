import type { GenerateStyle } from '../../theme/interface';
import type { BubbleToken } from './bubble';

export const genSlotStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls, fontSize, lineHeight, paddingXXS, margin, colorText, fontSizeLG, calc } =
    token;
  return {
    [componentCls]: {
      // ======================== Header & Footer ========================
      [`${componentCls}-header`]: {
        display: 'flex',
        marginBottom: paddingXXS,
        fontSize: fontSize,
        lineHeight: lineHeight,
        color: colorText,
      },

      [`${componentCls}-footer`]: {
        display: 'flex',
        marginBlockStart: margin,
        fontSize: fontSize,
        lineHeight: lineHeight,
        color: colorText,

        '&-start': {
          flexDirection: 'row',
        },

        '&-end': {
          flexDirection: 'row-reverse',
        },
      },

      // ======================== Sider ========================
      [`${componentCls}-avatar`]: {
        minWidth: calc(fontSizeLG).mul(2).equal(),
      },
    },
  };
};
