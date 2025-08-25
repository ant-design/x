import { mergeToken } from '@ant-design/cssinjs-utils';
import type { GenerateStyle } from 'antd/es/theme/internal';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken } from '../../theme/useToken';

export interface ComponentToken {}

export interface MermaidToken extends FullToken<'Mermaid'> {}

const genMermaidStyle: GenerateStyle<MermaidToken> = (token) => {
  const { componentCls } = token;

  console.log('token', token);

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
      '&-graph': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        borderColor: token.colorBorderSecondary,
        borderTop: 0,
        padding: token.paddingSM,
        overflow: 'auto',
        minHeight: 200,
        borderBottomRightRadius: token.borderRadius,
        borderBottomLeftRadius: token.borderRadius,
      },
      '&-graph-hidden': {
        display: 'none',
      },
      '&-graph svg': {
        maxWidth: '100%',
        height: 'auto',
      },
      '&-code': {
        border: '1px solid',
        borderColor: token.colorBorderSecondary,
        borderBottomRightRadius: token.borderRadius,
        borderBottomLeftRadius: token.borderRadius,
        background: 'transparent',
        borderTop: 0,
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export default genStyleHooks<'Mermaid'>('Mermaid', (token) => {
  const mermaidToken = mergeToken<MermaidToken>(token, {});
  return [genMermaidStyle(mermaidToken)];
});
