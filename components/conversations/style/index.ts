import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';

export interface ComponentToken { };

export interface ConversationsToken extends FullToken<'Conversations'> { };

const genConversationsStyle: GenerateStyle<ConversationsToken> = (token) => ({
  [token.componentCls]: {
    display: 'flex',
    gap: token.paddingXS,
    flexDirection: 'column',
    [`&${token.componentCls}-rtl`]: {
      direction: 'rtl',
    },
    // 会话列表
    [`& ${token.componentCls}-list`]: {
      display: 'flex',
      gap: token.paddingXS,
      flexDirection: 'column',
    },
    // 会话列表项
    [`& ${token.componentCls}-item`]: {
      display: 'flex',
      gap: token.paddingXS,
      alignItems: 'center',
      borderRadius: token.borderRadius,
      padding: token.paddingSM,
      cursor: 'pointer',
      // 悬浮样式
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
      // 选中样式
      '&-active': {
        backgroundColor: token.colorBgTextActive,
        '&:hover': {
          backgroundColor: token.colorBgTextActive,
        },
      },
      // 禁用样式
      '&-disabled': {
        cursor: 'not-allowed',
        [`& ${token.componentCls}-label`]: {
          color: token.colorTextDisabled,
        },
      },
      // 悬浮、选中时激活操作菜单
      '&:hover, &-active': {
        [`& ${token.componentCls}-menu-icon`]: {
          opacity: 1,
        },
      },
    },
    // 会话名
    [`& ${token.componentCls}-label`]: {
      flex: 1,
      color: token.colorText,
    },
    // 会话操作菜单
    [`& ${token.componentCls}-menu-icon`]: {
      opacity: 0,
      '&:hover': {
        color: token.colorIconHover,
      },
    },
    // 会话图标
    [`& ${token.componentCls}-icon`]: {
    },
  },
});

export const prepareComponentToken: GetDefaultToken<'Conversations'> = () => ({});

export default genStyleHooks(
  'Conversations',
  (token) => {
    const compToken = mergeToken<ConversationsToken>(token, {});
    return genConversationsStyle(compToken);
  },
  prepareComponentToken,
);