import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface PromptsToken extends FullToken<'Prompts'> {}

const genPromptsStyle: GenerateStyle<PromptsToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      maxWidth: '100%',

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
      [`& ${componentCls}-title`]: {},
      [`& ${componentCls}-list`]: {
        display: 'flex',
        gap: token.paddingSM,
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        listStyle: 'none',
        paddingInlineStart: 0,
        marginBlock: 0,

        '&-wrap': {
          flexWrap: 'wrap',
        },
        '&-vertical': {
          flexDirection: 'column',
        },
      },

      // ========================= item =========================
      [`& ${componentCls}-item`]: {
        display: 'flex',
        gap: token.paddingSM,
        height: 'auto',
        padding: token.paddingSM,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderRadius: token.borderRadiusLG,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,

        [`& ${componentCls}-content`]: {
          display: 'inline-flex',
          gap: token.paddingXS,
          flexDirection: 'column',
          alignItems: 'flex-start',
        },
      },
    },
  };
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
