import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { genCollapseMotion } from '../../style/motion';
import { THOUGHT_CHAIN_ITEM_STATUS } from '../Item';

import { unit, type CSSObject } from '@ant-design/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/cssinjs-utils';

export interface ComponentToken {}

export interface ThoughtChainToken extends FullToken<'ThoughtChain'> {
  itemIconFontSize: number;
  itemIconSize: number;
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

      acc['& > :last-child > :last-child::before'] = {
        maskImage: `linear-gradient(to bottom, ${statusColor} 2%, transparent 98%)`,
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
    [`& > ${itemCls}`]: {
      [`& ${itemCls}-header, & ${itemCls}-content, & ${itemCls}-footer`]: {
        position: 'relative',

        '&::before': {
          bottom: `${token.calc(token.padding).mul(-1).equal()}`,
        },
      },
      [`& ${itemCls}-header, & ${itemCls}-content`]: {
        marginInlineStart: calc(token.itemIconSize).mul(-1).equal(),

        '&::before': {
          ...beforePseudoBaseStyle,
          insetInlineStart: calc(token.itemIconSize).div(2).sub(token.lineWidth).equal(),
        },
      },
      [`& ${itemCls}-header::before`]: {
        top: token.itemIconSize,
        bottom: `${token.calc(token.padding).mul(-2).equal()}`,
      },
      [`& ${itemCls}-content::before`]: {
        top: '100%',
      },
      [`& ${itemCls}-footer::before`]: {
        ...beforePseudoBaseStyle,
        top: 0,
        insetInlineStart: calc(token.itemIconSize).div(-2).sub(token.lineWidth).equal(),
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
      flexDirection: 'column',

      [`& ${itemCls}-collapsible`]: {
        cursor: 'pointer',
      },
      [`& ${itemCls}-header`]: {
        display: 'flex',
        marginBottom: token.margin,
        gap: token.padding,
        alignItems: 'flex-start',

        [`& ${itemCls}-icon`]: {
          height: token.itemIconSize,
          width: token.itemIconSize,
          fontSize: token.itemIconFontSize,
        },
        [`& ${itemCls}-extra`]: {
          height: token.itemIconSize,
          maxHeight: token.itemIconSize,
        },
        [`& ${itemCls}-header-box`]: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',

          [`& ${itemCls}-title`]: {
            height: token.itemIconSize,
            lineHeight: token.itemIconSize,
            maxHeight: token.itemIconSize,

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
          maxWidth: `calc(100% - ${token.itemIconSize})`,
          borderRadius: token.borderRadiusLG,
          backgroundColor: token.colorBgContainer,
          border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
        },
      },
      [`& ${itemCls}-footer`]: {
        marginTop: token.margin,
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
      gap: token.margin,
      paddingInlineStart: token.itemIconSize,

      ...genThoughtChainItemStyle(token),
      ...genThoughtChainItemStatusStyle(token),
      ...genThoughtChainItemBeforePseudoStyle(token),

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export default genStyleHooks('ThoughtChain', (token) => {
  const compToken = mergeToken<ThoughtChainToken>(token, {
    itemIconFontSize: token.fontSizeLG,
    itemIconSize: token
      .calc(token.controlHeightSM)
      .add(token.controlHeight)
      .div(2)
      .equal() as number,
  });
  return [genThoughtChainStyle(compToken), genCollapseMotion(compToken)];
});
