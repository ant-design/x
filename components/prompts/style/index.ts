import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';

export interface ComponentToken {};

export interface PromptsToken extends FullToken<'Prompts'> {};

const genPromptsStyle: GenerateStyle<PromptsToken> = (token) => {

  const { componentCls } = token;

  return { [componentCls]: { } }
};

export const prepareComponentToken: GetDefaultToken<'Prompts'> = () => ({});

export default genStyleHooks(
  'Prompts',
  (token) => {
    const compToken = mergeToken<PromptsToken>(token, {});
    return genPromptsStyle(compToken);
  },
  prepareComponentToken,
);