import Bubble from './Bubble';
import List from './BubbleList';

type BubbleType = typeof Bubble & {
  List: typeof List;
};

(Bubble as BubbleType).List = List;

export default Bubble as BubbleType;
