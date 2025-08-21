import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface FileCardToken extends FullToken<'FileCard'> {}

const genFileCardStyle: GenerateStyle<FileCardToken> = (token) => {
  const {
    componentCls,
    paddingSM,
    padding,
    paddingXXS,
    colorFillTertiary,
    marginSM,
    colorTextDescription,
    fontSize,
    fontSizeSM,
    colorTextBase,
    motionDurationSlow,
    colorTextLightSolid,
    lineHeightLG,
    marginXXS,
    fontSizeHeading1,
    borderRadiusLG,
    fontSizeHeading4,
    controlHeightLG,
    marginXS,
    calc,
  } = token;

  return {
    [componentCls]: {
      display: 'flex',
      [`${componentCls}-file`]: {
        display: 'flex',
        alignItems: 'center',
        padding: `${paddingSM} ${padding}`,
        backgroundColor: colorFillTertiary,
        borderRadius: paddingSM,
        position: 'relative',
        overflow: 'hidden',

        '&-pointer': {
          cursor: 'pointer',
        },

        [`${componentCls}-file-icon`]: {
          fontSize: calc(fontSizeHeading1).sub(2).equal(),
          marginInlineEnd: marginSM,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },

        [`${componentCls}-file-content`]: {
          flex: 1,
          maxWidth: 275,
        },

        [`${componentCls}-file-name`]: {
          fontSize: fontSize,
          color: colorTextBase,
          display: 'flex',
          maxWidth: '100%',
        },

        [`${componentCls}-file-name-prefix`]: {
          flex: '0 1 auto',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },

        [`${componentCls}-file-name-suffix`]: {
          flex: 'none',
        },

        [`${componentCls}-file-description`]: {
          fontSize: fontSizeSM,
          color: colorTextDescription,
          lineHeight: lineHeightLG,
          marginBottom: marginXXS,
        },

        [`${componentCls}-file-mask`]: {
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colorTextLightSolid,
          background: 'rgba(0, 0, 0, 0.5)',
          cursor: 'pointer',
          opacity: 0,
          transition: `opacity ${motionDurationSlow}`,

          '&:hover': {
            opacity: 1,
          },

          [`${componentCls}-file-mask-info`]: {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            padding: `0 ${paddingXXS}`,
          },
        },
      },

      [`${componentCls}-file-small`]: {
        borderRadius: borderRadiusLG,
        padding: `0 ${paddingSM}`,
        height: controlHeightLG,

        [`${componentCls}-file-icon`]: {
          fontSize: fontSizeHeading4,
          marginInlineEnd: marginXS,
        },

        [`${componentCls}-file-description`]: {
          display: 'none',
        },
      },

      [`${componentCls}-image`]: {
        width: 268,
        borderRadius: paddingSM,
        overflow: 'hidden',

        img: {
          height: '100%',
          objectFit: 'cover',
          borderRadius: 'inherit',
        },
      },

      [`${componentCls}-video`]: {
        width: 268,
        borderRadius: paddingSM,
      },

      [`${componentCls}-audio`]: {
        width: 268,
      },

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

const genFileCardListStyle: GenerateStyle<FileCardToken> = (token) => {
  const {
    componentCls,
    padding,
    paddingSM,
    colorFillTertiary,
    marginXS,
    colorTextLabel,
    fontSize,
    fontSizeLG,
    borderRadius,
    motionDurationSlow,
    calc,
  } = token;

  return {
    [`${componentCls}-list`]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: marginXS,
      paddingBlock: paddingSM,
      paddingInline: padding,

      // Scrollbar none
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },

      '&-wrapper': {
        position: 'relative',
      },

      // list item
      [`${componentCls}-list-item`]: {
        display: 'flex',
        position: 'relative',
        [`${componentCls}-list-remove`]: {
          transition: `opacity ${token.motionDurationMid} ${token.motionEaseOut}`,
        },
        '&:hover': {
          [`${componentCls}-list-remove`]: {
            opacity: 1,
          },
        },
      },

      [`${componentCls}-list-motion`]: {
        transition: `opacity ${motionDurationSlow}`,

        [`${componentCls}-file, ${componentCls}-image, ${componentCls}-video, ${componentCls}-audio`]:
          {
            transition: ['width', 'padding']
              .map((prop) => `${prop} ${motionDurationSlow}`)
              .join(','),
          },

        '&-leave-active': {
          opacity: 0,
          marginInlineEnd: calc(marginXS).mul(-1).equal(),

          [`${componentCls}-file, ${componentCls}-image, ${componentCls}-video, ${componentCls}-audio`]:
            {
              width: 0,
              paddingInline: 0,
            },
        },
      },

      [`${componentCls}-file`]: {
        width: 236,

        [`${componentCls}-file-content`]: {
          maxWidth: 156,
        },
      },

      [`${componentCls}-image`]: {
        width: 68,
        height: 68,
        borderRadius: borderRadius,
        display: 'flex',
      },

      [`${componentCls}-list-remove`]: {
        position: 'absolute',
        top: 0,
        insetInlineEnd: 0,
        transform: 'translate(50%, -50%)',
        fontSize: fontSizeLG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colorTextLabel,
        opacity: 0,
        cursor: 'pointer',
        backgroundColor: colorFillTertiary,
      },

      // small size
      '&-small': {
        [`${componentCls}-list-remove`]: {
          fontSize: fontSize,
        },
      },

      // Scroll
      '&-overflow-scrollX, &-overflow-scrollY': {
        '&:before, &:after': {
          content: '""',
          position: 'absolute',
          opacity: 0,
          transition: `opacity ${motionDurationSlow}`,
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
        maxHeight: 68,

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

      // prev/next btn
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
        [`&${componentCls}-list-overflow-ping-start ${componentCls}-list-prev-btn`]: {
          opacity: 1,
          pointerEvents: 'auto',
        },
        [`&${componentCls}-list-overflow-ping-end ${componentCls}-list-next-btn`]: {
          opacity: 1,
          pointerEvents: 'auto',
        },
      },
      '&:dir(rtl)': {
        [`&${componentCls}-list-overflow-ping-end ${componentCls}-list-prev-btn`]: {
          opacity: 1,
          pointerEvents: 'auto',
        },
        [`&${componentCls}-list-overflow-ping-start ${componentCls}-list-next-btn`]: {
          opacity: 1,
          pointerEvents: 'auto',
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'FileCard'> = () => ({});

export default genStyleHooks<'FileCard'>(
  'FileCard',
  (token) => {
    const FileCardToken = mergeToken<FileCardToken>(token, {});
    return [genFileCardStyle(FileCardToken), genFileCardListStyle(FileCardToken)];
  },
  prepareComponentToken,
);
