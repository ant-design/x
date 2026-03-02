import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { initFadeLeftMotion, initFadeMotion } from '../../style';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/interface';
import genActionsAudioStyle from './audio';
import genActionsCopyStyle from './copy';
import genActionsFeedbackStyle from './feedback';
// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface ActionsToken extends FullToken<'Actions'> {}

const genActionsStyle: GenerateStyle<ActionsToken> = (token) => {
  const { componentCls, antCls, calc } = token;
  return {
    [componentCls]: {
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
      [`${antCls}-pagination-item-link`]: {
        width: token.controlHeightSM,
      },
      [`${componentCls}-variant-outlined`]: {
        paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
        paddingBlock: token.paddingXXS,
        borderRadius: token.borderRadius,
        border: `${unit(token.lineWidth)} ${token.lineType}, ${token.colorBorderSecondary}`,
      },
      [`${componentCls}-variant-filled`]: {
        paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
        paddingBlock: token.paddingXXS,
        borderRadius: token.borderRadius,
        backgroundColor: token.colorBorderSecondary,

        [`${componentCls}-item`]: {
          paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
          paddingBlock: token.paddingXXS,
          '&:hover': {
            color: token.colorTextSecondary,
            background: 'transparent',
          },
        },
      },
      [`${componentCls}-list-danger`]: {
        color: token.colorError,
      },
      [`&${componentCls}-item,${componentCls}-item`]: {
        cursor: 'pointer',
        fontSize: token.fontSize,
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
        [`${componentCls}-icon`]: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: token.fontSize,
        },
        '&:hover': {
          background: token.colorBgTextHover,
        },
      },
      [`&${componentCls}-list,${componentCls}-list`]: {
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        color: token.colorText,
        gap: token.paddingXS,
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Actions'> = () => ({});

export default genStyleHooks(
  'Actions',
  (token) => {
    const compToken = mergeToken<ActionsToken>(token, {});
    return [
      genActionsStyle(compToken),
      genActionsCopyStyle(compToken),
      genActionsFeedbackStyle(compToken),
      genActionsAudioStyle(compToken),
      initFadeLeftMotion(compToken),
      initFadeMotion(compToken),
    ];
  },
  prepareComponentToken,
);
