import { CSSObject, unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

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
        background: token.colorBgBlur,
        backdropFilter: 'blur(10px)',
        borderRadius: token.borderRadius,
        borderWidth: token.lineWidthBold,
        borderStyle: 'dashed',
        borderColor: 'transparent',
        padding: token.padding,
        ...anyBoxSizing,

        [`${antCls}-upload-wrapper ${antCls}-upload${antCls}-upload-btn`]: {
          padding: 0,
        },

        [`&${placeholderCls}-drag-in`]: {
          borderColor: token.colorPrimaryHover,
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

        [cardCls]: {
          borderRadius: token.borderRadius,
          position: 'relative',
          background: token.colorFillContent,
          borderWidth: token.lineWidth,
          borderStyle: 'solid',
          borderColor: 'transparent',

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
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Attachments'> = () => ({});

export default genStyleHooks(
  'Attachments',
  (token) => {
    const compToken = mergeToken<AttachmentsToken>(token, {});
    return [genAttachmentsStyle(compToken), genFileListStyle(compToken)];
  },
  prepareComponentToken,
);
