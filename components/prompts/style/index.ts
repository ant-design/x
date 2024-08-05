import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';

export interface ComponentToken { };

export interface PromptsToken extends FullToken<'Prompts'> { };

const genPromptsStyle: GenerateStyle<PromptsToken> = (token) => {

  const { componentCls } = token;

  return {
    [componentCls]: {
      maxWidth: '100%',

      [`& ${componentCls}-item`]: {
        display: 'flex',
        gap: token.paddingSM,
        height: 'auto',
        padding: token.paddingSM,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderRadius: token.borderRadiusLG,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,

        [`& ${componentCls}-icon`]: {

        },
        [`& ${componentCls}-label`]: {
        },
        [`& ${componentCls}-desc`]: {

        },
      },
    },
  }
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