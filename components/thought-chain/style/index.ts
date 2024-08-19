import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
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

const genThoughtChainItemStatusStyle = (token: ThoughtChainToken): CSSObject => {
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
      const key = `&${itemCls}-${status}-${nextStatus}`;
      const lastBeforeStyle =
        status === nextStatus
          ? {}
          : {
              backgroundColor: 'none',
              backgroundImage: `linear-gradient(${colors[status]}, ${colors[nextStatus]})`,
            };

      styles[key] = {
        [`& ${itemCls}-icon, & > *::before`]: {
          backgroundColor: colors[status],
        },
        [`& > :last-child::before`]: lastBeforeStyle,
      };
    });
  });

  // 使用精确的选择器
  return styles;
};

const genBeforePseudoStyle: GenerateStyle<ThoughtChainToken, CSSObject> = (
  token: ThoughtChainToken,
) => {
  const { calc } = token;

  return {
    position: 'relative',

    '&::before': {
      content: '""',
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

      ...genThoughtChainItemStatusStyle(token),

      [`& > :last-child::before`]: {
        bottom: `${token.calc(token.paddingXL).mul(-1).equal()} !important`,
      },
      [`& ${itemCls}-header, & ${itemCls}-content, & ${itemCls}-footer`]: {
        ...genBeforePseudoStyle(token),
      },
      [`& ${itemCls}-header, & ${itemCls}-content`]: {
        marginLeft: calc(token.itemHeaderSize).mul(-1).equal(),
      },
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
        [`& ${itemCls}-content-box`]: {},
      },
      [`& ${itemCls}-footer`]: {
        '&::before': {
          left: calc(token.itemHeaderSize).div(2).mul(-1).sub(token.lineWidth).equal(),
          top: 0,
          bottom: 0,
        },
        [`& ${itemCls}-footer-box`]: {},
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
      gap: token.paddingXL,
      paddingLeft: token.itemHeaderSize,

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
        paddingRight: token.itemHeaderSize,

        [`& ${componentCls}-item`]: {
          [`& ${componentCls}-item-header, & ${componentCls}-item-content`]: {
            marginRight: calc(token.itemHeaderSize).mul(-1).equal(),
          },

          [`& ${componentCls}-item-header::before, & ${componentCls}-item-content::before`]: {
            right: calc(token.itemHeaderSize).div(2).equal(),
            left: 'none',
          },
          [`& ${componentCls}-item-footer::before`]: {
            right: calc(token.itemHeaderSize).div(2).mul(-1).equal(),
            left: 'none',
            top: 0,
            bottom: 0,
          },
        },
      },
      [`& > ${componentCls}-item`]: {
        [`& > :last-child::before`]: {
          bottom: token.calc(token.paddingXL).mul(-1).equal(),
        },
      },
      [`& > :last-child`]: {
        [`& > :last-child::before`]: {
          display: 'none !important',
        },
      },
      ...genThoughtChainItemStyle(token),
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
