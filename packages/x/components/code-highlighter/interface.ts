import type React from 'react';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';

type SemanticType = 'root' | 'header' | 'headerTitle' | 'code';

export interface CodeHighlighterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * @desc 代码语言类型
   * @descEN Code language type
   */
  lang?: string;
  /**
   * @desc 代码内容
   * @descEN Code content
   */
  children: string;
  /**
   * @desc 头部内容，为 null 时不显示头部
   * @descEN Header content, no header displayed when null
   */
  header?: React.ReactNode | null;
  /**
   * @desc 样式类名的前缀
   * @descEN Prefix for style classnames
   */
  prefixCls?: string;
  /**
   * @desc 根节点样式
   * @descEN Root node style
   */
  style?: React.CSSProperties;
  /**
   * @desc 语法高亮器的额外属性
   * @descEN Additional props for syntax highlighter
   */
  highlightProps?: Partial<SyntaxHighlighterProps>;
  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<SemanticType, string>>;
  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
}
