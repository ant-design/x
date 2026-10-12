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
  /**
   * @description 淡入的单位。`chunk` 每次新到的文本单独淡入；`sentence` 把新到的文本并入当前句子，到分隔符才开始下一个淡入单元。与 `typewriter` 同时使用时应选 `sentence`，否则每帧放出的几个字都会各自成为一个淡入节点
   * @description Unit of the fade-in. `chunk` fades in each newly arrived piece of text on its own; `sentence` appends new text to the current sentence and starts a new fade-in unit only after a delimiter. Use `sentence` together with `typewriter`, otherwise every few characters revealed per frame become their own fade-in node
   * @default 'chunk'
   */
  splitBy?: 'chunk' | 'sentence';
  /**
   * @description `splitBy` 为 `sentence` 时的句子分隔符
   * @description Sentence delimiters used when `splitBy` is `sentence`
   * @default ['。', '！', '？', '.', '!', '?', '\n']
   */
  delimiters?: string[];
  /**
   * @description `splitBy` 为 `sentence` 时一个淡入单元最多容纳的字符数，超过后新到的文本另起一个单元
   * @description With `splitBy: 'sentence'`, the most characters one fade-in unit holds; text arriving beyond it starts a new unit
   * @default 120
   */
  maxSentenceChars?: number;
}

export interface TypewriterConfig {
  /**
   * @description 放出文本的单位。`char` 逐字放出；`sentence` 攒到分隔符再一起放出（围栏代码和行内代码里的分隔符不算，换行总是分隔符）
   * @description Unit in which text is revealed. `char` reveals character by character; `sentence` reveals up to the next delimiter at once (delimiters inside fenced or inline code do not count, a newline always does)
   * @default 'char'
   */
  unit?: 'char' | 'sentence';
  /**
   * @description 句子分隔符
   * @description Sentence delimiters
   * @default ['。', '！', '？', '.', '!', '?', '\n']
   */
  delimiters?: string[];
  /**
   * @description 最低放出速度（字/秒）。速度会随 chunk 到达节奏自适应，这是下限
   * @description Minimum reveal speed in characters per second. The speed adapts to the chunk cadence; this is the floor
   * @default 24
   */
  minCps?: number;
  /**
   * @description 最高放出速度（字/秒）
   * @description Maximum reveal speed in characters per second
   * @default 3000
   */
  maxCps?: number;
  /**
   * @description `unit` 为 `char` 时，放出一个分隔符后停顿的毫秒数
   * @description With `unit: 'char'`, how many milliseconds to pause after revealing a delimiter
   * @default 0
   */
  pauseMs?: number;
  /**
   * @description `unit` 为 `sentence` 时，自上一个分隔符起最多攒多少个字符；超过后退回逐字放出，直到下一个分隔符出现。防止长 URL、单行 JSON 这类没有标点的内容长时间不显示
   * @description With `unit: 'sentence'`, the longest run since the previous delimiter that is held back; beyond it text is revealed character by character until the next delimiter appears. Prevents a long URL or a one-line JSON blob from staying invisible
   * @default 120
   */
  maxSentenceChars?: number;
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

interface TailConfig {
  /**
   * @description 尾部显示的内容，默认为 `▋`
   * @description The content to display as tail, default is `▋`
   * @default '▋'
   */
  content?: string;
  /**
   * @description 自定义尾部组件，优先级高于 content
   * @description Custom tail component, takes precedence over content
   */
  component?: React.ComponentType<{ content?: string }>;
}

interface StreamingOption {
  /**
   * @description 指示是否还有后续内容块，为 false 时刷新所有缓存并完成渲染
   * @description Indicates whether more content chunks are expected. When false, flushes all cached content and completes rendering
   * @default false
   */
  hasNextChunk?: boolean;
  /**
   * @description 流式期间按标题把正文切成若干段，只有正在增长的最后一段随每个 chunk 重新解析、消毒和渲染，前面的段直接复用。只在顶格的 ATX 标题（`# ` ～ `###### `）前切分；围栏代码、HTML 块（`<div>`、`<pre>`、`<script>`、注释等）、`$$` 公式内的 `#` 行不算标题。出现链接引用定义或脚注定义、或自定义组件标签跨越切点时不切分。传对象可调整：短于 `minSectionChars` 的段并入下一段；`keepSectionsOnEnd`（默认 true）表示流结束（`hasNextChunk` 变为 false）后各段保持不变、已挂载的自定义组件不重新挂载，设为 false 则流结束时回到整篇一次性渲染，用了带全局状态的 marked 扩展（如标题 id 去重）时应关掉。
   * @description Splits the document into sections at headings while streaming so that only the last, still-growing section is re-parsed, sanitized and rendered per chunk; earlier sections are reused as-is. A boundary is only placed before a column-0 ATX heading (`# ` to `###### `); `#` lines inside fenced code, HTML blocks (`<div>`, `<pre>`, `<script>`, comments, …) and `$$` math are not headings. Splitting is disabled when a link reference or footnote definition appears, or when a custom component tag spans the boundary. Pass an object to tune it: sections shorter than `minSectionChars` are merged into the next one; `keepSectionsOnEnd` (default true) keeps the sections once the stream ends (`hasNextChunk` becomes false) so mounted custom components are not remounted, while false re-renders the whole document at once when the stream ends — turn it off when using marked extensions with document-wide state (e.g. heading id de-duplication).
   * @default false
   */
  incremental?: boolean | { minSectionChars?: number; keepSectionsOnEnd?: boolean };
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
   * @description 是否启用尾部动画；传入 `true` 使用默认 `▋`，传入对象可自定义内容
   * @description Whether to enable tail animation; pass `true` for default `▋`, or object to customize content
   * @default false
   */
  tail?: boolean | TailConfig;
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
  /**
   * @description 尚未写完的 Markdown 语法如何显示。`placeholder`：扣住不显示，或显示 `incompleteMarkdownComponentMap` 指定的占位组件；`complete`：把写到一半的强调、行内代码、链接文字、列表项当作已写完的文本立刻显示（`**加粗中` 显示为加粗，`[链接文字](https://` 先显示文字），图片、HTML、表格仍按 `placeholder` 处理。对某个语法显式配置了 `incompleteMarkdownComponentMap` 时以占位组件为准。
   * @description How markdown syntax that has not finished streaming is shown. `placeholder`: hold it back, or show the placeholder component from `incompleteMarkdownComponentMap`; `complete`: show half-written emphasis, inline code, link text and list items as finished text right away (`**bold so far` renders bold, `[link text](https://` shows its text), while images, HTML and tables still follow `placeholder`. A token with an explicit `incompleteMarkdownComponentMap` entry always uses its placeholder.
   * @default 'placeholder'
   */
  incompleteMarkdown?: 'placeholder' | 'complete';
  /**
   * @description 打字机效果：新到的内容不是整块出现，而是按 chunk 到达的节奏匀速放出。放出的永远是 `content` 的前缀，`hasNextChunk` 变为 false 时立即放完。传对象可配置单位、速度和分隔符
   * @description Typewriter effect: newly arrived content is revealed at a steady pace that follows the chunk cadence instead of appearing in blocks. What is shown is always a prefix of `content`; everything is revealed at once when `hasNextChunk` becomes false. Pass an object to configure the unit, speed and delimiters
   * @default false
   */
  typewriter?: boolean | TypewriterConfig;
}

type StreamStatus = 'loading' | 'done';

/**
 * @description 可关闭内置默认样式的标签
 * @description Tags whose built-in default styles can be disabled
 */
type DefaultStyleTag =
  | 'p'
  | 'ul'
  | 'ol'
  | 'li'
  | 'pre'
  | 'code'
  | 'table'
  | 'th'
  | 'td'
  | 'img'
  | 'hr';

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
    /**
     * @description 代码块 info string（包含语言与参数，来自 marked 的 lang）
     * @description Fenced code info string (language + params, from marked lang)
     */
    lang?: string;
    /**
     * @description 是否为块级 code（仅 code 组件）
     * @description Whether it is a block code (code component only)
     */
    block?: boolean;
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
   * @description 按标签名向 `components` 中的自定义组件传递额外的 props，使组件引用保持稳定，避免内联函数导致的重复挂载
   * @description Extra props passed to custom components in `components` by tag name, keeping component references stable and avoiding remounts caused by inline functions
   */
  componentsProps?: {
    [tagName: string]: Record<string, unknown>;
  };
  /**
   * @description 流式渲染行为的配置。传布尔值即开启预设：`true` 表示还有后续内容（等同 `hasNextChunk: true`）并打开 `incremental`、`incompleteMarkdown: 'complete'`、`typewriter`；`false` 表示流已结束，按最终内容一次性渲染。传对象则逐项配置
   * @description Configuration for streaming rendering behavior. A boolean enables the preset: `true` means more content is coming (same as `hasNextChunk: true`) with `incremental`, `incompleteMarkdown: 'complete'` and `typewriter` switched on; `false` means the stream has ended and the final content is rendered at once. Pass an object to configure each option
   */
  streaming?: boolean | StreamingOption;
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
   * @description 是否保护自定义标签中的空行分段（仅针对空行造成的段落分隔）
   * @description Whether to protect blank-line paragraph breaks in custom tags
   * @default false
   */
  protectCustomTagNewlines?: boolean;
  /**
   * @description 是否禁用自定义标签内的块级 Markdown 解析，避免列表、标题、引用等被解析；行内 Markdown 仍会生效
   * @description Whether to disable block-level Markdown parsing inside custom tags so lists, headings, and blockquotes are not parsed; inline Markdown still works
   * @default false
   */
  disableCustomTagBlockMarkdown?: boolean;
  /**
   * @description 是否将 Markdown 中的原始 HTML 转义为纯文本展示（不解析为真实 HTML），避免 XSS 同时保留内容
   * @description Whether to escape raw HTML in Markdown as plain text (not parsed as real HTML), avoiding XSS while preserving content
   * @default false
   */
  escapeRawHtml?: boolean;
  /*
   * @description 是否启用调试模式，显示性能监控浮层，包含 FPS、内存占用、渲染时间等关键指标
   * @description Whether to enable debug mode, displaying performance monitoring overlay with FPS, memory usage, render time and other key metrics
   * @default false
   */
  debug?: boolean;
  /**
   * @description 是否关闭内置标签的默认样式。传入 `true` 关闭全部，传入数组按标签关闭（如 `['ul', 'ol', 'li']`），用于避免默认样式污染自定义组件内部的元素
   * @description Whether to disable built-in default styles for tags. Pass `true` to disable all, or an array to disable specific tags (e.g. `['ul', 'ol', 'li']`), useful to prevent default styles from polluting elements inside custom components
   * @default false
   */
  disableDefaultStyles?: boolean | DefaultStyleTag[];
}

export type {
  ComponentProps,
  DefaultStyleTag,
  StreamingOption,
  StreamStatus,
  TailConfig,
  Token,
  Tokens,
  XMarkdownProps,
};
export type { TypewriterConfig as TypewriterOption };
