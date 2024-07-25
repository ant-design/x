import { Keyframes, unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';

import { genStyleHooks } from '../../theme/genStyleUtils';
import type {
  FullToken,
  GenerateStyle,
  GetDefaultToken,
} from '../../theme/cssinjs-utils';

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

export interface ComponentToken {
  //
}

interface ChatboxToken extends FullToken<'Chatbox'> {
  chatboxContentMaxWidth: number | string;
}

const genChatboxStyle: GenerateStyle<ChatboxToken> = (token) => {
  const {
    componentCls,
    fontSize,
    lineHeight,
    paddingSM,
    padding,
    paddingXS,
    colorText,
    calc,
  } = token;
  return {
    [componentCls]: {
      display: 'flex',
      columnGap: paddingXS,
      maxWidth: '100%',
      [`&${componentCls}-end`]: {
        justifyContent: 'end',
        flexDirection: 'row-reverse',
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
      [`& ${componentCls}-avatar`]: {
        display: 'inline-flex',
        justifyContent: 'center',
      },
      [`& ${componentCls}-content`]: {
        position: 'relative',
        boxSizing: 'border-box',
        padding: `${unit(paddingSM)} ${unit(padding)}`,
        color: colorText,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        minHeight: calc(paddingSM)
          .mul(2)
          .add(calc(lineHeight).mul(fontSize))
          .equal(),
        maxWidth: token.chatboxContentMaxWidth,
        backgroundColor: token.colorInfoBg,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
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
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Chatbox'> = () => ({});

export default genStyleHooks<'Chatbox'>(
  'Chatbox',
  (token) => {
    const { paddingXS, calc } = token;
    const chatBoxToken = mergeToken<ChatboxToken>(token, {
      chatboxContentMaxWidth: `calc(100% - ${unit(calc(paddingXS).add(32).equal())})`,
    });
    return genChatboxStyle(chatBoxToken);
  },
  prepareComponentToken,
);
