import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { SenderToken } from '.';

const genSlotContentEditableStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls } = token;
  const contentEditableCls = `${componentCls}-content-editable`;
  return {
    [contentEditableCls]: {
      width: 'max-content',
    },
    [`${contentEditableCls}-placeholder`]: {
      top: 0,
      left: 0,
      visibility: 'hidden',
      color: token.colorTextSlotPlaceholder,
      position: 'absolute',
      width: 'max-content',
      zIndex: 0,
    },
    [`${contentEditableCls}-placeholder-visible`]: {
      visibility: 'visible',
      position: 'unset',
    },
    [`${contentEditableCls}-edit`]: {
      whiteSpace: 'nowrap',
      outline: 'none',
      cursor: 'text',
      paddingInline: token.paddingXXS,
    },
    [`${contentEditableCls}-edit-empty-value`]: {
      position: 'absolute',
      minWidth: 20,
      width: '100%',
      zIndex: 1,
      top: 0,
      left: 0,
    },
  };
};

export default genSlotContentEditableStyle;
