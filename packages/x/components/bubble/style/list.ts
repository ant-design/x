import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { BubbleToken } from './bubble';

const genBubbleListStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls, padding } = token;
  return {
    [`${componentCls}-list`]: {
      display: 'flex',
      flexDirection: 'column',
      gap: padding,
      overflowY: 'auto',
      width: '100%',
      alignItems: 'center',
      // For Firefox
      scrollbarWidth: 'thin',
      paddingInline: token.paddingXS,
      boxSizing: 'border-box',
      scrollbarColor: `${token.colorTextTertiary} transparent`,

      '&::-webkit-scrollbar': {
        width: 8,
        backgroundColor: 'transparent',
      },

      '&::-webkit-scrollbar-thumb': {
        backgroundColor: token.colorTextTertiary,
        borderRadius: token.borderRadiusSM,
      },
      [`& ${componentCls}`]: {
        width: '100%',
        boxSizing: 'border-box',
      },
      [`& ${componentCls}-start`]: {
        paddingInlineEnd: '15%',
      },

      [`& ${componentCls}-end`]: {
        paddingInlineStart: '15%',
      },
    },

    [`${componentCls}-list-autoscroll`]: {
      flexDirection: 'column-reverse',
    },
  };
};

export default genBubbleListStyle;
