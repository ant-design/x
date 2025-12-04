import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { ActionsToken } from '.';

const genActionsFeedbackStyle: GenerateStyle<ActionsToken> = (token) => {
  const { componentCls } = token;
  const feedbackCls = `${componentCls}-feedback`;
  return {
    [feedbackCls]: {
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};
export default genActionsFeedbackStyle;
