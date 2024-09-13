import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';

export interface ComponentToken {
  //
}

interface SuggestionToken extends FullToken<'Suggestion'> {}

const genSuggestionStyle: GenerateStyle<SuggestionToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      // Cascader
      [`${componentCls}-item`]: {
        '&-extra': {
          marginInlineStart: token.padding,
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Suggestion'> = () => ({});

export default genStyleHooks<'Suggestion'>(
  'Suggestion',
  (token) => {
    const SuggestionToken = mergeToken<SuggestionToken>(token, {});
    return genSuggestionStyle(SuggestionToken);
  },
  prepareComponentToken,
);
