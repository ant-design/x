import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

interface SenderToken extends FullToken<'Sender'> {
  SenderContentMaxWidth: number | string;
}

const genSenderStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, padding, paddingSM, paddingXS, paddingXXS, boxShadowSecondary, calc } =
    token;

  const senderPaddingBlock = calc(paddingSM).sub(token.lineWidth).equal();

  return {
    [componentCls]: {
      position: 'relative',
      display: 'flex',
      gap: paddingXS,
      width: '100%',
      borderWidth: token.lineWidth,
      borderStyle: 'solid',
      borderColor: token.colorBorder,
      borderRadius: calc(token.borderRadius).mul(2).equal(),
      paddingBlock: senderPaddingBlock,
      paddingInlineStart: padding,
      paddingInlineEnd: paddingSM,
      boxSizing: 'border-box',
      alignItems: 'flex-end',
      boxShadow: `${token.boxShadowTertiary}`,
      transition: `all ${token.motionDurationSlow}`,

      '&:focus-within': {
        boxShadow: `${token.boxShadowSecondary}`,
        borderColor: token.colorPrimary,
      },

      '&-disabled': {},

      // ============================== RTL ==============================
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      // ============================= Input =============================
      [`& ${componentCls}-input`]: {
        padding: 0,
        borderRadius: 0,
        flex: 'auto',
        alignSelf: 'center',
        minHeight: 'auto',
      },

      // ============================ Actions ============================
      [`& ${componentCls}-actions-list`]: {
        flex: 'none',
      },

      [`& ${componentCls}-actions-btn`]: {
        '&-disabled': {
          pointerEvents: 'none',
          opacity: 0.45,
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Sender'> = () => ({});

export default genStyleHooks<'Sender'>(
  'Sender',
  (token) => {
    const { paddingXS, calc } = token;
    const SenderToken = mergeToken<SenderToken>(token, {
      SenderContentMaxWidth: `calc(100% - ${unit(calc(paddingXS).add(32).equal())})`,
    });
    return genSenderStyle(SenderToken);
  },
  prepareComponentToken,
);
