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
      [`& ${componentCls}-title`]: {
        marginBlockStart: 0,
        fontWeight: 'normal',
        color: token.colorTextTertiary,
      },

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
        alignItems: 'stretch',

        '&-wrap': {
          flexWrap: 'wrap',
        },
        '&-vertical': {
          flexDirection: 'column',
          alignItems: 'flex-start',
        },
      },

      // ========================= item =========================
      [`${componentCls}-item`]: {
        flex: 'none',
        display: 'flex',
        gap: token.paddingXS,
        height: 'auto',
        paddingBlock: token.paddingSM,
        paddingInline: token.padding,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderRadius: token.borderRadiusLG,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,

        [`${componentCls}-content`]: {
          flex: 'auto',
          minWidth: 0,
          display: 'flex',
          gap: token.paddingXXS,
          flexDirection: 'column',
          alignItems: 'flex-start',

          [`${componentCls}-label, ${componentCls}-desc`]: {
            margin: 0,
            padding: 0,
            fontSize: token.fontSize,
            lineHeight: token.lineHeight,
            textAlign: 'start',
            whiteSpace: 'normal',
          },

          [`${componentCls}-label`]: {
            color: token.colorTextHeading,
            fontWeight: 500,
          },

          [`${componentCls}-label + ${componentCls}-desc`]: {
            color: token.colorTextTertiary,
          },
        },

        // Disabled
        [`&${componentCls}-item-disabled`]: {
          [`${componentCls}-label, ${componentCls}-desc`]: {
            color: token.colorTextTertiary,
          },
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
