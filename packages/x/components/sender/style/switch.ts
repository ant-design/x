import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { SenderToken } from '.';

const genSenderSwitchStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, antCls } = token;

  const switchCls = `${componentCls}-switch`;

  return {
    [switchCls]: {
      display: 'inline-block',
      [`${antCls}-btn:not(:disabled):not(${antCls}-btn-disabled):hover`]: {
        background: token.switchUncheckedHoverBg,
        borderColor: token.colorBorder,
        color: token.colorText,
      },

      '&-checked': {
        [`${antCls}-btn:not(:disabled):not(${antCls}-btn-disabled):hover`]: {
          background: token.switchCheckedHoverBg,
          borderColor: token.colorPrimary,
          color: token.colorPrimaryText,
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
