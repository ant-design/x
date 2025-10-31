import { unit } from '@ant-design/cssinjs/lib/util';

import { initFadeMotion } from 'antd/es/style/motion';
import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { ThoughtChainToken } from '.';

const genThoughtChainItemStyle: GenerateStyle<ThoughtChainToken> = (token) => {
  const { componentCls, calc } = token;
  const itemCls = `${componentCls}-item`;

  return {
    [componentCls]: {
      [`& ${componentCls}-status`]: {
        color: 'inherit',
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
    [`${itemCls}-root`]: initFadeMotion(token),
    [itemCls]: {
      display: 'inline-flex',
      gap: unit(calc(token.marginXXS).add(1).equal()),
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      fontSize: token.fontSize,
      color: token.colorText,
      paddingBlock: unit(calc(token.paddingXXS).add(1).equal()),
      paddingInline: token.paddingSM,
      boxSizing: 'border-box',
      lineHeight: token.lineHeight,
      borderRadius: token.itemBorderRadius,
      alignItems: 'baseline',
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
        whiteSpace: 'nowrap',
      },
      [`& ${itemCls}-title-with-description`]: {
        marginInlineEnd: token.marginXS,
      },
      [`& ${itemCls}-description`]: {
        color: token.colorTextDescription,
        display: 'inline-block',
        whiteSpace: 'break-spaces',
      },
      [`& ${componentCls}-motion-blink`]: {
        [`& ${itemCls}-description`]: {
          color: token.itemMotionDescription,
        },
      },
    },
  };
};

export default genThoughtChainItemStyle;
