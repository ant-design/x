import type { AttachmentsToken } from '.';
import type { GenerateStyle } from '../../theme/cssinjs-utils';

const genFileCardStyle: GenerateStyle<AttachmentsToken> = (token) => {
  const { componentCls, calc } = token;

  const cardCls = `${componentCls}-list-card`;

  const cardHeight = calc(token.fontSize)
    .mul(token.lineHeight)
    .mul(2)
    .add(token.paddingSM)
    .add(token.paddingSM)
    .equal();

  return {
    [cardCls]: {
      borderRadius: token.borderRadius,
      position: 'relative',
      background: token.colorFillContent,
      borderWidth: token.lineWidth,
      borderStyle: 'solid',
      borderColor: 'transparent',
      flex: 'none',

      // =============================== Desc ================================
      [`${cardCls}-name,${cardCls}-desc`]: {
        display: 'flex',
        flexWrap: 'nowrap',
        maxWidth: '100%',
      },

      [`${cardCls}-ellipsis-prefix`]: {
        flex: '0 1 auto',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },

      [`${cardCls}-ellipsis-suffix`]: {
        flex: 'none',
      },

      // ============================= Overview ==============================
      '&-type-overview': {
        padding: calc(token.paddingSM).sub(token.lineWidth).equal(),
        paddingInlineStart: calc(token.padding).add(token.lineWidth).equal(),
        display: 'flex',
        flexWrap: 'nowrap',
        gap: token.paddingXS,
        alignItems: 'flex-start',
        width: 236,

        // Icon
        [`${cardCls}-icon`]: {
          fontSize: calc(token.fontSizeLG).mul(2).equal(),
          lineHeight: 1,
          paddingTop: calc(token.paddingXXS).mul(1.5).equal(),
          flex: 'none',
        },

        // Content
        [`${cardCls}-content`]: {
          flex: 'auto',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        },

        [`${cardCls}-desc`]: {
          color: token.colorTextTertiary,
        },
      },

      // ============================== Preview ==============================
      '&-type-preview': {
        width: cardHeight,
        height: cardHeight,
        lineHeight: 1,

        [`&:not(${cardCls}-status-error)`]: {
          border: 0,
        },

        // Img
        img: {
          width: '100%',
          height: '100%',
          verticalAlign: 'top',
          objectFit: 'cover',
          borderRadius: 'inherit',
        },

        // Mask
        [`${cardCls}-img-mask`]: {
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: `rgba(0, 0, 0, ${token.opacityLoading})`,
          borderRadius: 'inherit',
        },

        // Error
        [`&${cardCls}-status-error`]: {
          [`img, ${cardCls}-img-mask`]: {
            borderRadius: calc(token.borderRadius).sub(token.lineWidth).equal(),
          },

          [`${cardCls}-desc`]: {
            paddingInline: token.paddingXXS,
          },
        },

        // Progress
        [`${cardCls}-progress`]: {},
      },

      // ============================ Remove Icon ============================
      [`${cardCls}-remove`]: {
        position: 'absolute',
        top: 0,
        insetInlineEnd: 0,
        border: 0,
        padding: token.paddingXXS,
        background: 'transparent',
        lineHeight: 1,
        transform: 'translate(50%, -50%)',
        fontSize: token.fontSize,
        cursor: 'pointer',
        opacity: token.opacityLoading,
        display: 'none',

        '&:dir(rtl)': {
          transform: 'translate(-50%, -50%)',
        },

        '&:hover': {
          opacity: 1,
        },

        '&:active': {
          opacity: token.opacityLoading,
        },
      },

      [`&:hover ${cardCls}-remove`]: {
        display: 'block',
      },

      // ============================== Status ===============================
      '&-status-error': {
        borderColor: token.colorError,

        [`${cardCls}-desc`]: {
          color: token.colorError,
        },
      },

      // ============================== Motion ===============================
      '&-motion': {
        overflow: 'hidden',
        transition: ['opacity', 'width', 'margin', 'padding']
          .map((prop) => `${prop} ${token.motionDurationSlow}`)
          .join(','),

        [`${cardCls}-remove`]: {
          display: 'none !important',
        },

        '&-appear-start': {
          width: 0,
          transition: 'none',
        },

        '&-leave-active': {
          opacity: 0,
          width: 0,
          paddingInline: 0,
          borderInlineWidth: 0,
          marginInlineEnd: calc(token.paddingSM).mul(-1).equal(),
        },
      },
    },
  };
};

export default genFileCardStyle;
