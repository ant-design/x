import { unit } from '@ant-design/cssinjs/lib/util';
import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { ThoughtChainToken } from '.';

const genThoughtChainItemStyle: GenerateStyle<ThoughtChainToken> = (token) => {
  const { componentCls, calc } = token;
  const itemCls = `${componentCls}-item`;
  return {
    [componentCls]: {
      [`& ${componentCls}-status`]: {
        color: token.colorText,
      },
      [`& ${componentCls}-status-error`]: {
        color: token.colorError,
      },
      [`& ${componentCls}-status-success`]: {
        color: token.colorSuccess,
      },
      [`& ${componentCls}-status-loading`]: {
        color: token.colorPrimary,
      },
    },
    [itemCls]: {
      display: 'inline-flex',
      gap: token.marginXS,
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      fontSize: token.fontSize,
      color: token.colorText,
      paddingBlock: unit(calc(token.paddingXXS).add(1).equal()),
      paddingInline: token.paddingSM,
      boxSizing: 'border-box',
      lineHeight: token.lineHeight,
      borderRadius: token.itemBorderRadius,
      [`&${itemCls}-rtl`]: {
        direction: 'rtl',
      },
      [`&${itemCls}-solid`]: {
        background: token.itemSolidBg,
        [`&${itemCls}-click:hover`]: {
          background: token.itemSolidHoverBg,
          [`&${itemCls}-error:hover`]: {
            color: token.colorError,
            background: token.colorErrorBgFilledHover,
          },
        },
        [`&${itemCls}-error`]: {
          color: token.colorError,
          background: token.colorErrorBg,
        },
      },
      [`&${itemCls}-outlined`]: {
        paddingBlock: token.paddingXXS,
        backgroundColor: token.itemOutlinedBg,
        border: `${unit(token.lineWidth)} ${token.lineType}, ${token.colorBorder}`,

        [`&${itemCls}-click:hover`]: {
          background: token.itemOutlinedHoverBg,
          [`&${itemCls}-error:hover`]: {
            color: token.colorError,
            background: token.colorErrorBgFilledHover,
          },
        },
        [`&${itemCls}-error`]: {
          color: token.colorError,
          border: `${unit(token.lineWidth)} ${token.lineType}, ${token.colorErrorBorder}`,
          background: token.colorErrorBg,
        },
      },
      [`&${itemCls}-text`]: {
        [`&${itemCls}-click:hover`]: {
          background: token.itemSolidHoverBg,
          [`&${itemCls}-error:hover`]: {
            color: token.colorError,
            background: token.colorErrorBgFilledHover,
          },
        },
        [`&${itemCls}-error`]: {
          color: token.colorError,
        },
      },

      [`&${itemCls}-click`]: {
        cursor: 'pointer',
        '&-solid:hover': {
          background: token.itemSolidHoverBg,
        },
      },
      [`&${itemCls}-click`]: {
        cursor: 'pointer',
        transition: `all ${token.motionDurationMid}  ${token.motionEaseInOut}`,
      },
      [`& ${itemCls}-title`]: {
        display: 'inline-block',
      },
      [`& ${itemCls}-description`]: {
        paddingInlineStart: token.paddingXS,
        color: token.colorTextDescription,
        display: 'inline-block',
      },
    },
  };
};

export default genThoughtChainItemStyle;
