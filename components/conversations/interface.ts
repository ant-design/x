import type { ReactNode } from 'react';
import type { MenuProps } from 'antd';
import type { BaseProps } from '../_util/type';

/**
 * @desc 会话列表排序方式
 * @descEN Sort method for the conversation list
 */
export type SorterType = 'TIME_ACS' | 'TIME_DESC';

export type SorterMap = {
  [key in SorterType]?: (data: ConversationProps[]) => ConversationProps[];
};

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
  label?: ReactNode;

  /**
   * @desc 会话时间戳
   * @descEN Conversation timestamp
   */
  timestamp?: number;

  /**
  * @desc 是否固定于顶部
  * @descEN Whether to pin to the top
  */
  pinned?: boolean;
};

/**
 * @desc 会话列表组件参数
 * @descEN Props for the conversation list component
 */
export interface ConversationsProps extends BaseProps {

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
  onChange?: (value: ConversationProps['key'], preValue: ConversationProps['key']) => void;

  /**
   * @desc 会话操作菜单
   * @descEN Operation menu for conversations
   */
  menu?: MenuProps;

  /**
   * @desc 排序方式
   * @descEN Sorting method
   */
  sorter?: SorterType;

  /** 
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Record<'list' | 'item', React.CSSProperties>;

  /** 
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Record<'list' | 'item', string>;
};
