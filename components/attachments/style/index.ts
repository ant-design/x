import { unit } from '@ant-design/cssinjs';
import { mergeToken } from '@ant-design/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface AttachmentsToken extends FullToken<'Attachments'> {}

const genAttachmentsStyle: GenerateStyle<AttachmentsToken> = (token) => {
  const { componentCls } = token;

  const dropAreaCls = `${componentCls}-drop-area`;
  const placeholderCls = `${componentCls}-placeholder`;

  return {
    // ============================== Full Screen ==============================
    [dropAreaCls]: {
      position: 'absolute',
      inset: 0,
      zIndex: token.zIndexPopupBase,
    },

    // ============================== Placeholder ==============================
    [placeholderCls]: {
      width: '100%',
      height: '100%',
      background: token.colorBgBlur,
      backdropFilter: 'blur(10px)',

      [`${placeholderCls}-icon`]: {
        fontSize: token.fontSizeHeading1,
        lineHeight: 1,
      },
      [`${placeholderCls}-title${placeholderCls}-title`]: {
        margin: 0,
      },
      [`${placeholderCls}-description`]: {},
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Attachments'> = () => ({});

export default genStyleHooks(
  'Attachments',
  (token) => {
    const compToken = mergeToken<AttachmentsToken>(token, {});
    return genAttachmentsStyle(compToken);
  },
  prepareComponentToken,
);
