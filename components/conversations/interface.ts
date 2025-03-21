import type { MenuProps } from 'antd';
import type React from 'react';
import type { AnyObject } from '../_util/type';
import type { GroupTitleProps } from './GroupTitle';

type GroupType = string;

/**
 * @desc 会话数据
 * @descEN Conversation data
 */

export interface Conversation extends AnyObject {
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
}

export type GroupSorter = Parameters<GroupType[]['sort']>[0];

export type GroupTitleRenderComponents = {
  components: {
    GroupTitle: React.ComponentType<GroupTitleProps>;
  };
};

export type GroupTitleRender =
  | ((group: GroupType, info: GroupTitleRenderComponents) => React.ReactNode)
  | undefined;

export interface Groupable {
  /**
   * @desc 分组排序函数
   * @descEN Group sorter
   */
  sort?: GroupSorter;
  /**
   * @desc 自定义分组标签渲染
   * @descEN Semantic custom rendering
   */
  title?: GroupTitleRender;
}

export interface menuType extends MenuProps {
  trigger?: React.ReactNode | ((value: Conversation) => React.ReactNode);
}
