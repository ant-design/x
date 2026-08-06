import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { genCollapseMotion } from '../../style';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/interface';

export interface ComponentToken {
  headerBg: string;
  detailBg: string;
  statusSize: number;
  progressWidth: number;
  successColor: string;
  runningColor: string;
  errorColor: string;
}

export interface TaskToken extends FullToken<'Task'> {}

const genTaskStyle: GenerateStyle<TaskToken> = (token) => {
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

      [`${componentCls}-header`]: {
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr) auto',
        alignItems: 'center',
        gap: `${unit(token.marginXS)} ${unit(token.paddingSM)}`,
        minHeight: token.controlHeightLG,
        padding: `${unit(token.paddingSM)} ${unit(token.padding)}`,
        background: token.headerBg,
      },

      [`${componentCls}-status`]: {
        position: 'relative',
        alignSelf: 'start',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: token.statusSize,
        height: token.controlHeightSM,
        color: token.colorTextSecondary,
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

      [`${componentCls}-summary`]: { minWidth: 0 },
      [`${componentCls}-title`]: {
        minWidth: 0,
        overflowWrap: 'anywhere',
        fontWeight: token.fontWeightStrong,
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

      [`${componentCls}-actions`]: {
        display: 'flex',
        alignItems: 'center',
        gap: token.marginXXS,
      },
      [`${componentCls}-expand`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: token.controlHeightSM,
        height: token.controlHeightSM,
        padding: 0,
        color: token.colorTextSecondary,
        font: 'inherit',
        cursor: 'pointer',
        background: 'transparent',
        border: 0,
        borderRadius: token.borderRadiusSM,
        transition: `background ${token.motionDurationMid}`,
        '&:hover': { background: token.colorFillTertiary },
        '&:focus-visible': { outline: `${unit(token.lineWidthBold)} solid ${token.colorPrimary}` },
        '.anticon': {
          transition: `transform ${token.motionDurationMid} ${token.motionEaseInOut}`,
        },
      },
      [`${componentCls}-expand-open .anticon`]: { transform: 'rotate(180deg)' },

      [`${componentCls}-progress`]: {
        gridColumn: '2 / -1',
        display: 'grid',
        gridTemplateColumns: `minmax(0, ${unit(token.progressWidth)}) auto`,
        alignItems: 'center',
        gap: token.marginXS,
        [`${token.antCls}-progress`]: { lineHeight: 1 },
      },
      [`${componentCls}-progress-text`]: {
        minWidth: '3ch',
        color: token.colorTextDescription,
        fontSize: token.fontSizeSM,
        fontVariantNumeric: 'tabular-nums',
        textAlign: 'end',
      },

      [`${componentCls}-details`]: {
        display: 'grid',
        gap: token.padding,
        padding: token.padding,
        background: token.detailBg,
        borderTop: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
      },
      [`${componentCls}-details-hidden`]: { display: 'none' },
      [`${componentCls}-section-title`]: {
        marginBottom: token.marginXS,
        color: token.colorTextSecondary,
        fontSize: token.fontSizeSM,
        fontWeight: token.fontWeightStrong,
      },
      [`${componentCls}-code`]: {
        boxSizing: 'border-box',
        maxHeight: 240,
        margin: 0,
        padding: `${unit(token.paddingSM)} ${unit(token.padding)}`,
        overflow: 'auto',
        fontFamily: token.fontFamilyCode,
        fontSize: token.fontSizeSM,
        lineHeight: 1.65,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        background: token.colorFillQuaternary,
        borderRadius: token.borderRadius,
      },
      [`${componentCls}-error`]: {
        paddingInlineStart: token.paddingSM,
        color: token.errorColor,
        borderInlineStart: `${unit(calc(token.lineWidth).mul(2).equal())} solid ${token.errorColor}`,
      },
      [`${componentCls}-error-message`]: { fontWeight: token.fontWeightStrong },
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
      [`${componentCls}-reason`]: { color: token.colorTextDescription },

      [`&${componentCls}-running ${componentCls}-status`]: { color: token.runningColor },
      [`&${componentCls}-completed ${componentCls}-status`]: { color: token.successColor },
      [`&${componentCls}-failed`]: {
        borderColor: token.colorErrorBorder,
        [`${componentCls}-status`]: { color: token.errorColor },
      },
      [`&${componentCls}-cancelled ${componentCls}-status`]: {
        color: token.colorTextQuaternary,
      },
      [`&${componentCls}-rtl`]: { direction: 'rtl' },

      [`@media (max-width: ${unit(token.screenXS)})`]: {
        [`${componentCls}-header`]: { paddingInline: token.paddingSM },
        [`${componentCls}-progress`]: {
          gridColumn: '1 / -1',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
        },
        [`${componentCls}-details`]: { padding: token.paddingSM },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Task'> = (token) => ({
  headerBg: token.colorFillQuaternary,
  detailBg: token.colorBgContainer,
  statusSize: token.fontSizeLG,
  progressWidth: 240,
  successColor: token.colorSuccess,
  runningColor: token.colorPrimary,
  errorColor: token.colorError,
});

export default genStyleHooks<'Task'>(
  'Task',
  (token) => {
    const taskToken = mergeToken<TaskToken>(token, {});
    return [genTaskStyle(taskToken), genCollapseMotion(taskToken)];
  },
  prepareComponentToken,
);
