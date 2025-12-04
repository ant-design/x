import { CSSInterpolation, Keyframes } from '@ant-design/cssinjs';
import { TokenWithCommonCls } from '@ant-design/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import { AliasToken } from '../../theme/cssinjs-utils';
import { initMotion } from './init';

export const fadeInLeft = new Keyframes('antXFadeInLeft', {
  '0%': {
    maskPosition: '100% 0',
  },
  '100%': {
    maskPosition: '0% 0%',
  },
});

export const fadeIn = new Keyframes('antXFadeIn', {
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
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
    initMotion(motionCls, fadeInLeft, fadeOut, '1s', sameLevel),
    {
      [token.componentCls]: {
        [`${sameLevelPrefix}${motionCls}-enter,${sameLevelPrefix}${motionCls}-appear`]: {
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
    },
  ];
};

export const initFadeMotion = (
  token: TokenWithCommonCls<AliasToken>,
  sameLevel = false,
): CSSInterpolation => {
  const { antCls } = token;
  const motionCls = `${antCls}-x-fade`;
  const sameLevelPrefix = sameLevel ? '&' : '';
  return [
    initMotion(motionCls, fadeIn, fadeOut, '1.2s', sameLevel),
    {
      [token.componentCls]: {
        [`${sameLevelPrefix}${motionCls}-enter,${sameLevelPrefix}${motionCls}-appear`]: {
          opacity: 0,
        },
        [`${sameLevelPrefix}${motionCls}-leave`]: {
          animationTimingFunction: 'linear',
        },
      },
    },
  ];
};
