export type PluginsType = {
  /**
   * @desc 渲染数学公式Latex语法。
   * @descEN Rendering mathematical formulas using Latex syntax.
   */
  Latex: () => any;
  /**
   * @desc 渲染代码高亮。
   * @descEN Highlight the rendering code.
   */
  HighlightCode: () => any;
  /**
   * @desc 渲染 Mermaid 图表。
   * @descEN Rendering the Mermaid Chart.
   */
  Mermaid: () => any;
};
