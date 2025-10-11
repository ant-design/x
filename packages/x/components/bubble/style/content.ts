import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { BubbleToken } from './bubble';

export const genVariantStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      [`${componentCls}-content`]: {
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

        '&-borderless': {
          backgroundColor: 'transparent',
          padding: 0,
          minHeight: 0,
        },
      },
    },
  };
};

export const genShapeStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls, fontSize, lineHeight, paddingSM, borderRadius, calc } = token;

  const halfRadius = calc(fontSize).mul(lineHeight).div(2).add(paddingSM).equal();
  // 12px
  const defaultRadius = calc(borderRadius).mul(2).equal();

  const contentCls = `${componentCls}-content`;

  return {
    [componentCls]: {
      [contentCls]: {
        '&-default': {
          borderRadius: {
            _skip_check_: true,
            value: defaultRadius,
          },
        },

        '&-round': {
          borderRadius: {
            _skip_check_: true,
            value: halfRadius,
          },
        },

        '&-corner': {
          borderRadius: {
            _skip_check_: true,
            value: defaultRadius,
          },
        },

        '&-editing': {
          'div:first-child': {
            outline: 'none',
          },

          [`${componentCls}-editing-opts`]: {
            marginBlockStart: token.marginSM,

            'button:last-child': {
              backgroundColor: token.colorBgContainer,

              '&:hover': {
                backgroundColor: token.colorBgLayout,
              },
            },
          },
        },
      },

      [`&-start ${componentCls}-content-corner`]: {
        borderStartStartRadius: token.borderRadiusXS,
      },

      [`&-end ${componentCls}-content-corner`]: {
        borderStartEndRadius: token.borderRadiusXS,
      },
    },
  };
};
