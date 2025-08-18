import { mergeToken } from '@ant-design/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import type { GenerateStyle } from 'antd/es/theme/internal';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GetDefaultToken } from '../../theme/useToken';

export interface ComponentToken {
  /**
   * @desc 背景色
   * @descEN Code background color
   */
  codeHeaderBgColor: string;
  /**
   * @desc 内边距
   * @descEN Code padding
   */
  codePadding: number;
  /**
   * @desc 内边距
   * @descEN Code padding
   */
  codeBorderRadius: number;
}

export interface HighlightCodeToken extends FullToken<'HighlightCode'> {}

const genHighlightCodeStyle: GenerateStyle<HighlightCodeToken> = (token) => {
  const { componentCls, codeBorderRadius, codeHeaderBgColor, padding, codePadding } = token;

  return {
    [componentCls]: {
      '&-header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: codeHeaderBgColor,
        padding,
        paddingLeft: codePadding,
        borderTopLeftRadius: codeBorderRadius,
        borderTopRightRadius: codeBorderRadius,
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'HighlightCode'> = (token) => {
  const codeHeaderBgColor = new FastColor(token.colorBgLayout).toRgbString();
  const codePadding = token.paddingMD;
  const codeBorderRadius = token.borderRadius;

  return { codeHeaderBgColor, codePadding, codeBorderRadius };
};

export default genStyleHooks<'HighlightCode'>(
  'HighlightCode',
  (token) => {
    const highlightCodeToken = mergeToken<HighlightCodeToken>(token, {});
    return [genHighlightCodeStyle(highlightCodeToken)];
  },
  prepareComponentToken,
);
