import type { KatexOptions } from 'katex';
import type { TokenizerAndRendererExtension } from 'marked';

export type LatexOption = {
  katexOptions?: KatexOptions;
  replaceAlignStart?: boolean;
};

export type MarkdownComponentsConfig = {};

export type PluginsType = {
  /**
   * @desc 渲染数学公式Latex语法。
   * @descEN Rendering mathematical formulas using Latex syntax.
   */
  Latex: (options?: LatexOption) => TokenizerAndRendererExtension[];
};
