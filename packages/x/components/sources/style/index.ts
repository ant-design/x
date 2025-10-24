import { mergeToken } from '@ant-design/cssinjs-utils';
import { genCollapseMotion } from '../../style/motion';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface SourcesToken extends FullToken<'Sources'> {}

const genSourcesStyle: GenerateStyle<SourcesToken> = (token) => {
  const {
    componentCls,
    paddingXS,
    fontSizeSM,
    marginXXS,
    marginXS,
    marginSM,
    colorTextSecondary,
    colorText,
    fontSize,
    colorLink,
    lineHeight,
    colorFillSecondary,
    controlHeightXS,
    paddingXXS,
    calc,
  } = token;

  return {
    [componentCls]: {
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
        marginBottom: marginSM,
      },

      '&-title-down-icon': {
        fontSize: fontSizeSM,
        svg: {
          transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        },
      },

      '&-icon-position-end': {
        [`${componentCls}-title-down-icon`]: {
          order: 1,
        },
      },

      '&-list-item': {
        marginBottom: marginXS,
      },

      '&-link': {
        color: colorText,
        display: 'flex',
        gap: marginXXS,

        '&:hover': {
          color: colorLink,
        },
      },

      '&-inline': {
        display: 'inline-flex',

        [`${componentCls}-title-wrapper`]: {
          background: colorFillSecondary,
          borderRadius: calc(controlHeightXS).div(2).equal(),
          height: controlHeightXS,
          lineHeight: controlHeightXS,
          fontSize: calc(fontSizeSM).sub(2).equal(),
          color: colorTextSecondary,
          fontWeight: 400,
          paddingInline: calc(paddingXXS).add(2).equal(),
          paddingBlock: 0,
          marginInline: marginXXS,
          marginBlock: 0,
        },
      },

      '&-carousel-title': {
        display: 'flex',
        justifyContent: 'space-between',
      },

      '&-carousel-btn': {
        display: 'inline-flex',
        cursor: 'pointer',
        height: token.controlHeight,
        borderRadius: token.borderRadius,
        paddingInline: paddingXS,
        transition: `background ${token.motionDurationMid} ${token.motionEaseInOut}`,
        [`&:not(${componentCls}-carousel-btn-disabled):hover`]: {
          background: colorFillSecondary,
        },
      },

      '&-carousel-btn-disabled': {
        opacity: 0.4,
        cursor: 'text',
      },

      '&-carousel-item': {
        padding: paddingXS,
        boxSizing: 'border-box',
        fontSize: fontSize,
        lineHeight: lineHeight,
        cursor: 'pointer',

        '&-title-wrapper': {
          gridGap: marginXXS,
          display: 'flex',
        },

        '&-description': {
          opacity: 0.8,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
          textOverflow: 'ellipsis',
        },
      },

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Sources'> = () => ({});

export default genStyleHooks<'Sources'>(
  'Sources',
  (token) => {
    const SourcesToken = mergeToken<SourcesToken>(token, {});
    return [genSourcesStyle(SourcesToken), genCollapseMotion(SourcesToken)];
  },
  prepareComponentToken,
);
