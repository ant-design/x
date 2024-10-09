import { unit } from '@ant-design/cssinjs';
import type { BubbleToken } from '.';
import type { GenerateStyle } from '../../theme/cssinjs-utils';

export const genVariantStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls, paddingSM, padding } = token;
  return {
    [componentCls]: {
      [`${componentCls}-content`]: {
        // Shared: filled, outlined, shadow
        '&-filled,&-outlined,&-shadow': {
          padding: `${unit(paddingSM)} ${unit(padding)}`,
          borderRadius: token.borderRadiusLG,
        },

        // Filled:
        '&-filled': {
          backgroundColor: token.colorFillContent,
        },

        // Outlined:
        '&-outlined': {
          border: `1px solid ${token.colorBorderSecondary}`,
        },

        // Shadow:
        '&-shadow': {
          boxShadow: token.boxShadowTertiary,
        },
      },
    },
  };
};

export const genShapeStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      [`${componentCls}-content`]: {
        // round:
        '&-round': {},

        // Corner:
        '&-corner': {},
      },
    },
  };
};
