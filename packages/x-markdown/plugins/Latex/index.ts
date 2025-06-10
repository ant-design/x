import katex from 'katex';

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

function inlineKatex(options: IOptions, renderer: IRender) {
  const ruleReg = inlineRuleNonStandard;
  return {
    name: 'inlineKatex',
    level: 'inline' as ILevel,
    start(src: string) {
      const standardIndex = src.indexOf('$');
      const nonStandardIndex = src.indexOf('\\(');

      if (standardIndex === -1 && nonStandardIndex === -1) {
        return;
      }

      const katexIndex = Math.min(
        standardIndex === -1 ? Infinity : standardIndex,
        nonStandardIndex === -1 ? Infinity : nonStandardIndex,
      );

      const possibleKatex = src.substring(katexIndex);
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

function blockKatex(options: IOptions, renderer: IRender) {
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

export default function (options = {}) {
  return {
    extensions: [
      inlineKatex(options, createRenderer(options, false)),
      blockKatex(options, createRenderer(options, true)),
    ],
  };
}
