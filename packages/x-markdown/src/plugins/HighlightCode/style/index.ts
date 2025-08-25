import { mergeToken } from '@ant-design/cssinjs-utils';
import type { GenerateStyle } from 'antd/es/theme/internal';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken } from '../../theme/useToken';

export interface ComponentToken {}

export interface HighlightCodeToken extends FullToken<'HighlightCode'> {}

const genHighlightCodeStyle: GenerateStyle<HighlightCodeToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      '&-header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: token.colorFillContent,
        padding: token.paddingSM,
        borderTopLeftRadius: token.borderRadius,
        borderTopRightRadius: token.borderRadius,
      },
      '&-code': {
        border: '1px solid',
        borderColor: token.colorBorderSecondary,
        borderBottomRightRadius: token.borderRadius,
        borderBottomLeftRadius: token.borderRadius,
        background: 'transparent',
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export default genStyleHooks<'HighlightCode'>('HighlightCode', (token) => {
  const highlightCodeToken = mergeToken<HighlightCodeToken>(token, {});
  return [genHighlightCodeStyle(highlightCodeToken)];
});
