import type { GenerateStyle } from '../../theme/interface';
import type { ActionsToken } from '.';

const genActionsFeedbackStyle: GenerateStyle<ActionsToken> = (token) => {
  const { componentCls } = token;
  const feedbackCls = `${componentCls}-feedback`;
  return {
    [componentCls]: {
      [`&${feedbackCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};
export default genActionsFeedbackStyle;
