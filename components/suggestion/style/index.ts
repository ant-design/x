import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';

export interface ComponentToken {
  //
}

interface SuggestionToken extends FullToken<'Suggestion'> {
  SuggestionContentMaxWidth: number | string;
}

const genSuggestionStyle: GenerateStyle<SuggestionToken> = (token) => {
  const { componentCls, paddingXS, paddingXXS, boxShadowSecondary } = token;
  return {
    [componentCls]: {
      position: 'relative',
      display: 'flex',
      width: '100%',

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      [`& ${componentCls}-actions-list`]: {
        position: 'absolute',
        zIndex: 1,
        insetInlineEnd: paddingXXS,
        bottom: `${paddingXS - paddingXXS}px`,
      },

      [`& ${componentCls}-actions-btn`]: {},
      [`& ${componentCls}-input`]: {
        position: 'sticky',
        fontSize: token.fontSize,
        bottom: 0,
        boxShadow: boxShadowSecondary,
        paddingTop: paddingXS,
        paddingBottom: paddingXS,
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Suggestion'> = () => ({});

export default genStyleHooks<'Suggestion'>(
  'Suggestion',
  (token) => {
    const { paddingXS, calc } = token;
    const SuggestionToken = mergeToken<SuggestionToken>(token, {
      SuggestionContentMaxWidth: `calc(100% - ${unit(calc(paddingXS).add(32).equal())})`,
    });
    return genSuggestionStyle(SuggestionToken);
  },
  prepareComponentToken,
);
