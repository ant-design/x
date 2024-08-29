import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { genCollapseMotion } from '../../style/motion';
import { THOUGHT_CHAIN_ITEM_STATUS } from '../Item';

import { unit, type CSSObject } from '@ant-design/cssinjs';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';

export interface ComponentToken {
  itemHeaderSize: number;
}

export interface ThoughtChainToken extends FullToken<'ThoughtChain'> {
  itemIconFontSize: number;
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

  const statuses = Object.keys(colors) as (keyof typeof colors)[];

  return statuses.reduce((acc, status) => {
    const statusColor = colors[status];

    statuses.forEach((nextStatus) => {
      const itemStatusCls = `& ${itemCls}-${status}-${nextStatus}`;
      const lastBeforePseudoStyle =
        status === nextStatus
          ? {}
          : {
              backgroundColor: 'none !important',
              backgroundImage: `linear-gradient(${statusColor}, ${colors[nextStatus]})`,
            };

      acc[itemStatusCls] = {
        [`& ${itemCls}-icon, & > *::before`]: {
          backgroundColor: `${statusColor} !important`,
        },
        '& > :last-child::before': lastBeforePseudoStyle,
      };
    });

    return acc;
  }, {} as CSSObject);
};

const genThoughtChainItemBeforePseudoStyle: GenerateThoughtChainItemStyle = (token) => {
  const { calc, componentCls } = token;
  const itemCls = `${componentCls}-item`;

  const beforePseudoBaseStyle = {
    content: '""',
    width: calc(token.lineWidth).mul(2).equal(),
    display: 'block',
    position: 'absolute',
    insetInlineEnd: 'none',
    backgroundColor: token.colorTextPlaceholder,
  };

  return {
    '& > :last-child > :last-child::before': {
      // last item's last before pseudo should be hidden
      display: 'none !important',
    },
    [`& > ${itemCls}`]: {
      [`& ${itemCls}-header, & ${itemCls}-content, & ${itemCls}-footer`]: {
        position: 'relative',
      },
      [`& ${itemCls}-header, & ${itemCls}-content`]: {
        marginInlineStart: calc(token.itemHeaderSize).mul(-1).equal(),

        '&::before': {
          ...beforePseudoBaseStyle,
          insetInlineStart: calc(token.itemHeaderSize).div(2).sub(token.lineWidth).equal(),
          // flex-gap of the ThoughtChainItem
          bottom: token.calc(token.padding).mul(-1).equal(),
        },
      },
      [`& ${itemCls}-header::before`]: {
        top: token.itemHeaderSize,
      },
      [`& ${itemCls}-content::before`]: {
        top: '100%',
      },
      [`& ${itemCls}-footer::before`]: {
        ...beforePseudoBaseStyle,
        insetInlineStart: calc(token.itemHeaderSize).div(-2).sub(token.lineWidth).equal(),
        top: 0,
      },
      '& > :last-child::before': {
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

      [`& ${itemCls}-collapsible`]: {
        cursor: 'pointer',
      },
      [`& ${itemCls}-header`]: {
        display: 'flex',
        gap: token.padding,
        alignItems: 'flex-start',

        [`& ${itemCls}-icon`]: {
          maxHeight: token.itemHeaderSize,
          minWidth: token.itemHeaderSize,
          fontSize: token.itemIconFontSize,
        },
        [`& ${itemCls}-extra`]: {
          height: token.itemHeaderSize,
          maxHeight: token.itemHeaderSize,
        },
        [`& ${itemCls}-header-box`]: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',

          [`& ${itemCls}-title`]: {
            height: token.itemHeaderSize,
            lineHeight: token.itemHeaderSize,
            maxHeight: token.itemHeaderSize,

            [`& ${itemCls}-collapse-icon`]: {
              marginInlineEnd: token.marginXS,
            },
          },
          [`& ${itemCls}-desc`]: {
            fontSize: token.fontSizeSM,
          },
        },
      },
      [`& ${itemCls}-content`]: {
        [`& ${itemCls}-content-hidden`]: {
          display: 'none',
        },
        [`& ${itemCls}-content-box`]: {
          padding: token.padding,
          display: 'inline-block',
          maxWidth: `calc(100% - ${token.itemHeaderSize})`,
          borderRadius: token.borderRadiusLG,
          backgroundColor: token.colorBgContainer,
          border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
        },
      },
      [`& ${itemCls}-footer`]: {
        display: 'inline-flex',
      },
    },
  };
};

const genThoughtChainStyle: GenerateStyle<ThoughtChainToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: token.marginXL,
      paddingInlineStart: token.itemHeaderSize,

      ...genThoughtChainItemStyle(token),
      ...genThoughtChainItemStatusStyle(token),
      ...genThoughtChainItemBeforePseudoStyle(token),

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
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
