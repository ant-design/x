import { unit } from '@ant-design/cssinjs';
import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { SenderToken } from '.';

const genSlotTextAreaStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, antCls } = token;
  const slotCls = `${componentCls}-slot`;
  const antInputCls = `${antCls}-input`;
  const antDropdownCls = `${antCls}-dropdown-trigger`;
  const slotInputCls = `${componentCls}-slot-input`;
  const slotSelectCls = `${componentCls}-slot-select`;
  const slotTagCls = `${componentCls}-slot-tag`;
  const slotContentCls = `${componentCls}-slot-content`;
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
    [`${slotCls}:not(${slotContentCls})`]: {
      display: 'inline-flex',
      verticalAlign: 'middle',
      alignItems: 'center',
      minHeight: token.controlHeightSM,
      wordBreak: 'break-all',
      marginInline: token.marginXXS,
    },

    [`${antInputCls}${slotInputCls}`]: {
      background: token.colorBgSlot,
      border: `1px solid ${token.colorBorderSlot}`,
      outline: 'none',
      color: token.colorTextSlot,
      borderRadius: token.borderRadius,
      paddingInline: token.paddingXXS,
      fontSize: 'inherit',
      lineHeight: 'inherit',
      position: 'relative',
      '&::placeholder': {
        color: token.colorTextSlotPlaceholder,
        fontSize: 'inherit',
        lineHeight: 'inherit',
      },
      '&:hover, &:focus': {
        borderColor: token.colorBorderSlotHover,
      },
    },
    [slotSelectCls]: {
      fontSize: 'inherit',
      lineHeight: 'inherit',
      paddingInline: token.paddingXXS,
      transition: `border-color  ${token.motionDurationMid}`,
      position: 'relative',
      display: 'inline-block',
      cursor: 'pointer',
      background: token.colorBgSlot,
      height: '100%',
      boxSizing: 'border-box',
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
      fontSize: 'inherit',
      lineHeight: 'inherit',
      '&:empty::before': {
        content: 'attr(data-placeholder)',
      },
    },
    [`${slotSelectCls}-arrow`]: {
      marginInlineStart: token.marginXXS,
      fontSize: token.fontSize,
      lineHeight: 'inherit',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [slotTagCls]: {
      background: token.colorBgSlot,
      border: `1px solid ${token.colorBorderSlot}`,
      outline: 'none',
      color: token.colorTextSlot,
      borderRadius: token.borderRadius,
      padding: `0 ${unit(token.paddingXXS)}`,
      fontSize: 'inherit',
      lineHeight: 'inherit',
      position: 'relative',
      cursor: 'default',
    },
    [slotContentCls]: {
      caretColor: token.colorPrimary,
      background: token.colorBgSlot,
      outline: 'none',
      color: token.colorTextSlot,
      borderRadius: token.borderRadius,
      paddingInline: token.paddingXXS,
      boxSizing: 'border-box',
      paddingBlock: 1,
      verticalAlign: 'middle',
      minHeight: token.controlHeightSM,
      fontSize: 'inherit',
      lineHeight: 'inherit',
      display: 'inline-block',
      position: 'relative',
      cursor: 'text',
      '&:empty': {
        width: 'fit-content',
        '&::after': {
          display: 'inline-block',
          content: 'attr(data-placeholder)',
          color: token.colorTextSlotPlaceholder,
        },
      },
    },
    [`${slotCls}-no-width`]: {
      userSelect: 'none',
      width: '3px',
      display: 'inline-block',
      lineHeight: 'inherit',
    },
  };
};

export default genSlotTextAreaStyle;
