import { mergeToken } from '@ant-design/cssinjs-utils';
import type { GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import genBubbleStyle, { BubbleToken } from './bubble';
import { genShapeStyle, genVariantStyle } from './content';
import { genDividerBubbleStyle } from './divider';
import genBubbleListStyle from './list';
import { genSlotStyle } from './slot';
import { genSystemBubbleStyle } from './system';
export const prepareComponentToken: GetDefaultToken<'Bubble'> = () => ({});

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export default genStyleHooks<'Bubble'>(
  'Bubble',
  (token) => {
    const bubbleToken = mergeToken<BubbleToken>(token, {});
    return [
      // 位置越靠后，样式优先级越高
      genBubbleStyle(bubbleToken),
      genVariantStyle(bubbleToken),
      genShapeStyle(bubbleToken),
      genSlotStyle(bubbleToken),
      genBubbleListStyle(bubbleToken),
      genSystemBubbleStyle(bubbleToken),
      genDividerBubbleStyle(bubbleToken),
    ];
  },
  prepareComponentToken,
);
