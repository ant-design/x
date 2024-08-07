import Bubble from './Bubble';
import List from './BubbleList';

export type { BubbleProps } from './interface';

type BubbleType = typeof Bubble & {
  List: typeof List;
};

(Bubble as BubbleType).List = List;

export default Bubble as BubbleType;
