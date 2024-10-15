import type { SenderToken } from '.';
import type { GenerateStyle } from '../../theme/cssinjs-utils';

const genSenderHeaderStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, calc } = token;

  const headerCls = `${componentCls}-header`;

  return {
    [componentCls]: {
      [headerCls]: {
        borderBottomWidth: token.lineWidth,
        borderBottomStyle: 'solid',
        borderBottomColor: token.colorBorder,

        // ======================== Header ========================
        '&-header': {
          background: token.colorFillAlter,
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          paddingBlock: calc(token.paddingSM).sub(token.lineWidthBold).equal(),
          paddingInlineStart: token.padding,
          paddingInlineEnd: token.paddingXS,
          display: 'flex',

          [`${headerCls}-title`]: {
            flex: 'auto',
          },
        },

        // ======================== Motion ========================
        '&-motion': {
          transition: ['height', 'border']
            .map((prop) => `${prop} ${token.motionDurationSlow}`)
            .join(','),
          overflow: 'hidden',

          '&-enter-prepare, &-enter-start, &-leave-active': {
            borderBottomColor: 'transparent',
          },

          '&-hidden': {
            display: 'none',
          },
        },
      },
    },
  };
};

export default genSenderHeaderStyle;
