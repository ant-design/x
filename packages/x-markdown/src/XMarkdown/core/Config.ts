import { MarkedOptions } from 'marked';
import type { XMarkdownProps } from '../interface';
import Renderer from './Renderer';

const nonSelfCloseHtml = ['div', 'p', 'span', 'table', 'section', 'article'];

// match nonSelfClose as a token
const createNonSelfClosingHtmlPlugins = (components: XMarkdownProps['components']) => {
  const XMLTags = [...nonSelfCloseHtml, ...Object.keys(components || {})];
  const XMLTag = XMLTags.join('|');

  return [
    {
      name: 'nonSelfClosingHtml',
      level: 'inline' as const,
      start(src: string) {
        return src.indexOf(`<(${XMLTag})>`);
      },
      tokenizer(src: string) {
        const rule = new RegExp(`^<(${XMLTag})(.*?)>(.*?)</(${XMLTag})>`, 'gi');
        const match = rule.exec(src);
        if (match) {
          return {
            type: 'nonSelfClosingHtml',
            raw: match[0],
            text: match[0],
            tag: match[1],
          };
        }
      },
    },
  ];
};

type MarkdownConfig = {
  extensions?: MarkedOptions['extensions'];
  XRenderer: Renderer;
  plugins: XMarkdownProps['plugins'];
} & XMarkdownProps['options'];

export const createMarkdownConfig = (
  options: XMarkdownProps['options'] = {},
  plugins: XMarkdownProps['plugins'] = [],
  components: XMarkdownProps['components'] = {},
  streaming: XMarkdownProps['streaming'] = { hasNextChunk: false },
): MarkdownConfig => {
  return {
    gfm: options?.gfm ?? true,
    break: options?.break,
    plugins: [...createNonSelfClosingHtmlPlugins(components), ...(plugins || [])],
    XRenderer: new Renderer({ components, streaming }),
  };
};
