import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import { genCollapseMotion } from '../../style';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

export interface ComponentToken {
  /**
   * @desc 新会话按钮背景颜色
   * @descEN New conversation button background color
   */
  creationBgColor: string;
  /**
   * @desc 新会话按钮边框颜色
   * @descEN New conversation button border color
   */
  creationBorderColor: string;
  /**
   * @desc 新会话按钮悬浮态背景颜色
   * @descEN Background color of default new conversation button when hover
   */
  creationHoverColor: string;
  /**
   * @desc 快捷键标识字体颜色
   * @descEN Shortcut key identification font color
   */
  shortcutKeyTextColor: string;
}
export interface ConversationsToken extends FullToken<'Conversations'> {}

const genConversationsStyle: GenerateStyle<ConversationsToken> = (token) => {
  const { componentCls, calc } = token;
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
      [`${componentCls}-creation`]: {
        backgroundColor: token.creationBgColor,
        color: token.colorPrimary,
        border: 'none',
        fontWeight: 500,
        paddingBlock: token.paddingXS,
        paddingInline: token.paddingSM,
        fontSize: token.fontSize,
        cursor: 'pointer',
        display: 'flex',
        gap: token.paddingXS,
        marginBlockEnd: token.marginSM,
        lineHeight: token.lineHeight,
        borderRadius: token.borderRadiusLG,
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        [`&:not(${componentCls}-creation-disabled):hover`]: {
          color: token.colorPrimary,
          background: token.creationHoverColor,
        },
        [`&:not(${componentCls}-creation-disabled)`]: {
          border: `${unit(token.lineWidth)} ${token.lineType}, ${token.creationBorderColor}`,
        },
        '&-start': {
          justifyContent: 'flex-start',
        },
        '&-center': {
          justifyContent: 'center',
        },
        '&-end': {
          justifyContent: 'flex-end',
        },
        '&-label': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        '&-label-shortcut-keys-show': {
          flex: 1,
        },
        '&-label-shortcut-keys': {
          height: token.controlHeightXS,
          display: 'flex',
          alignItems: 'center',
          gap: unit(4),
        },
        '&-label-shortcut-key': {
          borderRadius: token.borderRadiusSM,
          height: '100%',
          boxSizing: 'border-box',
          fontSize: token.fontSizeIcon,
          paddingInline: `${unit(calc(token.paddingXXS).sub(1).equal())}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: token.shortcutKeyTextColor,
          border: `${unit(token.lineWidth)} ${token.lineType}, ${token.creationBorderColor}`,
        },
        '&-disabled': {
          cursor: 'not-allowed',
          background: token.colorBgContainerDisabled,
          [`& ${componentCls}-creation-label, ${componentCls}-creation-icon`]: {
            color: token.colorTextDisabled,
          },
          [`& ${componentCls}-creation-label-shortcut-keys`]: {
            color: token.colorTextDisabled,
            border: `${unit(token.lineWidth)} ${token.lineType}, ${token.colorBgContainerDisabled}`,
          },
        },
      },
      [`& ${componentCls}-rtl`]: {
        direction: 'rtl',
      },
      [`& ${componentCls}-divider`]: {
        marginBlock: token.marginXXS,
      },
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
        [`&:not(${componentCls}-item-disabled):hover`]: {
          backgroundColor: token.colorBgTextHover,
        },
        '&-active': {
          backgroundColor: token.colorBgTextHover,
          [`& ${componentCls}-label, ${componentCls}-menu-icon`]: {
            color: token.colorText,
          },
        },
        '&-disabled': {
          cursor: 'not-allowed',
          [`& ${componentCls}-label, ${componentCls}-icon, ${componentCls}-menu-icon`]: {
            color: token.colorTextDisabled,
          },
        },
        '&:hover, &-active': {
          [`& ${componentCls}-menu-icon`]: {
            opacity: 0.6,
          },
        },

        [`${componentCls}-menu-icon:hover`]: {
          opacity: 1,
        },
      },
      [`& ${componentCls}-content-hidden`]: {
        display: 'none',
      },
      [`& ${componentCls}-label`]: {
        flex: 1,
        color: token.colorText,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      [`& ${componentCls}-menu-icon`]: {
        opacity: 0,
        fontSize: token.fontSizeXL,
      },
      [`& ${componentCls}-list`]: {
        display: 'flex',
        gap: token.paddingXXS,
        flexDirection: 'column',
      },
      [`& ${componentCls}-group-collapsible-list`]: {
        paddingBlockStart: token.paddingXXS,
        [`& ${componentCls}-item`]: {
          paddingInlineStart: token.paddingXL,
        },
      },
      [`& ${componentCls}-group-title`]: {
        display: 'flex',
        alignItems: 'center',
        color: token.colorTextDescription,
        height: token.controlHeightLG,
        minHeight: token.controlHeightLG,
        padding: `0 ${unit(token.paddingXS)}`,
      },

      [`& ${componentCls}-group-title-collapsible`]: {
        justifyContent: 'space-between',
        cursor: 'pointer',
        color: token.colorText,
        borderRadius: token.borderRadiusLG,
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        '&:hover': {
          backgroundColor: token.colorBgTextHover,
        },
      },
      [`& ${componentCls}-group-collapse-trigger`]: {
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        transform: 'rotate(0deg)',
        transformOrigin: 'center center',
      },
      [`& ${componentCls}-group-collapse-trigger-open`]: {
        transform: 'rotate(90deg)',
      },
      [`& ${componentCls}-group-collapse-trigger-close`]: {
        transform: 'rotate(0deg)',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Conversations'> = (token) => {
  const creationBgColor = new FastColor(token.colorPrimary).setA(0.15);
  const creationBorderColor = new FastColor(token.colorPrimary).setA(0.22);
  const creationHoverColor = new FastColor(token.colorPrimary).setA(0.25);
  const shortcutKeyTextColor = new FastColor(token.colorPrimary).setA(0.65);

  return {
    creationBgColor: creationBgColor.toRgbString(),
    creationBorderColor: creationBorderColor.toRgbString(),
    creationHoverColor: creationHoverColor.toRgbString(),
    shortcutKeyTextColor: shortcutKeyTextColor.toRgbString(),
  };
};

export default genStyleHooks(
  'Conversations',
  (token) => {
    const compToken = mergeToken<ConversationsToken>(token, {});
    return [genConversationsStyle(compToken), genCollapseMotion(compToken)];
  },
  prepareComponentToken,
);
