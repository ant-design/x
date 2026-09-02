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
  approvalColor: string;
}

export interface ToolCallToken extends FullToken<'ToolCall'> {}

const genToolCallStyle: GenerateStyle<ToolCallToken> = (token) => {
  const { componentCls } = token;

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
      borderRadius: token.borderRadius,
      transition: `border-color ${token.motionDurationMid}`,

      [`${componentCls}-header`]: {
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr) auto',
        alignItems: 'center',
        gap: token.paddingXS,
        minHeight: token.controlHeightLG,
        padding: `${unit(token.paddingXS)} ${unit(token.paddingSM)}`,
        background: token.headerBg,
        transition: `background-color ${token.motionDurationMid}`,
      },

      [`${componentCls}-header${componentCls}-header-no-icon`]: {
        position: 'relative',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        [`${componentCls}-status`]: {
          position: 'absolute',
        },
      },

      [`${componentCls}-status`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: token.colorTextSecondary,
      },

      [`${componentCls}-status-icon`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: token.statusSize,
        height: token.statusSize,
        fontSize: token.fontSize,
        background: token.colorFillSecondary,
        borderRadius: token.borderRadius,
        transition: `color ${token.motionDurationMid}, background-color ${token.motionDurationMid}`,
      },

      [`${componentCls}-tool-icon`]: {
        overflow: 'hidden',
        color: token.colorTextSecondary,
        background: token.colorFillSecondary,
        '> img': {
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
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

      [`${componentCls}-separator`]: {
        marginInline: token.marginXXS,
      },

      [`${componentCls}-duration`]: {
        fontVariantNumeric: 'tabular-nums',
      },

      [`${componentCls}-actions`]: {
        display: 'flex',
        alignItems: 'center',
        gap: token.actionGap,
        [`${token.antCls}-btn`]: {
          flex: 'none',
          color: token.colorTextQuaternary,
          borderRadius: token.borderRadius,
          '&:hover': {
            color: token.colorText,
            background: token.colorFillSecondary,
          },
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
        gap: token.paddingSM,
        padding: token.paddingSM,
        borderTop: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
        background: token.detailBg,
      },

      [`${componentCls}-arguments, ${componentCls}-result, ${componentCls}-error`]: {
        minWidth: 0,
      },

      [`${componentCls}-approval`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: token.paddingSM,
        minWidth: 0,
        padding: token.paddingSM,
        background: token.colorWarningBg,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorWarningBorder}`,
        borderRadius: token.borderRadius,
      },

      [`${componentCls}-approval-copy`]: {
        minWidth: 0,
      },

      [`${componentCls}-approval-heading`]: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: token.marginXS,
        color: token.colorText,
        fontWeight: token.fontWeightStrong,
        [`> ${token.iconCls}`]: {
          color: token.approvalColor,
        },
      },

      [`${componentCls}-approval-description`]: {
        marginTop: token.marginXXS,
        color: token.colorTextSecondary,
        fontSize: token.fontSizeSM,
        lineHeight: token.lineHeight,
      },

      [`${componentCls}-approval-decision`]: {
        marginTop: token.marginXXS,
        color: token.colorTextSecondary,
        fontSize: token.fontSizeSM,
        fontWeight: token.fontWeightStrong,
      },

      [`${componentCls}-approval-actions`]: {
        display: 'flex',
        flex: 'none',
        alignItems: 'center',
        gap: token.marginXS,
      },

      [`${componentCls}-risk`]: {
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: token.controlHeightXS,
        paddingInline: token.paddingXS,
        color: token.colorTextSecondary,
        fontSize: token.fontSizeSM,
        fontWeight: 'normal',
        background: token.colorFill,
        borderRadius: token.borderRadiusXS,
      },

      [`${componentCls}-risk-medium`]: {
        color: token.colorWarningText,
        background: token.colorWarningBg,
      },

      [`${componentCls}-risk-high`]: {
        color: token.colorErrorText,
        background: token.colorErrorBg,
      },

      [`${componentCls}-section-title`]: {
        marginBottom: token.marginXXS,
        color: token.colorTextDescription,
        fontSize: token.fontSizeSM,
        fontWeight: token.fontWeightStrong,
      },

      [`${componentCls}-code`]: {
        boxSizing: 'border-box',
        maxHeight: token.contentMaxHeight,
        margin: 0,
        padding: `${unit(token.paddingXS)} ${unit(token.paddingSM)}`,
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
        borderRadius: token.borderRadiusSM,
      },

      [`${componentCls}-error`]: {
        padding: token.paddingSM,
        color: token.errorColor,
        background: token.colorErrorBg,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorErrorBorder}`,
        borderRadius: token.borderRadius,
        [`${componentCls}-section-title`]: {
          color: token.errorColor,
        },
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
        background: token.colorBgContainer,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorErrorBorder}`,
        borderRadius: token.borderRadiusSM,
      },

      [`&${componentCls}-completed ${componentCls}-status`]: {
        color: token.successColor,
        [`${componentCls}-status-icon`]: {
          background: token.colorSuccessBg,
        },
      },
      [`&${componentCls}-streaming ${componentCls}-status, &${componentCls}-running ${componentCls}-status`]:
        {
          color: token.runningColor,
          [`${componentCls}-status-icon`]: {
            background: token.colorPrimaryBg,
          },
        },
      [`&${componentCls}-approval-pending ${componentCls}-status`]: {
        color: token.approvalColor,
        [`${componentCls}-status-icon`]: {
          background: token.colorWarningBg,
        },
      },
      [`&${componentCls}-failed`]: {
        [`${componentCls}-status`]: {
          color: token.errorColor,
          [`${componentCls}-status-icon`]: {
            background: token.colorErrorBg,
          },
        },
      },
      [`&${componentCls}-cancelled ${componentCls}-status`]: {
        color: token.colorTextQuaternary,
        [`${componentCls}-status-icon`]: {
          background: token.colorFillTertiary,
        },
      },
      [`&${componentCls}-completed ${componentCls}-tool-icon`]: {
        color: token.colorTextSecondary,
        background: token.colorFillSecondary,
      },

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      [`@media (max-width: ${unit(token.screenXS)})`]: {
        [`${componentCls}-header`]: {
          paddingInline: token.paddingSM,
        },
        [`${componentCls}-details`]: {
          padding: token.paddingSM,
        },
        [`${componentCls}-approval`]: {
          alignItems: 'stretch',
          flexDirection: 'column',
          padding: token.paddingSM,
        },
        [`${componentCls}-approval-actions`]: {
          justifyContent: 'flex-end',
          [`${token.antCls}-btn`]: {
            minWidth: 88,
          },
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'ToolCall'> = (token) => ({
  headerBg: token.colorFillQuaternary,
  detailBg: token.colorBgContainer,
  statusSize: token.controlHeightSM,
  actionGap: token.marginXXS,
  contentMaxHeight: 320,
  errorColor: token.colorError,
  successColor: token.colorSuccess,
  runningColor: token.colorPrimary,
  approvalColor: token.colorWarning,
});

export default genStyleHooks<'ToolCall'>(
  'ToolCall',
  (token) => {
    const toolCallToken = mergeToken<ToolCallToken>(token, {});
    return [genToolCallStyle(toolCallToken)];
  },
  prepareComponentToken,
);
