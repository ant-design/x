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
      // For Firefox
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

      [`& ${componentCls}-start`]: {
        marginInlineEnd: '15%',
      },

      [`& ${componentCls}-end`]: {
        marginInlineStart: '15%',
      },
    },

    [`${componentCls}-list-autoscroll`]: {
      flexDirection: 'column-reverse',
    },
  };
};

export default genBubbleListStyle;
