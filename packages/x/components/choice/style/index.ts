import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { initFadeLeftMotion, initFadeMotion } from '../../style';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/interface';

export interface ComponentToken {
  /**
   * @desc 选项背景色
   * @descEN Item background color
   */
  itemBg?: string;
  /**
   * @desc 选项悬停背景色
   * @descEN Item hover background color
   */
  itemHoverBg?: string;
  /**
   * @desc 选项选中背景色
   * @descEN Item selected background color
   */
  itemSelectedBg?: string;
  /**
   * @desc 选项禁用背景色
   * @descEN Item disabled background color
   */
  itemDisabledBg?: string;
  /**
   * @desc 选项边框色
   * @descEN Item border color
   */
  itemBorderColor?: string;
  /**
   * @desc 选项选中边框色
   * @descEN Item selected border color
   */
  itemSelectedBorderColor?: string;
  /**
   * @desc 选项圆角
   * @descEN Item border radius
   */
  itemBorderRadius?: number;
  /**
   * @desc 选项间距
   * @descEN Item gap
   */
  itemGap?: number;
  /**
   * @desc 选项内边距
   * @descEN Item padding
   */
  itemPadding?: number;
}

export interface ChoiceToken extends FullToken<'Choice'> {
  itemBg: string;
  itemHoverBg: string;
  itemSelectedBg: string;
  itemSelectedBorderColor: string;
  itemDisabledBg: string;
  itemBorderColor: string;
  itemBorderRadius: number;
  itemGap: number;
  itemPadding: number;
}

const genChoiceStyle: GenerateStyle<ChoiceToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      '&, & *': {
        boxSizing: 'border-box',
      },

      maxWidth: '100%',

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      // ======================== Header ========================
      [`${componentCls}-header`]: {
        marginBottom: token.paddingSM,
      },

      [`${componentCls}-title`]: {
        marginBlockStart: 0,
        marginBlockEnd: token.paddingXXS,
        fontWeight: 'normal',
        color: token.colorTextHeading,
      },

      [`${componentCls}-description`]: {
        color: token.colorTextTertiary,
        fontSize: token.fontSizeSM,
      },

      // ======================== List ========================
      [`${componentCls}-list`]: {
        display: 'flex',
        flexDirection: 'column',
        gap: unit(token.itemGap),
        listStyle: 'none',
        padding: 0,
        margin: 0,
      },

      // ======================== Layouts ========================
      // Grid layout
      [`${componentCls}-layout-grid`]: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: unit(token.itemGap),
      },

      // Card layout
      [`${componentCls}-layout-card`]: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: unit(token.itemGap),
      },

      // ======================== Item ========================
      [`${componentCls}-item`]: {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: token.paddingXS,
        padding: unit(token.itemPadding),
        background: token.itemBg,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.itemBorderColor}`,
        borderRadius: unit(token.itemBorderRadius),
        cursor: 'pointer',
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        minHeight: token.controlHeight,

        '&:hover': {
          background: token.itemHoverBg,
        },

        // Selected state
        [`&${componentCls}-item-selected`]: {
          background: token.itemSelectedBg,
          borderColor: token.itemSelectedBorderColor,
        },

        // Disabled state
        [`&${componentCls}-item-disabled`]: {
          cursor: 'not-allowed',
          background: token.itemDisabledBg,
          opacity: 0.6,
          pointerEvents: 'none',
        },

        // Recommended - primary
        [`&${componentCls}-item-recommended-primary`]: {
          borderColor: token.colorPrimary,
          [`&${componentCls}-item-selected`]: {
            borderColor: token.colorPrimary,
          },
        },

        // Recommended - secondary
        [`&${componentCls}-item-recommended-secondary`]: {
          borderColor: token.colorInfo,
        },
      },

      // ======================== Indicator ========================
      [`${componentCls}-indicator`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: token.colorPrimary,
        fontSize: token.fontSize,
        marginTop: 2,
      },

      [`${componentCls}-indicator-number`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: token.controlHeightSM,
        height: token.controlHeightSM,
        borderRadius: '50%',
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorder}`,
        fontSize: token.fontSizeSM,
        color: token.colorTextTertiary,
      },

      // ======================== Item Content ========================
      [`${componentCls}-item-content`]: {
        flex: 'auto',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: token.paddingXXS,
      },

      [`${componentCls}-item-icon`]: {
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: token.fontSizeLG,
      },

      [`${componentCls}-item-label`]: {
        color: token.colorTextHeading,
        fontWeight: 500,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
      },

      [`${componentCls}-item-desc`]: {
        color: token.colorTextTertiary,
        fontSize: token.fontSizeSM,
        lineHeight: token.lineHeight,
      },

      [`${componentCls}-item-extra`]: {
        marginTop: token.paddingXXS,
      },

      // ======================== Recommend Badge ========================
      [`${componentCls}-item-recommend-badge`]: {
        position: 'absolute',
        top: 0,
        insetInlineEnd: 0,
        padding: `${unit(token.paddingXXS)} ${unit(token.paddingXS)}`,
        fontSize: token.fontSizeSM,
        color: token.colorPrimary,
        background: token.colorPrimaryBg,
        borderRadius: `0 ${unit(token.itemBorderRadius)} 0 ${unit(token.borderRadiusSM)}`,
        fontWeight: 500,
        lineHeight: token.lineHeight,

        [`&${componentCls}-item-recommend-badge-secondary`]: {
          color: token.colorInfo,
          background: token.colorInfoBg,
        },
      },

      // ======================== Disabled Reason ========================
      [`${componentCls}-item-disabled-reason`]: {
        marginTop: token.paddingXXS,
        fontSize: token.fontSizeSM,
        color: token.colorTextQuaternary,
      },

      // ======================== Nested ========================
      [`${componentCls}-nested`]: {
        marginLeft: token.controlHeightSM,
        marginTop: token.paddingXS,
        display: 'flex',
        flexDirection: 'column',
        gap: token.paddingXS,
      },

      // ======================== Footer ========================
      [`${componentCls}-footer`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: token.paddingSM,
        marginTop: token.paddingSM,
      },

      [`${componentCls}-footer-count`]: {
        color: token.colorTextTertiary,
        fontSize: token.fontSizeSM,
        marginInlineEnd: 'auto',
      },

      // ======================== Loading ========================
      [`${componentCls}-loading`]: {
        padding: token.padding,
      },

      // ======================== Card Layout Item ========================
      [`${componentCls}-layout-card`]: {
        [`${componentCls}-item`]: {
          flexDirection: 'column',
          alignItems: 'stretch',
          minHeight: 'auto',
          padding: token.paddingMD,

          [`${componentCls}-indicator`]: {
            position: 'absolute',
            top: token.paddingSM,
            insetInlineStart: token.paddingSM,
          },

          [`${componentCls}-item-content`]: {
            alignItems: 'center',
            textAlign: 'center',
            marginTop: token.paddingSM,
          },
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Choice'> = (token) => ({
  itemBg: token.colorBgContainer,
  itemHoverBg: token.colorFillTertiary,
  itemSelectedBg: token.colorPrimaryBg,
  itemSelectedBorderColor: token.colorPrimary,
  itemDisabledBg: token.colorBgContainerDisabled,
  itemBorderColor: token.colorBorderSecondary,
  itemBorderRadius: token.borderRadiusLG,
  itemGap: token.paddingXS,
  itemPadding: token.paddingSM,
});

export default genStyleHooks(
  'Choice',
  (token) => {
    const compToken = mergeToken<ChoiceToken>(token, {});
    return [
      genChoiceStyle(compToken),
      initFadeLeftMotion(compToken, true),
      initFadeMotion(compToken, true),
    ];
  },
  prepareComponentToken,
);
