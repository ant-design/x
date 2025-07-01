import katex from 'katex';
const inlineRuleNonStandard = /^(?:\${1,2}([^$\n]+?)\${1,2}|\\\((.+?)\\\))/;
const blockRule = /^(\${1,2})\n([\s\S]+?)\n\1(?:\n|$)|^\\\[((?:\\.|[^\\])+?)\\\]/;
// fix katex 不支持渲染 align*: https://github.com/KaTeX/KaTeX/issues/1007
function replaceAlign(text) {
  return text ? text.replace(/\{align\*\}/g, '{aligned}') : text;
}
function createRenderer(options, newlineAfter) {
  return token => katex.renderToString(token.text, {
    ...options,
    displayMode: token.displayMode
  }) + (newlineAfter ? '\n' : '');
}
function inlineKatex(renderer) {
  const ruleReg = inlineRuleNonStandard;
  return {
    name: 'inlineKatex',
    level: 'inline',
    start(src) {
      if (!src.includes('$') && !src.includes('\\(')) return;
      const indices = [src.indexOf('$'), src.indexOf('\\(')].filter(idx => idx !== -1);
      if (indices.length === 0) return;
      const katexIndex = Math.min(...indices);
      const possibleKatex = src.slice(katexIndex);
      if (possibleKatex.match(ruleReg)) {
        return katexIndex;
      }
    },
    tokenizer(src) {
      const match = src.match(inlineRuleNonStandard);
      if (match) {
        const text = replaceAlign((match[1] || match[2]).trim());
        return {
          type: 'inlineKatex',
          raw: match[0],
          text,
          displayMode: false
        };
      }
    },
    renderer
  };
}
function blockKatex(renderer) {
  return {
    name: 'blockKatex',
    level: 'block',
    tokenizer(src) {
      const match = src.match(blockRule);
      if (match) {
        const text = replaceAlign(match[2] || match[3].trim());
        return {
          type: 'blockKatex',
          raw: match[0],
          text,
          displayMode: true
        };
      }
    },
    renderer
  };
}
export default function (options = {
  output: 'mathml'
}) {
  return [inlineKatex(createRenderer(options, false)), blockKatex(createRenderer(options, true))];
}