import { CSSObject } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

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
    [componentCls]: {
      [`${componentCls}-rtl`]: {
        direction: 'rtl',
      },
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

        '&-hide-placement': {
          [`${placeholderCls}-inner`]: {
            display: 'none',
          },
        },

        [placeholderCls]: {
          padding: 0,
        },
      },

      '&': {
        // ============================= Placeholder =============================
        [placeholderCls]: {
          width: '100%',
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
    },
  };
};

const genFileListStyle: GenerateStyle<AttachmentsToken> = (token) => {
  const { componentCls, calc, antCls } = token;

  const fileListCls = `${componentCls}-list`;
  const cardCls = `${componentCls}-list-card`;

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
        boxSizing: 'content-box',

        // ======================================================================
        // ==                              Upload                              ==
        // ======================================================================
        '&-upload-btn': {
          width: cardHeight,
          height: cardHeight,
          fontSize: token.fontSizeHeading2,
          color: '#999',
        },

        // ============================== Status ===============================
        [`${cardCls}-status-error`]: {
          borderColor: token.colorError,
          borderWidth: token.lineWidth,
          borderStyle: token.lineType,

          [`${cardCls}-desc`]: {
            color: token.colorError,
          },
        },

        // ============================== Mask =================================
        [`${cardCls}-status-uploading, ${cardCls}-status-error`]: {
          [`${antCls}-image-cover`]: {
            opacity: 1,
          },
        },

        [`${cardCls}-file-img-mask`]: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },

        [`${cardCls}-desc`]: {
          display: 'flex',
          flexWrap: 'nowrap',
          maxWidth: '100%',
        },

        [`${cardCls}-ellipsis`]: {
          maxWidth: 58,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
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
