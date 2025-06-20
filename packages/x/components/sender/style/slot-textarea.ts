import type { SenderToken } from '.';
import type { GenerateStyle } from '../../theme/cssinjs-utils';

const genSlotTextAreaStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, antCls } = token;
  const slotCls = `${componentCls}-slot`;
  const antInputCls = `${antCls}-input`;
  const antDropdownCls = `${antCls}-dropdown`;
  const slotInputCls = `${componentCls}-slot-input`;
  const slotSelectCls = `${componentCls}-slot-select`;
  const slotTagCls = `${componentCls}-slot-tag`;
  return {
    [slotCls]: {
      display: 'inline-block',
      margin: '0 4px',
    },
    [`${antInputCls}${slotInputCls}`]: {
      background: '#1677FF0f',
      border: '1px solid transparent',
      outline: 'none',
      color: '#1677ff',
      borderRadius: 6,
      padding: '0 4px',
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      position: 'relative',
      '&::placeholder': {
        color: 'rgba(22, 119, 255, 0.25)',
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
      },
      '&:hover, &:focus': {
        borderColor: 'rgba(22, 119, 255, 0.1)',
      },
    },
    [`${slotSelectCls}`]: {
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      padding: '0 4px',
      transition: 'border-color 0.2s',
      position: 'relative',
      display: 'inline-block',
      cursor: 'pointer',
      background: '#1677FF0f',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      userSelect: 'none',
      color: '#1677ff',
      border: '1px solid transparent',
      '&.placeholder': {
        color: 'rgba(22, 119, 255, 0.25)',
      },
      [`&${antDropdownCls}-open`]: {
        borderColor: 'rgba(22, 119, 255, 0.1)',
      },
    },
    [`${slotSelectCls}-value`]: {
      flex: 1,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
    },
    [`${slotSelectCls}-arrow`]: {
      marginLeft: 4,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [`${slotSelectCls}-dropdown ${antDropdownCls}`]: {
      position: 'absolute',
      left: 0,
      top: '100%',
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
      padding: `${token.paddingXXS} ${token.controlPaddingHorizontal}`,
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
      background: '#1677FF0f',
      border: '1px solid transparent',
      outline: 'none',
      color: '#1677ff',
      borderRadius: 6,
      padding: '0 4px',
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      position: 'relative',
      cursor: 'default',
    },
  };
};

export default genSlotTextAreaStyle;
