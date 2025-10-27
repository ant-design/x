import katex, { type KatexOptions } from 'katex';
import { TokenizerAndRendererExtension } from 'marked';

import 'katex/dist/katex.min.css';

const inlineRuleNonStandard =
  /^(?:\${1,2}([^$]{1,10000}?)\${1,2}|\\\(([\s\S]{1,10000}?)\\\)|\\\[((?:\\.|[^\\]){1,10000}?)\\\])/;
const blockRule = /^(\${1,2})\n([\s\S]{1,10000}?)\n\1(?:\n|$)|^\\\[((?:\\.|[^\\]){1,10000}?)\\\]/;

type LatexOption = {
  katexOptions?: KatexOptions;
  replaceAlignStart?: boolean;
};

type Token = {
  text: string;
  displayMode: boolean;
};

type Render = (token: Token) => string;

type ILevel = 'inline' | 'block';

// fix katex not support align*: https://github.com/KaTeX/KaTeX/issues/1007
function replaceAlign(text: string) {
  return text ? text.replace(/\{align\*\}/g, '{aligned}') : text;
}

function createRenderer(options: KatexOptions, newlineAfter: boolean) {
  return (token: Token) =>
    katex.renderToString(token.text, {
      ...options,
      displayMode: token.displayMode,
    }) + (newlineAfter ? '\n' : '');
}

function inlineKatex(renderer: Render, replaceAlignStart: boolean) {
  return {
    name: 'inlineKatex',
    level: 'inline' as ILevel,
    start(src: string) {
      const dollarIndex = src.indexOf('$');
      const parenIndex = src.indexOf('\\(');
      const bracketIndex = src.indexOf('\\[');

      const indices = [dollarIndex, parenIndex, bracketIndex].filter((idx) => idx !== -1);
      return indices.length > 0 ? Math.min(...indices) : undefined;
    },
    tokenizer(src: string) {
      const match = src.match(inlineRuleNonStandard);
      if (!match) return;

      const rawText = (match[1] || match[2] || match[3] || '').trim();
      const text = replaceAlignStart ? replaceAlign(rawText) : rawText;

      return {
        type: 'inlineKatex',
        raw: match[0],
        text,
        displayMode: false,
      };
    },
    renderer,
  };
}

function blockKatex(renderer: Render, replaceAlignStart: boolean) {
  return {
    name: 'blockKatex',
    level: 'block' as ILevel,
    tokenizer(src: string) {
      const match = src.match(blockRule);
      if (match) {
        let text = replaceAlign(match[2] || match[3].trim());
        if (replaceAlignStart) {
          text = replaceAlign(text);
        }
        return {
          type: 'blockKatex',
          raw: match[0],
          text,
          displayMode: true,
        };
      }
    },
    renderer,
  };
}

const Latex = (options?: LatexOption): TokenizerAndRendererExtension[] => {
  const { replaceAlignStart = true, katexOptions = { output: 'html', throwOnError: false } } =
    options || {};

  const inlineRenderer = createRenderer(katexOptions, false);
  const blockRenderer = createRenderer(katexOptions, true);
  return [
    inlineKatex(inlineRenderer, replaceAlignStart),
    blockKatex(blockRenderer, replaceAlignStart),
  ];
};

export default Latex;
