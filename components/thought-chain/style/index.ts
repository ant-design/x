import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { Keyframes } from '@ant-design/cssinjs';
import type { CSSObject } from '@ant-design/cssinjs';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';

export interface ComponentToken {
  itemHeaderSize: number;
}

export interface ThoughtChainToken extends FullToken<'ThoughtChain'> {
  itemIconFontSize: number;
}

export enum THOUGHT_CHAIN_ITEM_STATUS {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

const genThoughtChainItemStatusStyle: GenerateStyle<ThoughtChainToken, CSSObject> = (
  token: ThoughtChainToken,
) => {
  const { componentCls } = token;

  return {
    [`& ${componentCls}-item`]: {},
  };
};

const genBeforePseudoStyle: GenerateStyle<ThoughtChainToken, CSSObject> = (
  token: ThoughtChainToken,
) => {
  const { calc } = token;

  return {
    position: 'relative',

    '&::before': {
      content: '""',
      backgroundColor: token.colorBorder,
      width: calc(token.lineWidth).mul(2).equal(),
      display: 'block',
      position: 'absolute',
      left: calc(token.itemHeaderSize).div(2).sub(token.lineWidth).equal(),
      top: '100%',
      bottom: calc(token.padding).mul(-1).equal(),
    },
  };
};

const genThoughtChainItemStyle: GenerateStyle<ThoughtChainToken, CSSObject> = (
  token: ThoughtChainToken,
) => {
  const { componentCls, calc } = token;
  const itemCls = `${componentCls}-item`;

  return {
    [itemCls]: {
      display: 'flex',
      gap: token.padding,
      flexDirection: 'column',
      marginLeft: calc(token.itemHeaderSize).mul(-1).equal(),

      [`& ${itemCls}-header`]: {
        display: 'flex',
        gap: token.padding,
        alignItems: 'center',
        height: token.itemHeaderSize,
        ...genBeforePseudoStyle(token),

        [`& ${itemCls}-icon`]: {
          fontSize: token.itemIconFontSize,
          
          maxHeight: token.itemHeaderSize,
          minWidth: token.itemHeaderSize,
        },
        [`& ${itemCls}-title`]: {},
        [`& ${itemCls}-desc`]: {},
        [`& ${itemCls}-extra`]: {
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          minWidth: token.itemHeaderSize,
        },
      },
      [`& ${itemCls}-content`]: {
        ...genBeforePseudoStyle(token),
      },
    },
  };
};

const genThoughtChainStyle: GenerateStyle<ThoughtChainToken> = (token) => {
  const { componentCls, calc } = token;

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: token.padding,
      paddingLeft: token.itemHeaderSize,

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
        paddingRight: token.itemHeaderSize,

        [`& ${componentCls}-item`]: {
          marginRight: calc(token.itemHeaderSize).mul(-1).equal(),

          [`& ${componentCls}-item-header`]: {
            '&::before': {
              right: calc(token.itemHeaderSize).div(2).equal(),
              left: 'none',
            },
          },
          [`& ${componentCls}-item-content`]: {
            '&::before': {
              right: calc(token.itemHeaderSize).div(2).equal(),
              left: 'none',
            },
          },
        },
      },

      ...genThoughtChainItemStyle(token),
      ...genThoughtChainItemStatusStyle(token),
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'ThoughtChain'> = (token) => ({
  itemHeaderSize: token.controlHeight,
});

export default genStyleHooks(
  'ThoughtChain',
  (token) => {
    const compToken = mergeToken<ThoughtChainToken>(token, {
      itemIconFontSize: token.calc(token.fontSizeLG).add(token.fontSizeXL).div(2).equal() as number,
    });
    return genThoughtChainStyle(compToken);
  },
  prepareComponentToken,
);
