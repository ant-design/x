import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { ActionsToken } from '.';

const genActionsAudioStyle: GenerateStyle<ActionsToken> = (token) => {
  const { componentCls } = token;
  const audioCls = `${componentCls}-audio`;

  return {
    [audioCls]: {
      [`&${audioCls}-rtl`]: {
        direction: 'rtl',
      },
      [`${audioCls}-recording-icon`]: {
        width: token.fontSize,
        height: token.fontSize,
      },
    },
  };
};
export default genActionsAudioStyle;
