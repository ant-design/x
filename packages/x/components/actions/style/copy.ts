import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { ActionsToken } from '.';

const genActionsCopyStyle: GenerateStyle<ActionsToken> = (token) => {
  const { componentCls } = token;

  const copyCls = `${componentCls}-copy`;
  return {
    [copyCls]: {
      [`${copyCls}-copy`]: {
        fontSize: 'inherit',
        [`&:not(${copyCls}-copy-success)`]: {
          color: 'inherit!important',
        },
      },
      [`${copyCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export default genActionsCopyStyle;
