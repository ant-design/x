import type React from 'react';
import { CollapsibleOptions } from '../_util/hooks/use-collapsible';
import type { AnyObject } from '../_util/type';
import type { GroupInfoType } from './hooks/useGroupable';

/**
 * @desc 会话数据
 * @descEN Conversation data
 */
export interface ConversationItemType
  extends AnyObject,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> {
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
   * @desc 会话分组类型，与 {@link ConversationsProps.groupable} 联动
   * @descEN Conversation type
   */
  group?: string;

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

export interface DividerItemType {
  type: 'divider';
  key?: string;
  dashed?: boolean;
}

export type ItemType = ConversationItemType | DividerItemType;

export type GroupLabel =
  | React.ReactNode
  | ((
      group: string,
      info: {
        groupInfo: GroupInfoType;
      },
    ) => React.ReactNode)
  | undefined;

export type Collapsible = boolean | ((group: string) => boolean);
export interface GroupableProps extends CollapsibleOptions {
  /**
   * @desc 自定义分组标签渲染
   * @descEN Semantic custom rendering
   */
  label?: GroupLabel;
  collapsible?: Collapsible;
}
