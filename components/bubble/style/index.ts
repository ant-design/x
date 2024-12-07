import { Keyframes, unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { genShapeStyle, genVariantStyle } from './content';
import genBubbleListStyle from './list';

const loadingMove = new Keyframes('loadingMove', {
  '0%': {
    transform: 'translateY(0)',
  },
  '10%': {
    transform: 'translateY(4px)',
  },
  '20%': {
    transform: 'translateY(0)',
  },
  '30%': {
    transform: 'translateY(-4px)',
  },
  '40%': {
    transform: 'translateY(0)',
  },
});

const cursorBlink = new Keyframes('cursorBlink', {
  '0%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface BubbleToken extends FullToken<'Bubble'> {}

const genBubbleStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls, fontSize, lineHeight, paddingSM, colorText, calc } = token;
  return {
    [componentCls]: {
      display: 'flex',
      columnGap: paddingSM,
      maxWidth: '100%',
      [`&${componentCls}-end`]: {
        justifyContent: 'end',
        flexDirection: 'row-reverse',
        [`& ${componentCls}-content-wrapper`]: {
          alignItems: 'flex-end',
        },
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
      [`&${componentCls}-typing ${componentCls}-content:last-child::after`]: {
        content: '"|"',
        fontWeight: 900,
        userSelect: 'none',
        opacity: 1,
        marginInlineStart: '0.1em',
        animationName: cursorBlink,
        animationDuration: '0.8s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
      },

      // ============================ Avatar =============================
      [`& ${componentCls}-avatar`]: {
        display: 'inline-flex',
        justifyContent: 'center',
        alignSelf: 'flex-start',
      },

      // ======================== Header & Footer ========================
      [`& ${componentCls}-header, & ${componentCls}-footer`]: {
        fontSize: fontSize,
        lineHeight: lineHeight,
        color: token.colorText,
      },

      [`& ${componentCls}-header`]: {
        marginBottom: token.paddingXXS,
      },

      [`& ${componentCls}-footer`]: {
        marginTop: paddingSM,
      },

      // =========================== Content =============================
      [`& ${componentCls}-content-wrapper`]: {
        flex: 'auto', //
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', //
        minWidth: 0,
        maxWidth: '100%',
      },

      [`& ${componentCls}-content`]: {
        position: 'relative',
        boxSizing: 'border-box',
        minWidth: 0,
        maxWidth: '100%',

        color: colorText,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        minHeight: calc(paddingSM).mul(2).add(calc(lineHeight).mul(fontSize)).equal(),

        wordBreak: 'break-word',

        [`& ${componentCls}-dot`]: {
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          columnGap: token.marginXS,
          padding: `0 ${unit(token.paddingXXS)}`,
          '&-item': {
            backgroundColor: token.colorPrimary,
            borderRadius: '100%',
            width: 4,
            height: 4,
            animationName: loadingMove,
            animationDuration: '2s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            '&:nth-child(1)': {
              animationDelay: '0s',
            },
            '&:nth-child(2)': {
              animationDelay: '0.2s',
            },
            '&:nth-child(3)': {
              animationDelay: '0.4s',
            },
          },
        },
      },
      // =========================== Editor =============================
      [`& ${componentCls}-editor`]: {
        minWidth: '30%',
        maxWidth: '100%',
        border: `1px solid ${token.colorPrimary}`,
        padding: token.paddingSM,
        borderRadius: token.borderRadius,
        boxShadow: token.boxShadow,
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Bubble'> = () => ({});

export default genStyleHooks<'Bubble'>(
  'Bubble',
  (token) => {
    const bubbleToken = mergeToken<BubbleToken>(token, {});
    return [
      genBubbleStyle(bubbleToken),
      genBubbleListStyle(bubbleToken),
      genVariantStyle(bubbleToken),
      genShapeStyle(bubbleToken),
    ];
  },
  prepareComponentToken,
);
