import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface ActionsToken extends FullToken<'Prompts'> {}

const genActionsStyle: GenerateStyle<ActionsToken> = (token) => {
  const { componentCls, calc } = token;

  return {
    [componentCls]: {
      [`${componentCls}-list`]: {
        display: 'inline-flex',
        flexDirection: 'row',
        gap: token.paddingXS,
        color: '#8c8c8c',

        '&-item, &-sub-item': {
          cursor: 'pointer',
          padding: token.paddingXXS,
          borderRadius: token.borderRadius,
          height: token.controlHeightSM,
          width: token.controlHeightSM,
          boxSizing: 'border-box',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',

          '&-icon': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: token.fontSize,
            width: '100%',
            height: '100%',
          },

          '&:hover': {
            background: '#F6F6F6',
          },
        },
      },
      '& .border': {
        padding: `${token.paddingXS} ${token.paddingSM}`,
        gap: token.paddingSM,
        borderRadius: calc(token.borderRadiusLG).mul(1.5).equal(),
        backgroundColor: '#F7F7F7',
        color: token.colorTextSecondary,

        [`${componentCls}-list-item, ${componentCls}-list-sub-item`]: {
          padding: 0,
          lineHeight: token.lineHeight,

          '&-icon': {
            fontSize: token.fontSizeLG,
          },

          '&:hover': {
            opacity: 0.8,
          },
        },
      },
      '& .block': {
        display: 'flex',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Prompts'> = () => ({});

export default genStyleHooks(
  'Actions',
  (token) => {
    const compToken = mergeToken<ActionsToken>(token, {});
    return [genActionsStyle(compToken)];
  },
  prepareComponentToken,
);