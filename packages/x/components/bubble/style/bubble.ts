import { Keyframes, unit } from '@ant-design/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/cssinjs-utils';

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

const fadeIn = new Keyframes('fadeIn', {
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

export interface BubbleToken extends FullToken<'Bubble'> {}

const genBubbleStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls, fontSize, lineHeight, paddingSM, colorText, calc } = token;
  return {
    [componentCls]: {
      display: 'flex',
      columnGap: paddingSM,

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
      [`&${componentCls}-loading`]: {
        minHeight: token.controlHeight,
        alignItems: 'center',
      },

      [`& ${componentCls}-body`]: {
        display: 'flex',
        flexDirection: 'column',
      },

      // =========================== Content =============================
      [`& ${componentCls}-content`]: {
        position: 'relative',
        boxSizing: 'border-box',
        minWidth: 0,
        maxWidth: '100%',
        minHeight: calc(paddingSM).mul(2).add(calc(lineHeight).mul(fontSize)).equal(),
        padding: `${unit(paddingSM)} ${unit(token.padding)}`,

        color: colorText,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        wordBreak: 'break-word',
        '&-string': {
          whiteSpace: 'pre-wrap',
        },
      },
      '&-typing:last-child::after': {
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

      '&-fade-in .fade-in': {
        display: 'inline',
        animationName: fadeIn,
        animationDuration: '1s',
        animationTimingFunction: 'linear',
      },

      [`& ${componentCls}-dot`]: {
        position: 'relative',
        height: token.controlHeight,
        display: 'flex',
        alignItems: 'center',
        columnGap: token.marginXS,
        padding: `0 ${unit(token.paddingXXS)}`,
        alignSelf: 'center',
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

      // ======================== placement ============================
      '&-start': {
        flexDirection: 'row',

        [`& ${componentCls}-header`]: {
          flexDirection: 'row',
        },
      },

      '&-end': {
        flexDirection: 'row-reverse',
        justifySelf: 'flex-end',

        [`& ${componentCls}-header`]: {
          flexDirection: 'row-reverse',
        },

        [`& ${componentCls}-editing-opts`]: {
          flexDirection: 'row-reverse',
        },
      },
    },
  };
};

export default genBubbleStyle;
