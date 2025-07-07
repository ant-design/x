import { PluginsType } from '../interface';
import katex, { type KatexOptions } from 'katex';

const inlineRuleNonStandard = /^(?:\${1,2}([^$\n]+?)\${1,2}|\\\((.+?)\\\))/;
const blockRule = /^(\${1,2})\n([\s\S]+?)\n\1(?:\n|$)|^\\\[((?:\\.|[^\\])+?)\\\]/;

type Options = {
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
  const ruleReg = inlineRuleNonStandard;
  return {
    name: 'inlineKatex',
    level: 'inline' as ILevel,
    start(src: string) {
      if (!src.includes('$') && !src.includes('\\(')) return;

      const indices = [src.indexOf('$'), src.indexOf('\\(')].filter((idx) => idx !== -1);

      if (indices.length === 0) return;

      const katexIndex = Math.min(...indices);
      const possibleKatex = src.slice(katexIndex);

      if (possibleKatex.match(ruleReg)) {
        return katexIndex;
      }
    },
    tokenizer(src: string) {
      const match = src.match(inlineRuleNonStandard);
      if (match) {
        let text = (match[1] || match[2]).trim();
        if (replaceAlignStart) {
          text = replaceAlign(text);
        }
        return {
          type: 'inlineKatex',
          raw: match[0],
          text,
          displayMode: false,
        };
      }
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

const Latex: PluginsType['Latex'] = (options?: Options) => {
  const { replaceAlignStart = false, katexOptions = { output: 'mathml' } } = options || {};

  const inlineRenderer = createRenderer(katexOptions, false);
  const blockRenderer = createRenderer(katexOptions, true);
  return [
    inlineKatex(inlineRenderer, replaceAlignStart),
    blockKatex(blockRenderer, replaceAlignStart),
  ];
};

export default Latex;
