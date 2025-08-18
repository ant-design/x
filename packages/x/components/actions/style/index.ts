import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface ActionsToken extends FullToken<'Actions'> {}

const genActionsStyle: GenerateStyle<ActionsToken> = (token) => {
  const { componentCls, antCls, calc } = token;
  return {
    [componentCls]: {
      [`& ${antCls}-pagination-item-link`]: {
        width: token.controlHeightSM,
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
      [`${componentCls}-list`]: {
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        color: token.colorText,
        gap: token.paddingXS,
        '&-item, &-sub-item': {
          cursor: 'pointer',
          paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
          paddingBlock: token.paddingXXS,
          borderRadius: token.borderRadiusSM,
          height: token.controlHeightSM,
          boxSizing: 'border-box',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: token.lineHeight,
          transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
          '&-icon': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: token.fontSize,
          },

          '&:hover': {
            background: token.colorBgTextHover,
          },
        },
      },
      '&-variant-outlined': {
        paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
        paddingBlock: token.paddingXXS,
        borderRadius: token.borderRadius,
        border: `${unit(token.lineWidth)} ${token.lineType}, ${token.colorBorderSecondary}`,
      },
      '&-variant-filled': {
        paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
        paddingBlock: token.paddingXXS,
        borderRadius: token.borderRadius,
        backgroundColor: token.colorBorderSecondary,

        [`${componentCls}-list-item, ${componentCls}-list-sub-item`]: {
          paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
          paddingBlock: token.paddingXXS,
          '&-icon': {
            fontSize: token.fontSize,
          },
          '&:hover': {
            color: token.colorTextSecondary,
            background: 'transparent',
          },
        },
      },
      '&-list-danger': {
        color: token.colorError,
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Actions'> = () => ({});

export default genStyleHooks(
  'Actions',
  (token) => {
    const compToken = mergeToken<ActionsToken>(token, {});
    return [genActionsStyle(compToken)];
  },
  prepareComponentToken,
);
