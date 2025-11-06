import { TokenWithCommonCls } from '@ant-design/cssinjs-utils';
import { AliasToken, GenerateStyle } from '../../theme/cssinjs-utils';

export const genCollapseMotion: GenerateStyle<TokenWithCommonCls<AliasToken>> = (token) => ({
  [token.componentCls]: {
    [`${token.antCls}-motion-collapse-legacy`]: {
      overflow: 'hidden',
      '&-active': {
        transition: `height ${token.motionDurationMid} ${token.motionEaseInOut},
        opacity ${token.motionDurationMid} ${token.motionEaseInOut} !important`,
      },
    },

    [`${token.antCls}-motion-collapse`]: {
      overflow: 'hidden',
      transition: `height ${token.motionDurationMid} ${token.motionEaseInOut},
        opacity ${token.motionDurationMid} ${token.motionEaseInOut} !important`,
    },
  },
});
