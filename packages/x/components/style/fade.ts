import { CSSInterpolation, Keyframes } from '@ant-design/cssinjs';
import { TokenWithCommonCls } from '@ant-design/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import { AliasToken } from '../theme/cssinjs-utils';
import { initMotion } from './motion';

export const fadeLeft = new Keyframes('antXFadeLeft', {
  '0%': {
    maskPosition: '100% 0',
  },
  '100%': {
    maskPosition: '0% 0%',
  },
});

export const fadeOut = new Keyframes('antFadeOut', {
  '0%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0,
  },
});

export const initFadeLeftMotion = (
  token: TokenWithCommonCls<AliasToken>,
  sameLevel = false,
): CSSInterpolation => {
  const { antCls } = token;
  const motionCls = `${antCls}-x-fade-left`;
  const sameLevelPrefix = sameLevel ? '&' : '';

  return [
    initMotion(motionCls, fadeLeft, fadeOut, '1s', sameLevel),
    {
      [`
        ${sameLevelPrefix}${motionCls}-enter,
        ${sameLevelPrefix}${motionCls}-appear
      `]: {
        transitionProperty: 'mask-position',
        animationTimingFunction: 'linear',
        maskImage: `linear-gradient(90deg, ${token.colorTextBase} 33%, ${new FastColor(token.colorTextBase).setA(0)} 66%)`,
        maskSize: '300% 100%',
        maskPosition: '100% 0%',
      },

      [`${sameLevelPrefix}${motionCls}-leave`]: {
        animationTimingFunction: 'linear',
      },
    },
  ];
};
