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
   * @desc 选项激活背景色
   * @descEN Item active background color
   */
  itemActiveBg?: string;
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
   * @desc 推荐选项边框色
   * @descEN Recommended item border color
   */
  itemRecommendedBorderColor?: string;
  /**
   * @desc 禁用选项边框色
   * @descEN Disabled item border color
   */
  itemDisabledBorderColor?: string;
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
  /**
   * @desc 标题字号
   * @descEN Title font size
   */
  titleFontSize?: number;
  /**
   * @desc 标题行高
   * @descEN Title line height
   */
  titleLineHeight?: number;
  /**
   * @desc 标签字号
   * @descEN Label font size
   */
  labelFontSize?: number;
  /**
   * @desc 标签行高
   * @descEN Label line height
   */
  labelLineHeight?: number;
  /**
   * @desc 描述字号
   * @descEN Description font size
   */
  descFontSize?: number;
  /**
   * @desc 描述行高
   * @descEN Description line height
   */
  descLineHeight?: number;
  /**
   * @desc 头部内边距
   * @descEN Header padding
   */
  headerPadding?: number;
  /**
   * @desc 列表内边距
   * @descEN List padding
   */
  listPadding?: number;
  /**
   * @desc 底部内边距
   * @descEN Footer padding
   */
  footerPadding?: number;
  /**
   * @desc 整体圆角
   * @descEN Container border radius
   */
  borderRadius?: number;
  /**
   * @desc 网格布局列数
   * @descEN Grid columns
   */
  gridColumns?: number;
  /**
   * @desc 动画时长
   * @descEN Motion duration
   */
  motionDuration?: string;
}

export interface ChoiceToken extends FullToken<'Choice'> {
  itemBg: string;
  itemHoverBg: string;
  itemActiveBg: string;
  itemSelectedBg: string;
  itemSelectedBorderColor: string;
  itemRecommendedBorderColor: string;
  itemDisabledBorderColor: string;
  itemDisabledBg: string;
  itemBorderColor: string;
  itemBorderRadius: number;
  itemGap: number;
  itemPadding: number;
  titleFontSize: number;
  titleLineHeight: number;
  labelFontSize: number;
  labelLineHeight: number;
  descFontSize: number;
  descLineHeight: number;
  headerPadding: number;
  listPadding: number;
  footerPadding: number;
  borderRadius: number;
  gridColumns: number;
  motionDuration: string;
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
        padding: unit(token.headerPadding),
      },

      [`${componentCls}-title`]: {
        marginBlockStart: 0,
        marginBlockEnd: token.paddingXXS,
        fontWeight: 'normal',
        color: token.colorTextHeading,
        fontSize: unit(token.titleFontSize),
        lineHeight: unit(token.titleLineHeight),
      },

      [`${componentCls}-description`]: {
        color: token.colorTextTertiary,
        fontSize: unit(token.descFontSize),
        lineHeight: unit(token.descLineHeight),
      },

      // ======================== List ========================
      [`${componentCls}-list`]: {
        display: 'flex',
        flexDirection: 'column',
        gap: unit(token.itemGap),
        listStyle: 'none',
        padding: unit(token.listPadding),
        margin: 0,
      },

      // ======================== Layouts ========================
      // Grid layout
      [`${componentCls}-layout-grid`]: {
        display: 'grid',
        gridTemplateColumns: `repeat(${token.gridColumns}, 1fr)`,
        gap: unit(token.itemGap),
      },

      // Card layout
      [`${componentCls}-layout-card`]: {
        display: 'grid',
        gridTemplateColumns: `repeat(${token.gridColumns}, 1fr)`,
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
        transition: `all ${token.motionDuration} ${token.motionEaseInOut}`,
        minHeight: token.controlHeight,

        '&:hover': {
          background: token.itemHoverBg,
        },

        '&:active': {
          background: token.itemActiveBg,
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
          borderColor: token.itemDisabledBorderColor,
          opacity: 0.6,
          pointerEvents: 'none',
        },

        // Recommended - primary
        [`&${componentCls}-item-recommended-primary`]: {
          borderColor: token.itemRecommendedBorderColor,
          [`&${componentCls}-item-selected`]: {
            borderColor: token.itemSelectedBorderColor,
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
        fontSize: unit(token.labelFontSize),
        lineHeight: unit(token.labelLineHeight),
      },

      [`${componentCls}-item-desc`]: {
        color: token.colorTextTertiary,
        fontSize: unit(token.descFontSize),
        lineHeight: unit(token.descLineHeight),
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
        padding: unit(token.footerPadding),
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
  itemActiveBg: token.colorFill,
  itemSelectedBg: token.colorPrimaryBg,
  itemSelectedBorderColor: token.colorPrimary,
  itemRecommendedBorderColor: token.colorPrimary,
  itemDisabledBorderColor: token.colorBorderSecondary,
  itemDisabledBg: token.colorBgContainerDisabled,
  itemBorderColor: token.colorBorderSecondary,
  itemBorderRadius: token.borderRadiusLG,
  itemGap: token.paddingXS,
  itemPadding: token.paddingSM,
  titleFontSize: token.fontSizeLG,
  titleLineHeight: token.lineHeightLG,
  labelFontSize: token.fontSize,
  labelLineHeight: token.lineHeight,
  descFontSize: token.fontSizeSM,
  descLineHeight: token.lineHeight,
  headerPadding: 0,
  listPadding: 0,
  footerPadding: 0,
  borderRadius: token.borderRadius,
  gridColumns: 2,
  motionDuration: token.motionDurationMid,
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
