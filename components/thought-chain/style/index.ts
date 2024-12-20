import { mergeToken } from '@ant-design/cssinjs-utils';
import { genCollapseMotion } from '../../style/motion';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { THOUGHT_CHAIN_ITEM_STATUS } from '../Item';

import { type CSSObject, unit } from '@ant-design/cssinjs';
import type { ConfigProviderProps } from 'antd';
import type { FullToken, GenerateStyle } from '../../theme/cssinjs-utils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface ThoughtChainToken extends FullToken<'ThoughtChain'> {
  /**
   * @desc default size for item font size
   */
  itemFontSize: number;
  /**
   * @desc default size for item
   */
  itemSize: number;
  /**
   * @desc gap between items
   */
  itemGap: number;
  /**
   * @desc large size for item font size
   */
  itemFontSizeLG: number;
  /**
   * @desc large size for item
   */
  itemSizeLG: number;
  /**
   * @desc large gap between items
   */
  itemGapLG: number;
  /**
   * @desc small size for item font size
   */
  itemFontSizeSM: number;
  /**
   * @desc small size for item
   */
  itemSizeSM: number;
  /**
   * @desc small gap between items
   */
  itemGapSM: number;
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
    '& > :last-child > :last-child': {
      '&::before': {
        display: 'none !important',
      },
      [`&${itemCls}-footer`]: {
        '&::before': {
          display: 'block !important',
          bottom: 0,
        },
      },
    },
    [`& > ${itemCls}`]: {
      [`& ${itemCls}-header, & ${itemCls}-content, & ${itemCls}-footer`]: {
        position: 'relative',

        '&::before': {
          bottom: calc(token.itemGap).mul(-1).equal(),
        },
      },
      [`& ${itemCls}-header, & ${itemCls}-content`]: {
        marginInlineStart: calc(token.itemSize).mul(-1).equal(),

        '&::before': {
          ...beforePseudoBaseStyle,
          insetInlineStart: calc(token.itemSize).div(2).sub(token.lineWidth).equal(),
        },
      },
      [`& ${itemCls}-header::before`]: {
        top: token.itemSize,
        bottom: calc(token.itemGap).mul(-2).equal(),
      },
      [`& ${itemCls}-content::before`]: {
        top: '100%',
      },
      [`& ${itemCls}-footer::before`]: {
        ...beforePseudoBaseStyle,
        top: 0,
        insetInlineStart: calc(token.itemSize).div(-2).sub(token.lineWidth).equal(),
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
        marginBottom: token.itemGap,
        gap: token.itemGap,
        alignItems: 'flex-start',

        [`& ${itemCls}-icon`]: {
          height: token.itemSize,
          width: token.itemSize,
          fontSize: token.itemFontSize,
        },
        [`& ${itemCls}-extra`]: {
          height: token.itemSize,
          maxHeight: token.itemSize,
        },
        [`& ${itemCls}-header-box`]: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',

          [`& ${itemCls}-title`]: {
            height: token.itemSize,
            lineHeight: `${unit(token.itemSize)}`,
            maxHeight: token.itemSize,
            fontSize: token.itemFontSize,

            [`& ${itemCls}-collapse-icon`]: {
              marginInlineEnd: token.marginXS,
            },
          },
          [`& ${itemCls}-desc`]: {
            fontSize: token.itemFontSize,
          },
        },
      },
      [`& ${itemCls}-content`]: {
        [`& ${itemCls}-content-hidden`]: {
          display: 'none',
        },
        [`& ${itemCls}-content-box`]: {
          padding: token.itemGap,
          display: 'inline-block',
          maxWidth: `calc(100% - ${token.itemSize})`,
          borderRadius: token.borderRadiusLG,
          backgroundColor: token.colorBgContainer,
          border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
        },
      },
      [`& ${itemCls}-footer`]: {
        marginTop: token.itemGap,
        display: 'inline-flex',
      },
    },
  };
};

const genThoughtChainSizeStyle = (
  token: ThoughtChainToken,
  size: ConfigProviderProps['componentSize'] = 'middle',
) => {
  const { componentCls } = token;

  const sizeTokens = {
    large: {
      itemSize: token.itemSizeLG,
      itemGap: token.itemGapLG,
      itemFontSize: token.itemFontSizeLG,
    },
    middle: {
      itemSize: token.itemSize,
      itemGap: token.itemGap,
      itemFontSize: token.itemFontSize,
    },
    small: {
      itemSize: token.itemSizeSM,
      itemGap: token.itemGapSM,
      itemFontSize: token.itemFontSizeSM,
    },
  }[size];

  return {
    [`&${componentCls}-${size}`]: {
      paddingInlineStart: sizeTokens.itemSize,
      gap: sizeTokens.itemGap,

      ...genThoughtChainItemStyle({
        ...token,
        ...sizeTokens,
      }),
      ...genThoughtChainItemBeforePseudoStyle({
        ...token,
        ...sizeTokens,
      }),
    },
  };
};

const genThoughtChainStyle: GenerateStyle<ThoughtChainToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',

      ...genThoughtChainItemStatusStyle(token),
      ...genThoughtChainSizeStyle(token),
      ...genThoughtChainSizeStyle(token, 'large'),
      ...genThoughtChainSizeStyle(token, 'small'),

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export default genStyleHooks('ThoughtChain', (token) => {
  const compToken = mergeToken<ThoughtChainToken>(token, {
    // small size tokens
    itemFontSizeSM: token.fontSizeSM,
    itemSizeSM: token
      .calc(token.controlHeightXS)
      .add(token.controlHeightSM)
      .div(2)
      .equal() as number,
    itemGapSM: token.marginSM,
    // default size tokens
    itemFontSize: token.fontSize,
    itemSize: token.calc(token.controlHeightSM).add(token.controlHeight).div(2).equal() as number,
    itemGap: token.margin,
    // large size tokens
    itemFontSizeLG: token.fontSizeLG,
    itemSizeLG: token.calc(token.controlHeight).add(token.controlHeightLG).div(2).equal() as number,
    itemGapLG: token.marginLG,
  });
  return [genThoughtChainStyle(compToken), genCollapseMotion(compToken)];
});
