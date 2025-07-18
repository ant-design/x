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
    marginXS,
    colorTextDescription,
    colorTextLabel,
    fontSize,
    fontSizeSM,
    colorTextBase,
    motionDurationSlow,
    colorTextLightSolid,
  } = token;
  console.log('token', token);

  return {
    [componentCls]: {
      display: 'flex',

      [`${componentCls}-file`]: {
        display: 'flex',
        alignItems: 'flex-start',
        padding: `${paddingSM} ${padding}`,
        cursor: 'pointer',
        backgroundColor: colorFillTertiary,
        borderRadius: 12,
        position: 'relative',
        overflow: 'hidden',

        [`${componentCls}-file-icon`]: {
          width: 36,
          height: 36,
          fontSize: 36,
          marginInlineEnd: marginSM,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },

        [`${componentCls}-file-content`]: {
          flex: 1,
          maxWidth: 275,

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
          },
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

      [`${componentCls}-image`]: {
        width: 200,
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
      },

      [`${componentCls}-video`]: {
        width: 548,
        height: 308,
        borderRadius: 12,
      },

      [`${componentCls}-audio`]: {
        width: 300,
      },

      '&-list': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        gap: 8,

        [`${componentCls}-list-item`]: {
          width: '32%',
          display: 'flex',
          position: 'relative',

          '&:hover': {
            [`${componentCls}-list-remove`]: {
              opacity: 1,
            },
          },
        },

        [componentCls]: {
          flex: 1,
          display: 'block',
        },

        [`${componentCls}-list-remove`]: {
          position: 'absolute',
          top: 0,
          insetInlineEnd: 0,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 16,
          height: 16,
          color: colorTextLabel,
          opacity: 0,
          cursor: 'pointer',
        },
      },

      '&-list-small-size': {
        [`${componentCls}-file`]: {
          borderRadius: 8,

          [`${componentCls}-file-icon`]: {
            width: 20,
            height: 20,
            fontSize: 20,
            marginInlineEnd: marginXS,
          },

          [`${componentCls}-file-description`]: {
            display: 'none',
          },
        },

        [`${componentCls}-list-remove`]: {
          fontSize: 14,
          width: 14,
          height: 14,
        },

        [`${componentCls}-image`]: {
          width: 100,
          height: 100,
        },
      },

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'FileCard'> = () => ({});

export default genStyleHooks<'FileCard'>(
  'FileCard',
  (token) => {
    const FileCardToken = mergeToken<FileCardToken>(token, {});
    return [genFileCardStyle(FileCardToken)];
  },
  prepareComponentToken,
);
