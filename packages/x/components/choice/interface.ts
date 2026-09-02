import type React from 'react';

export type ChoiceValueType = string | number;

export type SemanticType =
  | 'root'
  | 'header'
  | 'title'
  | 'description'
  | 'list'
  | 'item'
  | 'itemContent'
  | 'indicator'
  | 'footer';

export interface ChoiceItemType {
  /**
   * @desc 唯一标识，同时作为选中值
   * @descEN Unique identifier, also used as the selected value
   */
  key: ChoiceValueType;

  /**
   * @desc 选项标签
   * @descEN Option label
   */
  label: React.ReactNode;

  /**
   * @desc 选项描述，提供补充信息
   * @descEN Option description providing additional information
   */
  description?: React.ReactNode;

  /**
   * @desc 选项图标
   * @descEN Option icon
   */
  icon?: React.ReactNode;

  /**
   * @desc 是否禁用
   * @descEN Whether the option is disabled
   */
  disabled?: boolean;

  /**
   * @desc 禁用原因提示
   * @descEN Reason for disabling the option
   */
  disabledReason?: React.ReactNode;

  /**
   * @desc AI 推荐标记
   * @descEN AI recommended marker
   */
  recommended?: boolean | 'primary' | 'secondary';

  /**
   * @desc 推荐原因
   * @descEN Reason for recommendation
   */
  recommendedReason?: React.ReactNode;

  /**
   * @desc 选项额外信息（如价格、标签等）
   * @descEN Extra information for the option (e.g. price, tags)
   */
  extra?: React.ReactNode;

  /**
   * @desc 选项附加元数据，用于 LLM 结构化数据透传
   * @descEN Additional metadata for LLM structured data passthrough
   */
  meta?: Record<string, any>;

  /**
   * @desc 嵌套子选项（用于分组场景）
   * @descEN Nested child options for grouping scenarios
   */
  children?: ChoiceItemType[];
}

export interface ChangeInfo {
  /**
   * @desc 变更后的值
   * @descEN Value after change
   */
  value: ChoiceValueType | ChoiceValueType[];

  /**
   * @desc 当前所有选项
   * @descEN All current items
   */
  items: ChoiceItemType[];

  /**
   * @desc 本次变更涉及的选项
   * @descEN Items involved in this change
   */
  changedItems: ChoiceItemType[];

  /**
   * @desc 变更类型
   * @descEN Change type
   */
  type: 'select' | 'deselect';
}

export interface ChoiceProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onSelect' | 'onChange' | 'defaultValue' | 'title' | 'description'
  > {
  /**
   * @desc 选项列表
   * @descEN List of options
   */
  items: ChoiceItemType[];

  /**
   * @desc 选择模式
   * @descEN Selection mode
   * @default 'single'
   */
  mode?: 'single' | 'multiple';

  /**
   * @desc 布局模式
   * @descEN Layout mode
   * @default 'list'
   */
  layout?: 'list' | 'grid' | 'card';

  /**
   * @desc 当前选中值（受控）
   * @descEN Current selected value (controlled)
   */
  value?: ChoiceValueType | ChoiceValueType[];

  /**
   * @desc 默认选中值
   * @descEN Default selected value
   */
  defaultValue?: ChoiceValueType | ChoiceValueType[];

  /**
   * @desc 选中变化回调
   * @descEN Callback when selection changes
   */
  onChange?: (value: ChoiceValueType | ChoiceValueType[], info: ChangeInfo) => void;

  /**
   * @desc 选项点击回调（不改变选中状态）
   * @descEN Callback when an option is clicked (does not change selection)
   */
  onItemClick?: (info: { data: ChoiceItemType; index: number }) => void;

  /**
   * @desc 确认回调，用户完成选择后触发
   * @descEN Confirm callback, triggered when user finishes selection
   */
  onConfirm?: (value: ChoiceValueType | ChoiceValueType[], info: ChangeInfo) => void;

  /**
   * @desc 标题
   * @descEN Title
   */
  title?: React.ReactNode;

  /**
   * @desc 描述文本，标题下方的辅助说明
   * @descEN Description text below the title
   */
  description?: React.ReactNode;

  /**
   * @desc 底部操作区（如确认按钮）
   * @descEN Footer action area (e.g. confirm button)
   */
  footer?: React.ReactNode;

  /**
   * @desc 是否禁用
   * @descEN Whether to disable all options
   * @default false
   */
  disabled?: boolean;

  /**
   * @desc 是否显示 loading 态
   * @descEN Whether to show loading state
   * @default false
   */
  loading?: boolean;

  /**
   * @desc 多选模式下最大可选数量
   * @descEN Maximum selectable count in multiple mode
   */
  maxCount?: number;

  /**
   * @desc 选择指示器类型
   * @descEN Indicator type
   */
  indicator?: 'check' | 'radio' | 'number' | 'none';

  /**
   * @desc 是否显示确认按钮
   * @descEN Whether to show confirm button
   * @default false
   */
  confirmable?: boolean;

  /**
   * @desc 确认按钮文案
   * @descEN Confirm button text
   */
  confirmText?: React.ReactNode;

  /**
   * @desc 渐入动画
   * @descEN Fade-in animation
   */
  fadeIn?: boolean;

  /**
   * @desc 从左渐入动画
   * @descEN Fade-in from left animation
   */
  fadeInLeft?: boolean;

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
   * @desc 样式类名的前缀
   * @descEN Prefix for style class names
   */
  prefixCls?: string;

  /**
   * @desc 根节点的样式类名
   * @descEN Root node style class name
   */
  rootClassName?: string;
}

export interface ChoiceRef {
  nativeElement: HTMLDivElement;

  /**
   * @desc 滚动到指定选项
   * @descEN Scroll to a specific option
   */
  scrollTo: (key: ChoiceValueType) => void;

  /**
   * @desc 获取当前选中值
   * @descEN Get current selected value
   */
  getValue: () => ChoiceValueType | ChoiceValueType[] | undefined;
}
