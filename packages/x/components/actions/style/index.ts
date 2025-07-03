import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface ActionsToken extends FullToken<'Actions'> {}

const genActionsStyle: GenerateStyle<ActionsToken> = (token) => {
  const { componentCls, calc } = token;

  return {
    [componentCls]: {
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      [`${componentCls}-list`]: {
        display: 'inline-flex',
        flexDirection: 'row',
        gap: token.paddingXS,
        color: token.colorTextDescription,

        '&-item, &-sub-item': {
          cursor: 'pointer',
          padding: token.paddingXXS,
          borderRadius: token.borderRadius,
          height: token.controlHeightSM,
          boxSizing: 'border-box',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',

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
      '& .border': {
        padding: `${token.paddingXS} ${token.paddingSM}`,
        gap: token.paddingSM,
        borderRadius: calc(token.borderRadiusLG).mul(1.5).equal(),
        backgroundColor: token.colorBorderSecondary,
        color: token.colorTextSecondary,

        [`${componentCls}-list-item, ${componentCls}-list-sub-item`]: {
          padding: token.paddingXXS,
          lineHeight: token.lineHeight,

          '&-icon': {
            fontSize: token.fontSize,
          },

          '&:hover': {
            opacity: 0.8,
          },
        },
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
