import { mergeToken } from '@ant-design/cssinjs-utils';
import { blinkMotion, genCollapseMotion } from '../../style';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
export interface ComponentToken {
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

export interface ThinkToken extends FullToken<'Think'> {}

const genThinkStyle: GenerateStyle<ThinkToken> = (token) => {
  const {
    componentCls,
    paddingXS,
    paddingSM,
    marginSM,
    colorTextSecondary,
    colorTextDescription,
    fontSize,
    fontSizeHeading5,
    fontSizeSM,
    lineHeight,
    colorBorder,
    lineWidth,
    calc,
  } = token;

  return {
    [componentCls]: {
      '&-status-wrapper': {
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'row',
        gridGap: paddingXS,
        alignItems: 'center',
        fontSize: fontSize,
        color: colorTextSecondary,
        lineHeight: lineHeight,
        cursor: 'pointer',
      },

      '&-status-icon': {
        fontSize: fontSizeHeading5,
        display: 'flex',
      },
      '&-status-text': {
        lineHeight: token.lineHeight,
        fontSize: token.fontSize,
      },

      '&-status-down-icon': {
        fontSize: fontSizeSM,
        svg: {
          transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        },
      },

      '&-content': {
        marginTop: marginSM,
        width: '100%',
        color: colorTextDescription,
        paddingInlineStart: paddingSM,
        borderInlineStart: `${calc(lineWidth).mul(2).equal()} solid ${colorBorder}`,
      },

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Think'> = (token) => {
  const { colorTextDescription, colorTextBase } = token;

  const colorTextBlinkDefault = colorTextDescription;
  const colorTextBlink = colorTextBase;
  return {
    colorTextBlinkDefault,
    colorTextBlink,
  };
};

export default genStyleHooks<'Think'>(
  'Think',
  (token) => {
    const ThinkToken = mergeToken<ThinkToken>(token, {});
    const { componentCls } = token;
    return [
      genThinkStyle(ThinkToken),
      genCollapseMotion(ThinkToken),
      blinkMotion(ThinkToken, `${componentCls}-motion-blink`),
    ];
  },
  prepareComponentToken,
);
