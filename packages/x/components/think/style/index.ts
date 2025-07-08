import { CSSObject } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { genCollapseMotion } from '../../style/motion';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

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

      '&-status-down-icon': {
        fontSize: fontSizeSM,
      },

      '&-content': {
        marginTop: marginSM,
        width: '100%',
        color: colorTextDescription,
        whiteSpace: 'pre-wrap',
        paddingInlineStart: paddingSM,
        borderInlineStart: `${calc(lineWidth).mul(2).equal()} solid ${colorBorder}`,
      },

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Think'> = () => ({});

export default genStyleHooks<'Think'>(
  'Think',
  (token) => {
    const ThinkToken = mergeToken<ThinkToken>(token, {});
    return [genThinkStyle(ThinkToken), genCollapseMotion(ThinkToken) as CSSObject];
  },
  prepareComponentToken,
);
