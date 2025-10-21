import { Keyframes } from '@ant-design/cssinjs';
import { GenerateStyle } from '../../theme/cssinjs-utils';
import { ThoughtChainToken } from '.';

// =========================== Motion ===========================
const genMotionStyle: GenerateStyle<ThoughtChainToken> = (token) => {
  const { componentCls } = token;
  const uploadAnimateInlineIn = new Keyframes('uploadAnimateInlineIn', {
    from: {
      // backgroundPositionX: "100%",
      // backgroundPositionY: "100%",
    },
  });

  const uploadAnimateInlineOut = new Keyframes('uploadAnimateInlineOut', {
    to: {
      width: 0,
      height: 0,
      padding: 0,
      opacity: 0,
      margin: token.calc(token.marginXS).div(-2).equal(),
    },
  });

  return [
    {
      [`${componentCls}-motion`]: {
        backgroundPositionX: '9%',
        backgroundPositionY: '100%',
        backgroundClip: 'text',
        color: token.colorTextDescription,
        backgroundImage: `linear-gradient(90deg,transparent,#000,transparent)`,
        animationDuration: token.motionDurationSlow,
        animationTimingFunction: token.motionEaseInOutCirc,
        animationFillMode: 'forwards',
        backgroundSizeX: '50%',
        backgroundSizeY: '50%',
        backgroundRepeat: 'no-repeat',
        animationName: 'uploadAnimateInlineIn',
      },
    },
    uploadAnimateInlineIn,
    uploadAnimateInlineOut,
  ];
};

export default genMotionStyle;
