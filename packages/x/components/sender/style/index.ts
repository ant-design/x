import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import genSenderHeaderStyle from './header';
import genSlotTextAreaStyle from './slot-textarea';
import genSenderSwitchStyle from './switch';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {
  /**
   * @desc 词槽背景颜色
   * @descEN Slot background color
   */
  colorBgSlot: string;
  /**
   * @desc 词槽文本颜色
   * @descEN Slot text color
   */
  colorTextSlot: string;
  /**
   * @desc 词槽文本占位符颜色
   * @descEN Slot text placeholder color
   */
  colorTextSlotPlaceholder: string;
  /**
   * @desc 词槽边框颜色
   * @descEN Slot border color
   */
  colorBorderSlot: string;
  /**
   * @desc 词槽边框悬浮态颜色
   * @descEN Slot border hover color
   */
  colorBorderSlotHover: string;
  /**
   * @desc 开关选中背景颜色
   * @descEN Switch checked background colo
   */
  switchCheckedBg: string;
  /**
   * @desc 开关选中悬浮态背景颜色
   * @descEN Switch checked hover background color
   */
  switchCheckedHoverBg: string;

  /**
   * @desc 开关未选中悬浮态背景颜色
   * @descEN Switch unchecked hover background color
   */
  switchUncheckedHoverBg: string;
}

export interface SenderToken extends FullToken<'Sender'> {
  SenderContentMaxWidth: number | string;
}
const genSenderStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, paddingSM, paddingXS, paddingXXS, lineWidth, lineWidthBold, calc } = token;

  return {
    [`${componentCls}:not(${componentCls}-switch)`]: {
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
        paddingInlineStart: paddingSM,
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

      // ============================ Footer =============================
      [`${componentCls}-footer`]: {
        paddingInlineStart: paddingSM,
        paddingInlineEnd: paddingSM,
        paddingBlockEnd: paddingSM,
        paddingBlockStart: paddingXXS,
        boxSizing: 'border-box',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Sender'> = (token) => {
  const { colorPrimary, colorFillTertiary } = token;
  const colorBgSlot = new FastColor(colorPrimary).setA(0.06).toRgbString();
  const colorTextSlot = colorPrimary;
  const colorTextSlotPlaceholder = new FastColor(colorPrimary).setA(0.25).toRgbString();
  const colorBorderSlotHover = new FastColor(colorPrimary).setA(0.1).toRgbString();
  const colorBorderSlot = colorBgSlot;
  const switchCheckedBg = new FastColor(colorPrimary).setA(0.08).toRgbString();

  const switchUncheckedHoverBg = new FastColor(colorFillTertiary).setA(0.04).toRgbString();
  const switchCheckedHoverBg = new FastColor(colorPrimary).setA(0.1).toRgbString();
  return {
    colorBgSlot,
    colorTextSlot,
    colorTextSlotPlaceholder,
    colorBorderSlotHover,
    colorBorderSlot,
    switchCheckedBg,
    switchCheckedHoverBg,
    switchUncheckedHoverBg,
  };
};

export default genStyleHooks<'Sender'>(
  'Sender',
  (token) => {
    const { paddingXS, calc } = token;
    const SenderToken = mergeToken<SenderToken>(token, {
      SenderContentMaxWidth: `calc(100% - ${unit(calc(paddingXS).add(32).equal())})`,
    });
    return [
      genSenderStyle(SenderToken),
      genSenderHeaderStyle(SenderToken),
      genSenderSwitchStyle(SenderToken),
      genSlotTextAreaStyle(SenderToken),
    ];
  },
  prepareComponentToken,
);
