import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/interface';

export interface ComponentToken {
  headerBg: string;
  detailBg: string;
  statusSize: number;
  actionGap: number;
  contentMaxHeight: number;
  errorColor: string;
  successColor: string;
  runningColor: string;
}

export interface ToolCallToken extends FullToken<'ToolCall'> {}

const genToolCallStyle: GenerateStyle<ToolCallToken> = (token) => {
  const { componentCls, calc } = token;

  return {
    [componentCls]: {
      boxSizing: 'border-box',
      width: '100%',
      overflow: 'hidden',
      color: token.colorText,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      background: token.colorBgContainer,
      border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
      borderRadius: token.borderRadiusLG,
      transition: `border-color ${token.motionDurationMid}, box-shadow ${token.motionDurationMid}`,

      '&:hover': {
        borderColor: token.colorBorder,
      },

      [`${componentCls}-header`]: {
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr) auto',
        alignItems: 'center',
        gap: token.paddingSM,
        minHeight: token.controlHeightLG,
        padding: `${unit(token.paddingSM)} ${unit(token.padding)}`,
        background: token.headerBg,
      },

      [`${componentCls}-status`]: {
        alignSelf: 'start',
        display: 'inline-flex',
        alignItems: 'center',
        gap: token.marginXXS,
        minHeight: token.controlHeightSM,
        color: token.colorTextSecondary,
      },

      [`${componentCls}-status-icon`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: token.statusSize,
        height: token.statusSize,
        fontSize: token.statusSize,
      },

      [`${componentCls}-status-text`]: {
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      },

      [`${componentCls}-summary`]: {
        minWidth: 0,
      },

      [`${componentCls}-name`]: {
        display: 'flex',
        alignItems: 'center',
        gap: token.marginXS,
        minWidth: 0,
        overflowWrap: 'anywhere',
        fontWeight: token.fontWeightStrong,
      },

      [`${componentCls}-attempt`]: {
        flex: 'none',
        color: token.colorTextDescription,
        fontSize: token.fontSizeSM,
        fontWeight: 'normal',
        fontVariantNumeric: 'tabular-nums',
      },

      [`${componentCls}-description`]: {
        minWidth: 0,
        marginTop: token.marginXXS,
        overflow: 'hidden',
        color: token.colorTextDescription,
        fontSize: token.fontSizeSM,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },

      [`${componentCls}-result-summary`]: {
        color: token.colorTextSecondary,
      },

      [`${componentCls}-actions`]: {
        display: 'flex',
        alignItems: 'center',
        gap: token.actionGap,
        [`${token.antCls}-btn`]: {
          flex: 'none',
        },
      },

      [`${componentCls}-expand .anticon`]: {
        transition: `transform ${token.motionDurationMid} ${token.motionEaseInOut}`,
      },

      [`${componentCls}-expand-open .anticon`]: {
        transform: 'rotate(180deg)',
      },

      [`${componentCls}-details`]: {
        display: 'grid',
        gap: token.padding,
        padding: token.padding,
        borderTop: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
        background: token.detailBg,
      },

      [`${componentCls}-arguments, ${componentCls}-result, ${componentCls}-error`]: {
        minWidth: 0,
      },

      [`${componentCls}-section-title`]: {
        marginBottom: token.marginXS,
        color: token.colorTextSecondary,
        fontSize: token.fontSizeSM,
        fontWeight: token.fontWeightStrong,
      },

      [`${componentCls}-code`]: {
        boxSizing: 'border-box',
        maxHeight: token.contentMaxHeight,
        margin: 0,
        padding: `${unit(token.paddingSM)} ${unit(token.padding)}`,
        overflow: 'auto',
        color: token.colorText,
        fontFamily: token.fontFamilyCode,
        fontSize: token.fontSizeSM,
        lineHeight: 1.65,
        overflowWrap: 'normal',
        whiteSpace: 'pre-wrap',
        wordBreak: 'normal',
        background: token.colorFillQuaternary,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
      },

      [`${componentCls}-error`]: {
        paddingInlineStart: token.paddingSM,
        color: token.errorColor,
        borderInlineStart: `${unit(calc(token.lineWidth).mul(2).equal())} solid ${token.errorColor}`,
      },

      [`${componentCls}-error-message`]: {
        fontWeight: token.fontWeightStrong,
      },

      [`${componentCls}-error-code`]: {
        display: 'inline-block',
        marginTop: token.marginXS,
        paddingInline: token.paddingXS,
        color: token.errorColor,
        fontFamily: token.fontFamilyCode,
        fontSize: token.fontSizeSM,
        background: token.colorErrorBg,
        borderRadius: token.borderRadiusSM,
      },

      [`&${componentCls}-completed ${componentCls}-status`]: {
        color: token.successColor,
      },
      [`&${componentCls}-streaming ${componentCls}-status, &${componentCls}-running ${componentCls}-status`]:
        {
          color: token.runningColor,
        },
      [`&${componentCls}-failed`]: {
        borderColor: token.colorErrorBorder,
        [`${componentCls}-status`]: { color: token.errorColor },
      },
      [`&${componentCls}-cancelled ${componentCls}-status`]: {
        color: token.colorTextQuaternary,
      },

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      [`@media (max-width: ${unit(token.screenXS)})`]: {
        [`${componentCls}-header`]: {
          gridTemplateColumns: 'auto minmax(0, 1fr)',
          paddingInline: token.paddingSM,
        },
        [`${componentCls}-actions`]: {
          gridColumn: '1 / -1',
          justifyContent: 'flex-end',
          marginTop: unit(calc(token.marginXXS).mul(-1).equal()),
        },
        [`${componentCls}-details`]: {
          padding: token.paddingSM,
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'ToolCall'> = (token) => ({
  headerBg: token.colorFillQuaternary,
  detailBg: token.colorBgContainer,
  statusSize: token.fontSizeLG,
  actionGap: token.marginXXS,
  contentMaxHeight: 320,
  errorColor: token.colorError,
  successColor: token.colorSuccess,
  runningColor: token.colorPrimary,
});

export default genStyleHooks<'ToolCall'>(
  'ToolCall',
  (token) => {
    const toolCallToken = mergeToken<ToolCallToken>(token, {});
    return [genToolCallStyle(toolCallToken)];
  },
  prepareComponentToken,
);
