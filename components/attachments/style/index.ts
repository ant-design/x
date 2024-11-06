import { CSSObject } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import genFileCardStyle from './fileCard';

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
    return [
      genAttachmentsStyle(compToken),
      genFileListStyle(compToken),
      genFileCardStyle(compToken),
    ];
  },
  prepareComponentToken,
);
