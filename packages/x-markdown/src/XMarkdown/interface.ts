import type { Config as DOMPurifyConfig } from 'dompurify';
import type { DOMNode } from 'html-react-parser';
import type { MarkedExtension, Tokens } from 'marked';
import type { CSSProperties, JSX } from 'react';

export interface AnimationConfig {
  /**
   * @description 淡入动画的持续时间（毫秒）
   * @description The duration of the fade-in animation in milliseconds
   * @default 200
   */
  fadeDuration?: number;
  /**
   * @description 动画的缓动函数
   * @description Easing function for the animation
   * @default 'ease-in-out'
   */
  easing?: string;
}

/**
 * @description 语义化打字机效果的配置
 * @description Configuration for semantic typewriter effect
 */
export interface SemanticConfig {
  /**
   * @description 语义分割的正则表达式模式字符串
   * @description Regular expression pattern string for semantic delimiter
   * @default '[。？！……；：——，]'
   */
  delimiterPattern?: string;
  /**
   * @description 最大字符数，超过此长度的文本将作为单独的语义块
   * @description Maximum chunk length, text exceeding this will be treated as a separate semantic chunk
   * @default 18
   */
  maxChunkLength?: number;
  /**
   * @description 每个语义块之间的停顿间隔（毫秒），数组的 index 对应第几个语义块，最后一个值用于后续所有语义块
   * @description Delay between semantic chunks in milliseconds, array index corresponds to chunk number, last value applies to all remaining chunks
   * @default [300, 200, 100, 0]
   */
  chunkDelays?: number[];
  /**
   * @description 每个语义块内字符的延迟时间（毫秒），数组的 index 对应字符位置，最后一个值用于后续所有字符
   * @description Character delay within each semantic chunk in milliseconds, array index corresponds to character position, last value applies to all remaining characters
   * @default [50, 30, 20, 10, 5]
   */
  charDelays?: number[];
}

export enum StreamCacheTokenType {
  Text = 'text',
  Link = 'link',
  Image = 'image',
  Html = 'html',
  Emphasis = 'emphasis',
  List = 'list',
  Table = 'table',
  InlineCode = 'inline-code',
}

type Token = Tokens.Generic;

interface StreamingOption {
  /**
   * @description 指示是否还有后续内容块，为 false 时刷新所有缓存并完成渲染
   * @description Indicates whether more content chunks are expected. When false, flushes all cached content and completes rendering
   * @default false
   */
  hasNextChunk?: boolean;
  /**
   * @description 为块级元素（p、li、h1、h2、h3、h4）启用文字淡入动画
   * @description Enables text fade-in animation for block elements (p, li, h1, h2, h3, h4)
   * @default false
   */
  enableAnimation?: boolean;
  /**
   * @description 文字出现动画效果的配置
   * @description Configuration for text appearance animation effects
   */
  animationConfig?: AnimationConfig;
  /**
   * @description 语义化配置，根据语义化结构（如标点符号、最大长度）分割文本，并以打字机效果逐字显示
   * @description Configuration for semantic, splits text by semantic structure (punctuation, max length) and displays character by character
   */
  semantic?: boolean | SemanticConfig;
  /**
   * @description 未完成的 Markdown 格式转换为自定义加载组件的映射配置，用于在流式渲染过程中为未闭合的链接和图片提供自定义loading组件
   * @description Mapping configuration to convert incomplete Markdown formats to custom loading components, used to provide custom loading components for unclosed links and images during streaming rendering
   * @default { link: 'incomplete-link', image: 'incomplete-image' }
   */
  incompleteMarkdownComponentMap?: Partial<
    Record<
      Exclude<(typeof StreamCacheTokenType)[keyof typeof StreamCacheTokenType], 'text'>,
      string
    >
  >;
}

type StreamStatus = 'loading' | 'done';

type ComponentProps<T extends Record<string, unknown> = Record<string, unknown>> =
  React.HTMLAttributes<HTMLElement> & {
    /**
     * @description 组件对应的 DOM 节点，包含解析后的 DOM 节点信息
     * @description Component Element from html-react-parser, contains the parsed DOM node information
     */
    domNode: DOMNode;
    /**
     * @description 流式状态，`loading` 表示正在加载，`done` 表示加载完成
     * @description Streaming status, `loading` indicates streaming in progress, `done` indicates streaming complete
     */
    streamStatus: StreamStatus;
  } & T;

interface XMarkdownProps {
  /**
   * @description 需要渲染的 Markdown 内容
   * @description Markdown content to be rendered
   */
  content?: string;
  /**
   * @description Markdown 内容，作为 `content` 属性的别名
   * @description Markdown content, alias for `content` property
   */
  children?: string;
  /**
   * @description 用于替换 HTML 元素的自定义 React 组件映射，组件会接收 domNode、streamStatus 等属性
   * @description Custom React components to replace HTML elements, components receive domNode, streamStatus, etc.
   */
  components?: {
    [tagName: string]: React.ComponentType<ComponentProps> | keyof JSX.IntrinsicElements;
  };
  /**
   * @description 流式渲染行为的配置
   * @description Configuration for streaming rendering behavior
   */
  streaming?: StreamingOption;
  /**
   * @description Markdown 解析和扩展的 Marked.js 配置
   * @description Marked.js configuration for Markdown parsing and extensions
   */
  config?: MarkedExtension;
  /**
   * @description 根元素的额外 CSS 类名
   * @description Additional CSS class name for the root container
   */
  rootClassName?: string;
  /**
   * @description 根容器的额外 CSS 类名
   * @description Additional CSS class name for the root container
   */
  className?: string;
  /**
   * @description 段落元素的自定义 HTML 标签，防止自定义组件包含块级元素时的验证错误
   * @description Custom HTML tag for paragraph elements, prevents validation errors when custom components contain block-level elements
   * @default 'p'
   */
  paragraphTag?: keyof JSX.IntrinsicElements;
  /**
   * @description 根容器的内联样式
   * @description Inline styles for the root container
   */
  style?: CSSProperties;
  /**
   * @description 组件的 CSS 类名前缀
   * @description CSS class name prefix for the component
   */
  prefixCls?: string;
  /**
   * @description 是否为所有锚点标签添加 `target="_blank"`
   * @description Whether to add `target="_blank"` to all anchor tags
   * @default false
   */
  openLinksInNewTab?: boolean;
  /**
   * @description HTML 净化和 XSS 防护的 DOMPurify 配置
   * @description DOMPurify configuration for HTML sanitization and XSS protection
   */
  dompurifyConfig?: DOMPurifyConfig;
  /**
   * @description 是否保护自定义标签中的换行符
   * @description Whether to protect newlines in custom tags
   * @default false
   */
  protectCustomTagNewlines?: boolean;
  /*
   * @description 是否启用调试模式，显示性能监控浮层，包含 FPS、内存占用、渲染时间等关键指标
   * @description Whether to enable debug mode, displaying performance monitoring overlay with FPS, memory usage, render time and other key metrics
   * @default false
   */
  debug?: boolean;
}

export type { XMarkdownProps, Token, Tokens, StreamStatus, ComponentProps, StreamingOption };
