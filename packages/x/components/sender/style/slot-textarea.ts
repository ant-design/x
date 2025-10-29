import { unit } from '@ant-design/cssinjs';
import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { SenderToken } from '.';

const genSlotTextAreaStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, antCls, calc } = token;
  const slotCls = `${componentCls}-slot`;
  const antInputCls = `${antCls}-input`;

  const antDropdownCls = `${antCls}-dropdown-trigger`;
  const slotInputCls = `${componentCls}-slot-input`;
  const slotSelectCls = `${componentCls}-slot-select`;
  const slotTagCls = `${componentCls}-slot-tag`;
  return {
    [`${componentCls}-input-slot`]: {
      outline: 'none',
      cursor: 'text',
      whiteSpace: 'pre-wrap',
      width: '100%',
      caretColor: token.colorPrimary,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      '&:empty::before': {
        content: 'attr(data-placeholder)',
        color: token.colorTextPlaceholder,
      },
    },
    [slotCls]: {
      display: 'inline-flex',
      margin: `0 ${unit(token.marginXXS)}`,
      verticalAlign: 'bottom',
      alignItems: 'center',
      marginBlock: unit(calc(token.marginXXS).div(2).equal()),
      minHeight: token.controlHeightSM,
      wordBreak: 'break-all',
    },

    [`${antInputCls}${slotInputCls}`]: {
      background: token.colorBgSlot,
      border: `1px solid ${token.colorBorderSlot}`,
      outline: 'none',
      color: token.colorTextSlot,
      borderRadius: token.borderRadius,
      padding: `0 ${unit(token.paddingXXS)}`,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      position: 'relative',
      '&::placeholder': {
        color: token.colorTextSlotPlaceholder,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
      },
      '&:hover, &:focus': {
        borderColor: token.colorBorderSlotHover,
      },
    },
    [`${slotSelectCls}`]: {
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      padding: `0 ${unit(token.paddingXXS)}`,
      transition: `border-color  ${token.motionDurationMid}`,
      position: 'relative',
      display: 'inline',
      cursor: 'pointer',
      background: token.colorBgSlot,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: token.borderRadius,
      color: token.colorTextSlot,
      border: `1px solid ${token.colorBorderSlot}`,
      '&.placeholder': {
        color: token.colorTextSlotPlaceholder,
      },
      [`&${antDropdownCls}-open`]: {
        borderColor: token.colorBorderSlotHover,
      },
    },
    [`${slotSelectCls}-value`]: {
      flex: 1,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      '&:empty::before': {
        content: 'attr(data-placeholder)',
      },
    },
    [`${slotSelectCls}-arrow`]: {
      marginInlineStart: token.marginXXS,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [`${slotSelectCls}-dropdown ${antDropdownCls}`]: {
      position: 'absolute',
      insetInlineStart: 0,
      top: '100%',
      display: 'inline-flex',
      background: token.colorBgElevated,
      borderRadius: token.borderRadiusLG,
      boxShadow: token.boxShadowSecondary,
      margin: `${token.marginXS} 0 0 0`,
      padding: `${token.paddingXXS}`,
      listStyle: 'none',
      zIndex: 1050,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      width: 'max-content',
    },
    [`${slotSelectCls}-dropdown li`]: {
      minWidth: 'fit-content',
      padding: `${unit(token.paddingXXS)} ${unit(token.controlPaddingHorizontal)}`,
      cursor: 'pointer',
      userSelect: 'none',
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      transition: `background ${token.motionDurationMid}`,
      color: token.colorText,
      position: 'relative',
    },
    [`${slotSelectCls}-dropdown li.active, ${slotSelectCls}-dropdown li:hover`]: {
      background: token.controlItemBgHover,
      color: token.colorText,
    },
    [`${slotTagCls}`]: {
      background: token.colorBgSlot,
      border: `1px solid ${token.colorBorderSlot}`,
      outline: 'none',
      color: token.colorTextSlot,
      borderRadius: token.borderRadius,
      padding: `0 ${unit(token.paddingXXS)}`,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      position: 'relative',
      cursor: 'default',
    },
  };
};

export default genSlotTextAreaStyle;
