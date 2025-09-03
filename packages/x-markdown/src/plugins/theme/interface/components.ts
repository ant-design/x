type HighlightCodeToken = {
  /**
   * @desc 标题背景颜色
   * @descEN Title background color
   */
  colorBgTitle: string;
  /**
   * @desc 标题文本颜色
   * @descEN Title text color
   */
  colorTextTitle: string;
  /**
   * @desc 代码块边框颜色
   * @descEN Code block border color
   */
  colorBorderCode: string;
};

type MermaidToken = {
  /**
   * @desc 标题背景颜色
   * @descEN Title background color
   */
  colorBgTitle: string;

  /**
   * @desc 标题文本颜色
   * @descEN Title text color
   */
  colorTextTitle: string;

  /**
   * @desc 代码块边框颜色
   * @descEN Code block border color
   */
  colorBorderCode: string;

  /**
   * @desc 图表边框颜色
   * @descEN Graph border color
   */
  colorBorderGraph: string;
};

export interface ComponentTokenMap {
  Mermaid: MermaidToken;
  HighlightCode: HighlightCodeToken;
}
