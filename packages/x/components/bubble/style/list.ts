import type { BubbleToken } from '.';
import type { GenerateStyle } from '../../theme/cssinjs-utils';

const genBubbleListStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls, padding } = token;
  return {
    [`${componentCls}-list`]: {
      display: 'flex',
      flexDirection: 'column',
      gap: padding,
      overflowY: 'auto',

      '&::-webkit-scrollbar': {
        width: 8,
        backgroundColor: 'transparent',
      },

      '&::-webkit-scrollbar-thumb': {
        backgroundColor: token.colorTextTertiary,
        borderRadius: token.borderRadiusSM,
      },

      // For Firefox
      '&': {
        scrollbarWidth: 'thin',
        scrollbarColor: `${token.colorTextTertiary} transparent`,
      },
    },
  };
};

export default genBubbleListStyle;
