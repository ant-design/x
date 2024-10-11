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
  const { componentCls, padding, paddingSM, paddingXS, lineWidth, lineWidthBold, calc } = token;

  return {
    [componentCls]: {
      position: 'relative',
      display: 'flex',
      gap: paddingXS,
      width: '100%',

      paddingBlock: paddingSM,
      paddingInlineStart: padding,
      paddingInlineEnd: paddingSM,
      boxSizing: 'border-box',
      alignItems: 'flex-end',
      boxShadow: `${token.boxShadowTertiary}`,
      transition: `background ${token.motionDurationSlow}`,

      // Border
      borderRadius: calc(token.borderRadius).mul(2).equal(),
      borderColor: token.colorBorder,
      borderWidth: 0,
      borderStyle: 'solid',

      // Border
      '&:after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        transition: `border-color ${token.motionDurationSlow}`,

        borderRadius: 'inherit',
        borderStyle: 'inherit',
        borderColor: 'inherit',
        borderWidth: lineWidth,
      },

      // Focus
      '&:focus-within': {
        boxShadow: `${token.boxShadowSecondary}`,
        borderColor: token.colorPrimary,

        '&:after': {
          borderWidth: lineWidthBold,
        },
      },

      '&-disabled': {
        background: token.colorBgContainerDisabled,
      },

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

        '&-presets': {
          gap: token.paddingXS,
        },
      },

      [`& ${componentCls}-actions-btn`]: {
        '&-disabled': {
          pointerEvents: 'none',
          opacity: 0.45,
        },

        '&-loading-button': {
          padding: 0,
          border: 0,
        },

        '&-loading-icon': {
          height: token.controlHeight,
          width: token.controlHeight,
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
