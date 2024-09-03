import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';

export interface ComponentToken {
  //
}

interface SenderToken extends FullToken<'Sender'> {
  SenderContentMaxWidth: number | string;
}

const genSenderStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, paddingXS, paddingXXS, boxShadowSecondary, calc } = token;
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
        bottom: calc(paddingXS).sub(paddingXXS).equal(),
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

export const prepareComponentToken: GetDefaultToken<'Sender'> = () => ({});

export default genStyleHooks<'Sender'>(
  'Sender',
  (token) => {
    const { paddingXS, calc } = token;
    const SenderToken = mergeToken<SenderToken>(token, {
      SenderContentMaxWidth: `calc(100% - ${unit(calc(paddingXS).add(32).equal())})`,
    });
    return genSenderStyle(SenderToken);
  },
  prepareComponentToken,
);
