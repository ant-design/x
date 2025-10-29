import { Keyframes } from '@ant-design/cssinjs';
import { GenerateStyle } from '../../theme/cssinjs-utils';
import { ThoughtChainToken } from '.';

// =========================== Motion ===========================
const genMotionStyle: GenerateStyle<ThoughtChainToken> = (token) => {
  const { componentCls } = token;
  const uploadAnimateInlineIn = new Keyframes('uploadAnimateInlineIn', {
    '0%': {
      backgroundPositionX: '-200%',
      backgroundPositionY: '100%',
    },
    '25%': {
      backgroundPositionX: '-100%',
      backgroundPositionY: '100%',
    },
    '50%': {
      backgroundPositionX: '-0%',
      backgroundPositionY: '100%',
    },
    '75%': {
      backgroundPositionX: '100%',
      backgroundPositionY: '100%',
    },
    '100%': {
      backgroundPositionX: '200%',
      backgroundPositionY: '100%',
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
      [`${componentCls}-motion-blink`]: {
        backgroundPositionX: '9%',
        backgroundPositionY: '100%',
        backgroundClip: 'text',
        color: token.colorTextDescription,
        backgroundImage: `linear-gradient(90deg,transparent,${token.colorTextBase},transparent)`,
        animationDuration: '1s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
        animationFillMode: 'forwards',
        backgroundSize: '50%',
        backgroundRepeat: 'no-repeat',
        animationName: 'uploadAnimateInlineIn',
      },
    },
    uploadAnimateInlineIn,
    uploadAnimateInlineOut,
  ];
};

export default genMotionStyle;
