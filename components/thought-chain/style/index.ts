import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { CSSObject } from '@ant-design/cssinjs';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genCollapseMotion } from 'antd/es/style/motion';

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

type GenerateThoughtChainItemStyle = GenerateStyle<ThoughtChainToken, CSSObject>;

const genThoughtChainItemStatusStyle: GenerateThoughtChainItemStyle = (token) => {
  const { componentCls } = token;
  const itemCls = `${componentCls}-item`;

  const colors = {
    [THOUGHT_CHAIN_ITEM_STATUS.PENDING]: token.colorPrimaryText,
    [THOUGHT_CHAIN_ITEM_STATUS.SUCCESS]: token.colorSuccessText,
    [THOUGHT_CHAIN_ITEM_STATUS.ERROR]: token.colorErrorText,
  };

  const statuses = Object.keys(colors) as Array<keyof typeof colors>;

  const styles: Record<string, CSSObject> = {};

  statuses.forEach((status) => {
    statuses.forEach((nextStatus) => {
      const itemStatusCls = `& ${itemCls}-${status}-${nextStatus}`;
      const lastBeforePseudoStyle =
        status === nextStatus
          ? {}
          : {
              backgroundColor: 'none',
              backgroundImage: `linear-gradient(${colors[status]}, ${colors[nextStatus]})`,
            };

      styles[itemStatusCls] = {
        [`& ${itemCls}-icon, & > *::before`]: {
          backgroundColor: colors[status],
        },
        [`& > :last-child::before`]: lastBeforePseudoStyle,
      };
    });
  });

  return styles;
};

const genThoughtChainItemBeforePseudoStyle: GenerateThoughtChainItemStyle = (token) => {
  const { calc, componentCls } = token;
  const itemCls = `${componentCls}-item`;

  const beforePseudoBaseStyle = {
    content: '""',
    width: calc(token.lineWidth).mul(2).equal(),
    display: 'block',
    position: 'absolute',
    right: 'none',
  };

  return {
    [`& > ${itemCls}`]: {
      [`& ${itemCls}-header, & ${itemCls}-content, & ${itemCls}-footer`]: {
        position: 'relative',
      },
      [`& ${itemCls}-header, & ${itemCls}-content`]: {
        marginLeft: calc(token.itemHeaderSize).mul(-1).equal(),

        '&::before': {
          ...beforePseudoBaseStyle,
          left: calc(token.itemHeaderSize).div(2).sub(token.lineWidth).equal(),
          top: '100%',
          // flex-gap of the ThoughtChainItem
          bottom: calc(token.padding).mul(-1).equal(),
        },
      },
      [`& ${itemCls}-footer`]: {
        '&::before': {
          ...beforePseudoBaseStyle,
          left: calc(token.itemHeaderSize).div(-2).sub(token.lineWidth).equal(),
          top: 0,
        },
      },
      [`& > :last-child::before`]: {
        // flex-gap of the ThoughtChain
        bottom: `${token.calc(token.paddingXL).mul(-1).equal()} !important`,
      },
    },
  } as CSSObject;
};

const genThoughtChainItemStyle: GenerateThoughtChainItemStyle = (token) => {
  const { componentCls } = token;
  const itemCls = `${componentCls}-item`;

  return {
    [itemCls]: {
      display: 'flex',
      gap: token.padding,
      flexDirection: 'column',

      [`&${itemCls}-collapsible`]: {
        [`& ${itemCls}-header`]: {
          cursor: 'pointer',
        },
      },
      [`& ${itemCls}-header`]: {
        display: 'flex',
        gap: token.padding,
        alignItems: 'center',
        height: token.itemHeaderSize,

        [`& ${itemCls}-icon`]: {
          fontSize: token.itemIconFontSize,
          maxHeight: token.itemHeaderSize,
          minWidth: token.itemHeaderSize,
        },
        [`& ${itemCls}-extra`]: {
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          minWidth: token.itemHeaderSize,
        },
        [`& ${itemCls}-title`]: {},
        [`& ${itemCls}-desc`]: {},
      },
      [`& ${itemCls}-content`]: {
        [`& ${itemCls}-content-hidden`]: {
          display: 'none',
        },
        [`& ${itemCls}-content-box`]: {},
      },
      [`& ${itemCls}-footer`]: {
        [`& ${itemCls}-footer-box`]: {},
      },
    },
  };
};

const genThoughtChainStyle: GenerateStyle<ThoughtChainToken> = (token) => {
  const { componentCls, calc } = token;
  const itemCls = `${componentCls}-item`;

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: token.paddingXL,
      paddingLeft: token.itemHeaderSize,

      ...genThoughtChainItemStyle(token),
      ...genThoughtChainItemStatusStyle(token),
      ...genThoughtChainItemBeforePseudoStyle(token),

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
        paddingRight: token.itemHeaderSize,

        [`& ${itemCls}`]: {
          [`& ${itemCls}-header, & ${itemCls}-content`]: {
            marginRight: calc(token.itemHeaderSize).mul(-1).equal(),

            '&::before': {
              right: calc(token.itemHeaderSize).div(2).equal(),
              left: 'none',
            },
          },
          [`& ${itemCls}-footer`]: {
            '&::before': {
              right: calc(token.itemHeaderSize).div(-2).equal(),
              left: 'none',
            },
          },
        },
      },
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
    return [genThoughtChainStyle(compToken), genCollapseMotion(compToken)];
  },
  prepareComponentToken,
);
