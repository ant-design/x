import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface ConversationsToken extends FullToken<'Conversations'> {}

const genConversationsStyle: GenerateStyle<ConversationsToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: token.paddingXXS,
      overflowY: 'auto',
      padding: token.paddingSM,
      margin: 0,
      listStyle: 'none',
      'ul, ol': {
        margin: 0,
        padding: 0,
        listStyle: 'none',
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
      // 会话列表
      [`& ${componentCls}-list`]: {
        display: 'flex',
        gap: token.paddingXXS,
        flexDirection: 'column',

        [`& ${componentCls}-item`]: {
          paddingInlineStart: token.paddingXL,
        },
        [`& ${componentCls}-label`]: {
          color: token.colorTextDescription,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      },
      // 会话列表项
      [`& ${componentCls}-item`]: {
        display: 'flex',
        height: token.controlHeightLG,
        minHeight: token.controlHeightLG,
        gap: token.paddingXS,
        padding: `0 ${unit(token.paddingXS)}`,
        alignItems: 'center',
        borderRadius: token.borderRadiusLG,
        cursor: 'pointer',
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        // 悬浮样式
        '&:hover': {
          backgroundColor: token.colorBgTextHover,
        },
        // 选中样式
        '&-active': {
          backgroundColor: token.colorBgTextHover,
          [`& ${componentCls}-label, ${componentCls}-menu-icon`]: {
            color: token.colorText,
          },
        },
        // 禁用样式
        '&-disabled': {
          cursor: 'not-allowed',
          [`& ${componentCls}-label`]: {
            color: token.colorTextDisabled,
          },
        },
        // 悬浮、选中时激活操作菜单
        '&:hover, &-active': {
          [`& ${componentCls}-menu-icon`]: {
            opacity: 0.6,
          },
        },

        [`${componentCls}-menu-icon:hover`]: {
          opacity: 1,
        },
      },
      // 会话名
      [`& ${componentCls}-label`]: {
        flex: 1,
        color: token.colorText,
      },
      // 会话操作菜单
      [`& ${componentCls}-menu-icon`]: {
        opacity: 0,
        fontSize: token.fontSizeXL,
      },
      // 会话图标
      [`& ${componentCls}-group-title`]: {
        display: 'flex',
        alignItems: 'center',
        height: token.controlHeightLG,
        minHeight: token.controlHeightLG,
        padding: `0 ${unit(token.paddingXS)}`,
      },
    },
  };
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
