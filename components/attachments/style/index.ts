import { CSSObject, unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {
  colorBgPlaceholderHover: string;
}

export interface AttachmentsToken extends FullToken<'Attachments'> {}

const anyBoxSizing: CSSObject = {
  '&, *': {
    boxSizing: 'border-box',
  },
};

const genAttachmentsStyle: GenerateStyle<AttachmentsToken> = (token) => {
  const { componentCls, calc, antCls } = token;

  const dropAreaCls = `${componentCls}-drop-area`;
  const placeholderCls = `${componentCls}-placeholder`;

  return {
    // ============================== Full Screen ==============================
    [dropAreaCls]: {
      position: 'absolute',
      inset: 0,
      zIndex: token.zIndexPopupBase,
      ...anyBoxSizing,

      '&-on-body': {
        position: 'fixed',
        inset: 0,
      },

      [placeholderCls]: {
        padding: 0,
      },
    },

    '&': {
      // ============================= Placeholder =============================
      [placeholderCls]: {
        height: '100%',
        borderRadius: token.borderRadius,
        borderWidth: token.lineWidthBold,
        borderStyle: 'dashed',
        borderColor: 'transparent',
        padding: token.padding,
        position: 'relative',
        backdropFilter: 'blur(10px)',
        background: token.colorBgPlaceholderHover,
        ...anyBoxSizing,

        [`${antCls}-upload-wrapper ${antCls}-upload${antCls}-upload-btn`]: {
          padding: 0,
        },

        [`&${placeholderCls}-drag-in`]: {
          borderColor: token.colorPrimaryHover,
        },
        [`&${placeholderCls}-disabled`]: {
          opacity: 0.25,
          pointerEvents: 'none',
        },

        [`${placeholderCls}-inner`]: {
          gap: calc(token.paddingXXS).div(2).equal(),
        },
        [`${placeholderCls}-icon`]: {
          fontSize: token.fontSizeHeading2,
          lineHeight: 1,
        },
        [`${placeholderCls}-title${placeholderCls}-title`]: {
          margin: 0,
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
        },
        [`${placeholderCls}-description`]: {},
      },
    },
  };
};

const genFileListStyle: GenerateStyle<AttachmentsToken> = (token) => {
  const { componentCls, calc } = token;

  const fileListCls = `${componentCls}-list`;
  const cardCls = `${fileListCls}-card`;

  const cardHeight = calc(token.fontSize)
    .mul(token.lineHeight)
    .mul(2)
    .add(token.paddingSM)
    .add(token.paddingSM)
    .equal();

  return {
    [componentCls]: {
      position: 'relative',
      width: '100%',
      ...anyBoxSizing,

      // =============================== File List ===============================
      [fileListCls]: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: token.paddingSM,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        color: token.colorText,
        paddingBlock: token.paddingSM,
        paddingInline: token.padding,
        width: '100%',
        background: token.colorBgContainer,

        // Hide scrollbar
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },

        // Scroll
        '&-overflow-scrollX, &-overflow-scrollY': {
          '&:before, &:after': {
            content: '""',
            position: 'absolute',
            opacity: 0,
            transition: `opacity ${token.motionDurationSlow}`,
            zIndex: 1,
          },
        },
        '&-overflow-ping-start:before': {
          opacity: 1,
        },
        '&-overflow-ping-end:after': {
          opacity: 1,
        },

        '&-overflow-scrollX': {
          overflowX: 'auto',
          overflowY: 'hidden',
          flexWrap: 'nowrap',

          '&:before, &:after': {
            insetBlock: 0,
            width: 8,
          },
          '&:before': {
            insetInlineStart: 0,
            background: `linear-gradient(to right, rgba(0,0,0,0.06), rgba(0,0,0,0));`,
          },
          '&:after': {
            insetInlineEnd: 0,
            background: `linear-gradient(to left, rgba(0,0,0,0.06), rgba(0,0,0,0));`,
          },

          '&:dir(rtl)': {
            '&:before': {
              background: `linear-gradient(to left, rgba(0,0,0,0.06), rgba(0,0,0,0));`,
            },
            '&:after': {
              background: `linear-gradient(to right, rgba(0,0,0,0.06), rgba(0,0,0,0));`,
            },
          },
        },

        '&-overflow-scrollY': {
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: calc(cardHeight).mul(3).equal(),

          '&:before, &:after': {
            insetInline: 0,
            height: 8,
          },

          '&:before': {
            insetBlockStart: 0,
            background: `linear-gradient(to bottom, rgba(0,0,0,0.06), rgba(0,0,0,0));`,
          },
          '&:after': {
            insetBlockEnd: 0,
            background: `linear-gradient(to top, rgba(0,0,0,0.06), rgba(0,0,0,0));`,
          },
        },

        // ======================================================================
        // ==                               Card                               ==
        // ======================================================================
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

            [`&:not(${fileListCls}-card-status-error)`]: {
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
            [`&${fileListCls}-card-status-error`]: {
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
          '&-remove': {
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

          [`&:hover ${fileListCls}-card-remove`]: {
            display: 'block',
          },

          // ============================== Status ===============================
          '&-status-error': {
            borderColor: token.colorError,

            [`${fileListCls}-card-desc`]: {
              color: token.colorError,
            },
          },

          // ============================== Motion ===============================
          '&-motion': {
            overflow: 'hidden',
            transition: ['opacity', 'width', 'margin', 'padding']
              .map((prop) => `${prop} ${token.motionDurationSlow}`)
              .join(','),

            [`${fileListCls}-card-remove`]: {
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

        // ======================================================================
        // ==                              Upload                              ==
        // ======================================================================
        '&-upload-btn': {
          width: cardHeight,
          height: cardHeight,
          fontSize: token.fontSizeHeading2,
          color: '#999',
        },

        // ======================================================================
        // ==                             PrevNext                             ==
        // ======================================================================
        '&-prev-btn, &-next-btn': {
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          boxShadow: token.boxShadowTertiary,
          opacity: 0,
          pointerEvents: 'none',
        },
        '&-prev-btn': {
          left: {
            _skip_check_: true,
            value: token.padding,
          },
        },
        '&-next-btn': {
          right: {
            _skip_check_: true,
            value: token.padding,
          },
        },

        '&:dir(ltr)': {
          [`&${fileListCls}-overflow-ping-start ${fileListCls}-prev-btn`]: {
            opacity: 1,
            pointerEvents: 'auto',
          },
          [`&${fileListCls}-overflow-ping-end ${fileListCls}-next-btn`]: {
            opacity: 1,
            pointerEvents: 'auto',
          },
        },
        '&:dir(rtl)': {
          [`&${fileListCls}-overflow-ping-end ${fileListCls}-prev-btn`]: {
            opacity: 1,
            pointerEvents: 'auto',
          },
          [`&${fileListCls}-overflow-ping-start ${fileListCls}-next-btn`]: {
            opacity: 1,
            pointerEvents: 'auto',
          },
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Attachments'> = (token) => {
  const { colorBgContainer } = token;
  const colorBgPlaceholderHover = new FastColor(colorBgContainer).setA(0.85);

  return {
    colorBgPlaceholderHover: colorBgPlaceholderHover.toRgbString(),
  };
};

export default genStyleHooks(
  'Attachments',
  (token) => {
    const compToken = mergeToken<AttachmentsToken>(token, {});
    return [genAttachmentsStyle(compToken), genFileListStyle(compToken)];
  },
  prepareComponentToken,
);
