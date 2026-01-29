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
  /**
   * @desc 是否使用 Prism 轻量模式（PrismLight），根据 lang 自动按需加载语言支持，大幅减少打包体积
   * @descEN Whether to use Prism light mode (PrismLight), automatically loads language support based on lang prop to significantly reduce bundle size
   * @default true
   * @example
   * ```tsx
   * // 使用轻量模式（默认，只加载需要的语言，打包体积小）
   * <CodeHighlighter lang="javascript">{code}</CodeHighlighter>
   *
   * // 使用全量模式（包含所有语言，打包体积较大）
   * <CodeHighlighter lang="javascript" prismLightMode={false}>
   *   {code}
   * </CodeHighlighter>
   * ```
   */
  prismLightMode?: boolean;
}
