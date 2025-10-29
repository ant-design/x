import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { BubbleToken } from './bubble';

const genBubbleListStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls, padding } = token;
  return {
    [`${componentCls}-list`]: {
      gap: padding,
      maxHeight: '100%',
      width: '100%',
      boxSizing: 'border-box',

      [`& ${componentCls}`]: {
        width: '100%',
        boxSizing: 'border-box',
        paddingBlock: token.padding,
      },

      [`& ${componentCls}-start:not(${componentCls}-divider):not(${componentCls}-system)`]: {
        paddingInlineEnd: '15%',
      },

      [`& ${componentCls}-end:not(${componentCls}-divider):not(${componentCls}-system)`]: {
        paddingInlineStart: '15%',
      },
    },
    [`${componentCls}-list-scroll-box`]: {
      overflowY: 'auto',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      scrollbarWidth: 'thin',
      maxHeight: '100%',
      flexDirection: 'column',
      boxSizing: 'border-box',
      paddingInline: token.paddingXS,
      scrollbarColor: `${token.colorTextTertiary} transparent`,
      '&::-webkit-scrollbar': {
        width: 8,
        backgroundColor: 'transparent',
      },

      '&::-webkit-scrollbar-thumb': {
        backgroundColor: token.colorTextTertiary,
        borderRadius: token.borderRadiusSM,
      },
    },
    [`${componentCls}-list-autoscroll`]: {
      flexDirection: 'column-reverse',
    },
  };
};

export default genBubbleListStyle;
