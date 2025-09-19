import type { KatexOptions } from 'katex';
import type { TokenizerAndRendererExtension } from 'marked';
import type { ReactNode } from 'react';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';

export type LatexOption = {
  katexOptions?: KatexOptions;
  replaceAlignStart?: boolean;
};

type HighlightCodeType = 'root' | 'header' | 'headerTitle' | 'code';
export type HighlightCodeProps = {
  lang?: string;
  children: string;
  header?: ReactNode | null;
  prefixCls?: string;
  style?: React.CSSProperties;
  className?: string;
  highlightProps?: Partial<SyntaxHighlighterProps>;
  // Semantic
  classNames?: Partial<Record<HighlightCodeType, string>>;
  styles?: Partial<Record<HighlightCodeType, React.CSSProperties>>;
};

type MermaidType = 'root' | 'header' | 'graph' | 'code';
export type MermaidProps = {
  children: string;
  header?: ReactNode | null;
  prefixCls?: string;
  style?: React.CSSProperties;
  className?: string;
  highlightProps?: Partial<SyntaxHighlighterProps>;
  // Semantic
  classNames?: Partial<Record<MermaidType, string>>;
  styles?: Partial<Record<MermaidType, React.CSSProperties>>;
};

interface BaseComponentConfig {
  style: React.CSSProperties;
  styles: Record<string, React.CSSProperties>;
  className: string;
  classNames: Record<string, string>;
}

type ComponentConfig<
  CompProps extends Record<PropertyKey, any>,
  PickType extends keyof CompProps = keyof BaseComponentConfig,
> = Pick<CompProps, PickType>;

export interface MarkdownComponentsConfig {
  highlightCode?: ComponentConfig<HighlightCodeProps>;
  mermaid?: ComponentConfig<MermaidProps>;
}

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
  HighlightCode: (props: HighlightCodeProps) => React.ReactNode;
  /**
   * @desc 渲染 Mermaid 图表。
   * @descEN Rendering the Mermaid Chart.
   */
  Mermaid: (props: MermaidProps) => React.ReactNode;
};
