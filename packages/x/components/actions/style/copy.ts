import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { ActionsToken } from '.';

const genActionsCopyStyle: GenerateStyle<ActionsToken> = (token) => {
  const { componentCls } = token;

  const copyCls = `${componentCls}-copy`;

  return {
    [copyCls]: {
      '&-rtl': {
        direction: 'rtl',
      },
      '&-copy': {
        fontSize:'inherit',
        [`&:not(${copyCls}-copy-success)`]: {
          color: "inherit!important"
        }
      },
    },
  };
};

export default genActionsCopyStyle;
