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
  const slotContentCls = `${componentCls}-slot-content`;
  const skillCls = `${componentCls}-skill`;
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
      display: 'inline-block',
      verticalAlign: 'baseline',
      alignItems: 'center',
      marginBlock: 1,
      height: calc(token.fontSize).mul(token.lineHeight).add(2).equal(),
      wordBreak: 'break-all',
      marginInline: token.marginXXS,
    },
    [`${antInputCls}${slotInputCls}`]: {
      height: '100%',
      background: token.colorBgSlot,
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
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      paddingInline: token.paddingXXS,
      transition: `border-color  ${token.motionDurationMid}`,
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
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
    [slotTagCls]: {
      background: token.colorBgSlot,
      border: `1px solid ${token.colorBorderSlot}`,
      outline: 'none',
      color: token.colorTextSlot,
      borderRadius: token.borderRadius,
      padding: `0 ${unit(token.paddingXXS)}`,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      height: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      cursor: 'default',
    },
    [slotContentCls]: {
      height: calc(token.fontSize).mul(token.lineHeight).add(2).equal(),
      caretColor: token.colorPrimary,
      background: token.colorBgSlot,
      outline: 'none',
      color: token.colorTextSlot,
      borderRadius: token.borderRadius,
      paddingInline: token.paddingXXS,
      boxSizing: 'border-box',
      verticalAlign: 'baseline',
      fontSize: token.fontSize,
      marginBlock: 1,
      lineHeight: token.lineHeight,
      display: 'inline-block',
      position: 'relative',
      cursor: 'text',
      '&:empty': {
        width: 'fit-content',
        '&::after': {
          display: 'inline-block',
          height: 'inherit',
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
    [skillCls]: {
      display: 'inline-block',
      verticalAlign: 'top',
      alignItems: 'center',
      marginBlock: 1,
      height: calc(token.fontSize).mul(token.lineHeight).add(2).equal(),
      wordBreak: 'break-all',
      paddingInlineEnd: 0,
      paddingInlineStart: 1,
      marginInlineEnd: token.marginXS,
      marginInlineStart: -1,
    },
    [`${skillCls}-tag`]: {
      paddingInline: token.paddingXS,
      height: '100%',
      backgroundColor: token.colorBgSkill,
      borderRadius: token.borderRadius,
      color: token.colorPrimary,
      fontWeight: 500,
      position: 'relative',
      display: 'inline-flex',
      cursor: 'pointer',
      alignItems: 'center',
      gap: token.marginXXS,
      transition: `background-color ${token.motionDurationMid}`,
      '&:hover': {
        backgroundColor: token.colorBgSkillHover,
        [`${skillCls}-tag-close`]: {
          color: token.colorPrimaryHover,
        },
      },
      '&-close': {
        fontSize: token.fontSizeSM,
        display: 'inline-flex',
        transition: `color ${token.motionDurationMid}`,
        color: token.colorPrimary,
      },
    },
  };
};

export default genSlotTextAreaStyle;
