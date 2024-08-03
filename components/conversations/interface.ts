import type React from 'react';
import type { MenuProps } from 'antd';
import type { BaseProps } from '../_util/type';

export type GroupType = string;

/**
 * @desc 会话数据
 * @descEN Conversation data
 */
export interface ConversationProps extends Record<string, any> {
  /**
   * @desc 唯一标识
   * @descEN Unique identifier
   */
  key: string;

  /**
   * @desc 会话名称
   * @descEN Conversation name
   */
  label?: React.ReactNode;

  /**
   * @desc 会话时间戳
   * @descEN Conversation timestamp
   */
  timestamp?: number;

  /**
   * @desc 会话分组类型，与 {@link ConversationsProps.groupable} 联动
   * @descEN Conversation type
   */
  group?: GroupType;

  /**
   * @desc 会话图标
   * @descEN conversation icon
   */
  icon?: React.ReactNode;

  /**
   * @desc 是否禁用
   * @descEN Whether to disable
   */
  disabled?: boolean;
};

/**
 * @desc 会话列表组件参数
 * @descEN Props for the conversation list component
 */
export interface ConversationsProps extends BaseProps, React.HTMLAttributes<HTMLUListElement> {

  /**
   * @desc 会话列表数据源
   * @descEN Data source for the conversation list
   */
  data?: ConversationProps[];

  /**
   * @desc 当前选中的值
   * @descEN Currently selected value
   */
  activeKey?: ConversationProps['key'];

  /**
   * @desc 默认选中值
   * @descEN Default selected value
   */
  defaultActiveKey?: ConversationProps['key'];

  /** 
   * @desc 选中变更回调
   * @descEN Callback for selection change
   */
  onActiveChange?: (value: ConversationProps['key'], preValue: ConversationProps['key']) => void;

  /**
   * @desc 会话操作菜单
   * @descEN Operation menu for conversations
   */
  menu?: MenuProps | ((value: ConversationProps) => MenuProps);

  /**
   * @desc 是否支持分组, 开启后默认按 {@link ConversationProps.group} 字段分组
   * @descEN If grouping is supported, it defaults to the {@link ConversationProps.group} field
   */
  groupable?: boolean | {
    /**
     * @desc 分组排序函数
     * @descEN Group sorter
     */
    sort?: (a: GroupType, b: GroupType) => number;
    /**
     * @desc 语义化自定义渲染
     * @descEN Semantic custom rendering
     */
    components?: Partial<Record<'title', React.ComponentType<{ group: GroupType }>>>;
  };

  /** 
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<'list' | 'item', React.CSSProperties>>;

  /** 
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<'list' | 'item', string>>;
};
