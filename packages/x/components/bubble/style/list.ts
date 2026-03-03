import type { GenerateStyle } from '../../theme/interface';
import type { BubbleToken } from './bubble';

const genBubbleListStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls } = token;
  return {
    [`${componentCls}-list`]: {
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
      [`${componentCls}-list-scroll-box`]: {
        overflowY: 'auto',
        display: 'flex',
        width: '100%',
        maxHeight: '100%',
        flexDirection: 'column',
        scrollbarWidth: 'thin',
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
      [`${componentCls}-list-scroll-content`]: {
        display: 'flex',
        width: '100%',
        height: 'fit-content',
        flexDirection: 'column',
        boxSizing: 'border-box',
        paddingInline: token.paddingXS,
      },
    },
  };
};

export default genBubbleListStyle;
