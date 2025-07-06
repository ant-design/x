import katex from 'katex';
import { PluginsType } from '..';

const inlineRuleNonStandard = /^(?:\${1,2}([^$\n]+?)\${1,2}|\\\((.+?)\\\))/;
const blockRule = /^(\${1,2})\n([\s\S]+?)\n\1(?:\n|$)|^\\\[((?:\\.|[^\\])+?)\\\]/;

type IOptions = {
  nonStandard?: boolean;
  [key: string]: unknown;
};

type IToken = {
  text: string;
  displayMode: boolean;
};

type IRender = (token: IToken) => string;

type ILevel = 'inline' | 'block';

// fix katex 不支持渲染 align*: https://github.com/KaTeX/KaTeX/issues/1007
function replaceAlign(text: string) {
  return text ? text.replace(/\{align\*\}/g, '{aligned}') : text;
}

function createRenderer(options: IOptions, newlineAfter: boolean) {
  return (token: IToken) =>
    katex.renderToString(token.text, {
      ...options,
      displayMode: token.displayMode,
    }) + (newlineAfter ? '\n' : '');
}

function inlineKatex(renderer: IRender) {
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
        const text = replaceAlign((match[1] || match[2]).trim());
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

function blockKatex(renderer: IRender) {
  return {
    name: 'blockKatex',
    level: 'block' as ILevel,
    tokenizer(src: string) {
      const match = src.match(blockRule);
      if (match) {
        const text = replaceAlign(match[2] || match[3].trim());
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

const Latex: PluginsType['Latex'] = (options = { output: 'mathml' }) => {
  return [inlineKatex(createRenderer(options, false)), blockKatex(createRenderer(options, true))];
};

export default Latex;
