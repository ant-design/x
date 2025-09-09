import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { SenderToken } from '.';

const genSenderSwitchStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, antCls } = token;
  const switchCls = `${componentCls}-switch`;

  return {
    [switchCls]: {
      display: 'inline-block',
      [`${antCls}-btn`]: {
        boxShadow: 'unset',
        background: 'transparent',
        borderColor: token.switchColorBorder,
      },
      [`${antCls}-btn:not(:disabled):not(${antCls}-btn-disabled):hover`]: {
        background: token.switchUncheckedHoverBg,
        color: token.colorText,
        borderColor: token.switchColorBorder,
      },
      '&-checked': {
        [`${antCls}-btn`]: {
          borderColor: token.switchColorPrimary,
          color: token.switchColorPrimary,
        },
        [`${antCls}-btn:not(:disabled):not(${antCls}-btn-disabled):hover`]: {
          background: token.switchCheckedHoverBg,
          color: token.switchColorPrimary,
          borderColor: token.switchColorPrimary,
        },
        [`${switchCls}-content`]: {
          background: token.switchCheckedBg,
        },
      },
      // ============================== RTL ==============================
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export default genSenderSwitchStyle;
