import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';

export interface ComponentToken {}

export interface ThoughtChainToken extends FullToken<'ThoughtChain'> {

}

const genThoughtChainStyle: GenerateStyle<ThoughtChainToken> = (token) => {
  const { componentCls, calc } = token;

  const beforePseudo = {
    content: '""',
    backgroundColor: token.colorBorder,
    width: token.lineWidth,
    display: 'block',
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
  };

  return {
    [componentCls]: {
      // display: 'flex',
      // flexDirection: 'column',
      // maxWidth: '100%',
      // [`&${componentCls}-rtl`]: {
      //   direction: 'rtl',

      //   [`& ${componentCls}-item`]: {
      //     marginRight: token.margin,
      //     marginLeft: 0,

      //     '&::before': {
      //       right: 0,
      //       left: 'none',
      //     },
      //     [`& ${componentCls}-item-header`]: {
      //       marginRight: calc(token.margin).mul(-1).equal(),

      //       '&::before': {
      //         right: token.margin,
      //         left: 'none',
      //       },
      //     },
      //   },
      // },
      // ' > :last-child': {
      //   paddingBottom: `0 !important`,
      // },
      // [`& ${componentCls}-item`]: {
      //   position: 'relative',
      //   paddingBottom: token.padding,
      //   marginLeft: token.margin,

      //   '&::before': beforePseudo,

      //   [`& ${componentCls}-item-header`]: {
      //     position: 'relative',
      //     padding: 0,
      //     marginLeft: calc(token.margin).mul(-1).equal(),
      //     display: 'flex',
      //     gap: token.margin,
      //     alignItems: 'center',
      //     cursor: 'pointer',

      //     '&::before': {
      //       ...beforePseudo,
      //       backgroundColor: token.colorBorderBg,
      //       left: token.margin,
      //     },

      //     [`& ${componentCls}-item-icon`]: {},
      //     [`& ${componentCls}-item-title`]: {
      //       position: 'relative',
      //       fontSize: token.fontSizeLG,
      //     },
      //     [`& ${componentCls}-item-desc`]: {},
      //     [`& ${componentCls}-item-extra`]: {
      //       display: 'flex',
      //       flex: 1,
      //       justifyContent: 'flex-end',
      //     },
      //   },
      //   [`& ${componentCls}-item-content`]: {
      //     position: 'relative',
      //     overflow: 'hidden',
      //     marginTop: token.margin,
      //     marginLeft: calc(token.margin).mul(-1).equal(),

      //     [`${token.antCls}-collapse-header, ${token.antCls}-collapse-content-box`]: {
      //       padding: 0,
      //       position: 'relative',
      //     },

      //     '&::before': {
      //       ...beforePseudo,
      //       backgroundColor: token.colorBorderBg,
      //       left: token.margin,
      //     },
      //   },
      // },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'ThoughtChain'> = () => ({});

export default genStyleHooks(
  'ThoughtChain',
  (token) => {
    const compToken = mergeToken<ThoughtChainToken>(token, {});
    return genThoughtChainStyle(compToken);
  },
  prepareComponentToken,
);
