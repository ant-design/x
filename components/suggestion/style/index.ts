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
  const {
    componentCls,
    paddingXS,
    paddingXXS,
    boxShadowSecondary,
    borderRadius,
    colorInfoBg,
    fontSize,
    controlHeight,
  } = token;
  return {
    [componentCls]: {
      position: 'relative',
      display: 'flex',
      width: '100%',

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },

    [`${componentCls}-input`]: {
      width: '100%',
    },

    [`${componentCls}-container`]: {
      [`${componentCls}-item`]: {
        borderRadius,
        cursor: 'pointer',
        padding: paddingXS,
        background: 'transparent',

        [`&-active`]: {
          background: colorInfoBg,
        },

        [`&-item-icon`]: {
          width: controlHeight,
        },
        [`&-item-label`]: {
          width: controlHeight,
          fontSize,
        },
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
