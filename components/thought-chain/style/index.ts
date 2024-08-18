import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';

export interface ComponentToken {}

export interface ThoughtChainToken extends FullToken<'ThoughtChain'> {}

const genThoughtChainStyle: GenerateStyle<ThoughtChainToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
      [`& ${componentCls}-item`]: {
        
        [`& ${componentCls}-item-title`]: {
        padding: 0,
        
        },
        [`& ${componentCls}-item-desc`]: {
        
        
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'ThoughtChain'> = () => ({});

export default genStyleHooks(
  'ThoughtChain',
  (token) => {
    const compToken = mergeToken<ThoughtChainToken>(token, {});
    return genThoughtChainStyle(compToken);
  },
  prepareComponentToken,
);
