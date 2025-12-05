import type { CSSObject } from '@ant-design/cssinjs';
import { unit } from '@ant-design/cssinjs/lib/util';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import { blinkMotion, genCollapseMotion } from '../../style';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import genThoughtChainItemStyle from './item';

export interface ComponentToken {
  /**
   * @desc 实心的 ThoughtChain.Item 背景色
   * @descEN ThoughtChain.Item `solid`'s background color
   */
  itemSolidBg: string;
  /**
   * @desc 实心的 ThoughtChain.Item 悬浮态背景色
   * @descEN ThoughtChain.Item `solid`'s hover background color
   */
  itemSolidHoverBg: string;
  /**
   * @desc 边框模式的 ThoughtChain.Item 背景色
   * @descEN ThoughtChain.Item `outlined`'s background color
   */
  itemOutlinedBg: string;
  /**
   * @desc 边框模式的 ThoughtChain.Item 悬浮态背景色
   * @descEN ThoughtChain.Item `outlined`'s hover background color
   */
  itemOutlinedHoverBg: string;
  /**
   * @desc ThoughtChain.Item 圆角
   * @descEN ThoughtChain.Item's border radius
   */
  itemBorderRadius: number;
  /**
   * @desc 图标容器尺寸
   * @descEN ThoughtChain.Item `outlined`'s hover background color
   */
  iconSize: number;
  /**
   * @desc 思维链节点描述文字的动画颜色
   * @descEN ThoughtChain node description text animation color
   */
  itemMotionDescription: string;
  /**
   * @desc 默认打字动画颜色
   * @descEN Default typing animation color
   */
  colorTextBlinkDefault: string;
  /**
   * @desc 打字动画颜色
   * @descEN Typing animation color
   */
  colorTextBlink: string;
}

export interface ThoughtChainToken extends FullToken<'ThoughtChain'> {}

const genThoughtChainStyle: GenerateStyle<ThoughtChainToken, CSSObject> = (token): CSSObject => {
  const { componentCls, calc } = token;
  return {
    [componentCls]: {
      [`&${componentCls}-box`]: {
        display: 'flex',
        flexDirection: 'column',
        [`& ${componentCls}-node:last-of-type`]: {
          [`> ${componentCls}-node-icon`]: {
            '&:after': {
              display: 'none',
            },
          },
        },
      },
      [`& ${componentCls}-node`]: {
        position: 'relative',
        display: 'flex',
        alignItems: 'baseline',
        gap: token.marginSM,
        [`${componentCls}-status-error`]: {
          color: token.colorError,
        },
        [`${componentCls}-status-success`]: {
          color: token.colorSuccess,
        },
        [`${componentCls}-status-loading`]: {
          color: token.colorPrimary,
        },
      },
      [`& ${componentCls}-node-header`]: {
        display: 'flex',
        flexDirection: 'column',
      },
      [`& ${componentCls}-node-title`]: {
        fontWeight: 500,
        display: 'flex',
        gap: token.marginXS,
      },
      [`& ${componentCls}-node-collapsible`]: {
        paddingInlineEnd: token.padding,
        cursor: 'pointer',
      },
      [`& ${componentCls}-node-footer`]: {
        marginBottom: token.margin,
      },
      [`& ${componentCls}-node-content`]: {
        marginBottom: token.margin,
      },
      [`& ${componentCls}-node-collapse-icon`]: {
        '& svg': {
          transition: `transform ${token.motionDurationMid} ${token.motionEaseInOut}`,
        },
      },

      [`& ${componentCls}-node-description`]: {
        color: token.colorTextDescription,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        marginBlockEnd: token.margin,
      },
      [`& ${componentCls}-node-icon`]: {
        lineHeight: 1,
        fontSize: token.iconSize,
        '&:after': {
          content: '""',
          position: 'absolute',
          height: unit(calc('100%').sub(calc(token.iconSize).mul(token.lineHeight)).equal()),
          borderInlineStart: `${unit(token.lineWidth)} solid ${token.colorFillContent}`,
          insetInlineStart: unit(calc(token.iconSize).sub(1).div(2).equal()),
          top: unit(calc(token.iconSize).mul(token.lineHeight).equal()),
        },
      },
      [`& ${componentCls}-node-icon-dashed`]: {
        '&:after': {
          borderInlineStart: `${unit(token.lineWidth)} dashed ${token.colorFillContent}`,
        },
      },
      [`& ${componentCls}-node-icon-dotted‌`]: {
        '&:after': {
          borderInlineStart: `${unit(token.lineWidth)} dotted‌ ${token.colorFillContent}`,
        },
      },
      [`& ${componentCls}-node-index-icon`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        color: token.colorTextSecondary,
        fontSize: token.fontSizeSM,
        width: token.iconSize,
        height: token.iconSize,
        backgroundColor: token.colorFillContent,
        borderRadius: unit(calc(token.iconSize).div(2).equal()),
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
        [`& ${componentCls}-node-icon`]: {
          '&:after': {
            insetInlineStart: 'unset',
            insetInlineEnd: unit(calc(token.iconSize).sub(1).div(2).equal()),
          },
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'ThoughtChain'> = (token) => {
  const itemMotionDescription = new FastColor(token.colorTextDescription).setA(0.25).toHexString();
  const colorTextBlinkDefault = token.colorTextDescription;
  const colorTextBlink = token.colorTextBase;
  return {
    itemMotionDescription,
    colorTextBlinkDefault,
    colorTextBlink,
    itemSolidBg: token.colorFillTertiary,
    itemSolidHoverBg: token.colorBgTextHover,
    itemOutlinedBg: token.colorBgContainer,
    itemOutlinedHoverBg: token.colorBgTextHover,
    itemBorderRadius: token.borderRadius,
    iconSize: token.fontSize,
    titleFontSize: token.fontSize,
    descriptionFontSize: token.fontSize,
    nodePadding: token.paddingSM,
    titleFontWeight: 500,
    borderColor: token.colorBorder,
    borderWidth: token.lineWidth,
    connectorColor: token.colorFillContent,
    connectorWidth: token.lineWidth,
    hoverTransitionDuration: `${token.motionDurationMid} ${token.motionEaseInOut}`,
  };
};

export default genStyleHooks<'ThoughtChain'>(
  'ThoughtChain',
  (token) => {
    const compToken = mergeToken<ThoughtChainToken>(token, {});
    const { componentCls } = token;
    return [
      genThoughtChainStyle(compToken),
      genThoughtChainItemStyle(compToken),
      genCollapseMotion(compToken),
      blinkMotion(compToken, `${componentCls}-motion-blink`),
    ];
  },
  prepareComponentToken,
);
