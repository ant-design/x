import type { KatexOptions } from 'katex';
import { TokenizerAndRendererExtension } from 'marked';
import { ReactNode } from 'react';
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';

type LatexOption = {
  katexOptions?: KatexOptions;
  replaceAlignStart?: boolean;
};

type HighlightCodeType = 'header' | 'headerTitle';
type HighlighCodeProps = {
  lang: string;
  children: string;
  header?: ReactNode | null;
  prefixCls?: string;
  style?: React.CSSProperties;
  className?: string;
  classNames?: Partial<Record<HighlightCodeType, string>>;
  highlightProps?: Partial<SyntaxHighlighterProps>;
};

type MermaidType = 'header' | 'headerTitle' | 'mermaid';
type MermaidProps = {
  children: string;
  header?: ReactNode | null;
  prefixCls?: string;
  style?: React.CSSProperties;
  className?: string;
  classNames?: Partial<Record<MermaidType, string>>;
  highlightProps?: Partial<SyntaxHighlighterProps>;
};

export type PluginsType = {
  /**
   * @desc 渲染数学公式Latex语法。
   * @descEN Rendering mathematical formulas using Latex syntax.
   */
  Latex: (options?: LatexOption) => TokenizerAndRendererExtension[];
  /**
   * @desc 渲染代码高亮。
   * @descEN Highlight the rendering code.
   */
  HighlightCode: (props: HighlighCodeProps) => React.ReactNode;
  /**
   * @desc 渲染 Mermaid 图表。
   * @descEN Rendering the Mermaid Chart.
   */
  Mermaid: (props: MermaidProps) => React.ReactNode;
};
