import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';

export interface ComponentToken { };

export interface ConversationsToken extends FullToken<'Conversations'> { };

const genConversationsStyle: GenerateStyle<ConversationsToken> = (token) => {

  const { componentCls, paddingSM, colorBgTextActive, borderRadius, colorBgTextHover, colorText } = token;

  return {
    [componentCls]: {
      display: 'flex',
      gap: 8,
      flexDirection: 'column',
      width: 268,
      [`& ${componentCls}-item`]: {
        display: 'flex',
        alignItems: 'center',
        height: 20,
        borderRadius,
        padding: paddingSM,
        '&:hover': {
          backgroundColor: colorBgTextHover,
        },
        '&-active': {
          backgroundColor: colorBgTextActive,
          '&:hover': {
            backgroundColor: colorBgTextActive,
          },
        },
        '&:hover, &-active': {
          [`& ${componentCls}-menu`]: {
            display: 'inline-block',
          },
        },
      },
      [`& ${componentCls}-label`]: {
        flex: 1,
        color: colorText,
      },
      [`& ${componentCls}-menu`]: {
        float: 'right',
        cursor: 'pointer',
        display: 'none',
      },
    },
  }
};

export const prepareComponentToken: GetDefaultToken<'Conversations'> = () => ({});

export default genStyleHooks(
  'Conversations',
  (token) => {
    const compToken = mergeToken<ConversationsToken>(token, {});
    return genConversationsStyle(compToken);
  },
  prepareComponentToken,
);