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
    borderRadius,
    colorInfoBg,
    paddingContentHorizontal,
    fontWeightStrong,
    fontSizeIcon,
    fontSize,
  } = token;
  return {
    [componentCls]: {
      position: 'relative',
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
        display: 'flex',
        gap: paddingContentHorizontal / 2,
        flexDirection: 'row',

        [`&-icon`]: {
          width: fontSizeIcon,
        },
        [`&-label`]: {
          flex: 1,
          fontSize,
        },
        [`&-extra`]: {
          justifyContent: 'flex-end',
        },

        [`&-active`]: {
          background: colorInfoBg,
          [`${componentCls}-item-label`]: {
            fontWeight: fontWeightStrong,
          },
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
