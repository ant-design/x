import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface MessageToken extends FullToken<'Message'> {}

const genMessageStyle: GenerateStyle<MessageToken> = (token) => {
  const {
    componentCls,
    colorFillSecondary,
    fontSizeSM,
    controlHeightXS,
    paddingXXS,
    paddingXS,
    marginXXS,
    marginSM,
    marginXS,
    colorTextSecondary,
    colorTextDescription,
    colorText,
    colorLink,
    fontSize,
    fontSizeHeading4,
    lineHeight,
    colorBorder,
    lineWidth,
    calc,
  } = token;

  return {
    [componentCls]: {
      display: 'block',

      [`${componentCls}-sup`]: {
        display: 'inline-block',
        background: colorFillSecondary,
        borderRadius: calc(controlHeightXS).div(2).equal(),
        height: controlHeightXS,
        lineHeight: controlHeightXS,
        fontSize: calc(fontSizeSM).sub(2).equal(),
        color: colorTextSecondary,
        fontWeight: 400,
        padding: `0 ${calc(paddingXXS).add(2).equal()}`,
        margin: `0 ${marginXXS}`,
      },

      [`${componentCls}-think`]: {
        '&-title-wrapper': {
          width: 'fit-content',
          display: 'flex',
          flexDirection: 'row',
          gridGap: paddingXS,
          alignItems: 'center',
          fontSize: fontSize,
          color: colorTextSecondary,
          lineHeight: lineHeight,
          cursor: 'pointer',
        },

        '&-logo': {
          fontSize: fontSizeHeading4,
        },

        '&-content': {
          marginTop: '12px',
          width: '100%',
          color: colorTextDescription,
          whiteSpace: 'pre-wrap',
          paddingLeft: '12px',
          borderLeft: `2px solid ${colorBorder}`,
        },
      },

      [`${componentCls}-source`]: {
        '&-title-wrapper': {
          width: 'fit-content',
          display: 'flex',
          flexDirection: 'row',
          gridGap: paddingXS,
          alignItems: 'center',
          fontSize: fontSize,
          color: colorTextSecondary,
          lineHeight: lineHeight,
          cursor: 'pointer',
        },

        '&-content': {
          margin: `${marginSM} 0`,
        },

        '&-list-item': {
          marginTop: marginXS,
        },

        '&-link': {
          color: colorText,

          '&:hover': {
            color: colorLink,
          },
        },
      },

      [`${componentCls}-system`]: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: colorTextDescription,

        '&-content': {
          flexBasis: 'max-content',
          margin: `0 ${marginXS}`,
        },

        '&-divider': {
          flex: 1,
          border: 'none',
          borderTop: `${lineWidth} solid ${colorBorder}`,
        },

        '&-divider-double': {
          borderTop: `${calc(lineWidth).mul(4).equal()} double ${colorBorder}`,
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Message'> = () => ({});

export default genStyleHooks<'Message'>(
  'Message',
  (token) => {
    const MessageToken = mergeToken<MessageToken>(token, {});
    return [genMessageStyle(MessageToken)];
  },
  prepareComponentToken,
);
