import { unit } from '@ant-design/cssinjs';
import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { BubbleToken } from './bubble';

export const genSystemBubbleStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls, paddingSM, paddingXS, lineHeight, fontSize, fontSizeSM, calc } = token;
  return {
    [componentCls]: {
      '&-system': {
        width: '100%',
        justifyContent: 'center',

        [`& ${componentCls}-content`]: {
          display: 'flex',
          gap: `${unit(fontSizeSM)}`,
          alignItems: 'center',
          minHeight: calc(paddingXS).mul(2).add(calc(lineHeight).mul(fontSize)).equal(),
          fontSize: `${unit(fontSize)}`,
          paddingInline: `${unit(paddingSM)}`,
          paddingBlock: `${unit(paddingXS)}`,
        },

        [`& ${componentCls}-system-content`]: {},

        [`& ${componentCls}-system-extra`]: {},
      },
    },
  };
};
