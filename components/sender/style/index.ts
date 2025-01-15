import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import genSenderHeaderStyle from './header';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface SenderToken extends FullToken<'Sender'> {
  SenderContentMaxWidth: number | string;
}

const genSenderStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, padding, paddingSM, paddingXS, lineWidth, lineWidthBold, calc } = token;

  return {
    [componentCls]: {
      position: 'relative',
      width: '100%',

      boxSizing: 'border-box',
      boxShadow: `${token.boxShadowTertiary}`,
      transition: `background ${token.motionDurationSlow}`,

      // Border
      borderRadius: {
        _skip_check_: true,
        value: calc(token.borderRadius).mul(2).equal(),
      },
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

        borderRadius: {
          _skip_check_: true,
          value: 'inherit',
        },
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

      // ============================ Content ============================
      [`${componentCls}-content`]: {
        display: 'flex',
        gap: paddingXS,
        width: '100%',

        paddingBlock: paddingSM,
        paddingInlineStart: padding,
        paddingInlineEnd: paddingSM,
        boxSizing: 'border-box',
        alignItems: 'flex-end',
      },

      // ============================ Prefix =============================
      [`${componentCls}-prefix`]: {
        flex: 'none',
      },

      // ============================= Input =============================
      [`${componentCls}-input`]: {
        padding: 0,
        borderRadius: 0,
        flex: 'auto',
        alignSelf: 'center',
        minHeight: 'auto',
      },

      // ============================ Actions ============================
      [`${componentCls}-actions-list`]: {
        flex: 'none',
        display: 'flex',

        '&-presets': {
          gap: token.paddingXS,
        },
      },

      [`${componentCls}-actions-btn`]: {
        '&-disabled': {
          opacity: 0.45,
        },

        '&-loading-button': {
          padding: 0,
          border: 0,
        },

        '&-loading-icon': {
          height: token.controlHeight,
          width: token.controlHeight,
          verticalAlign: 'top',
        },
        '&-recording-icon': {
          height: '1.2em',
          width: '1.2em',
          verticalAlign: 'top',
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
    return [genSenderStyle(SenderToken), genSenderHeaderStyle(SenderToken)];
  },
  prepareComponentToken,
);
