import React from 'react';
import classnames from 'classnames';
import type { MenuProps } from 'antd';

import ConversationsItem, { type ConversationsItemProps } from './Item';
import GroupTitle, { GroupTitleContext } from './GroupTitle';

import useMergedState from 'rc-util/lib/hooks/useMergedState';
import useConfigContext from '../config-provider/useConfigContext';
import useGroupable from './hooks/useGroupable';

import useStyle from './style';

import type { Conversation, Groupable } from './interface';
import pickAttrs from 'rc-util/lib/pickAttrs';

/**
 * @desc 会话列表组件参数
 * @descEN Props for the conversation list component
 */
export interface ConversationsProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * @desc 会话列表数据源
   * @descEN Data source for the conversation list
   */
  data?: Conversation[];

  /**
   * @desc 当前选中的值
   * @descEN Currently selected value
   */
  activeKey?: Conversation['key'];

  /**
   * @desc 默认选中值
   * @descEN Default selected value
   */
  defaultActiveKey?: Conversation['key'];

  /**
   * @desc 选中变更回调
   * @descEN Callback for selection change
   */
  onActiveChange?: (value: string) => void;

  /**
   * @desc 会话操作菜单
   * @descEN Operation menu for conversations
   */
  menu?: MenuProps | ((value: Conversation) => MenuProps);

  /**
   * @desc 是否支持分组, 开启后默认按 {@link Conversation.group} 字段分组
   * @descEN If grouping is supported, it defaults to the {@link Conversation.group} field
   */
  groupable?: boolean | Groupable;

  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<'item', React.CSSProperties>>;

  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<'item', string>>;

  /**
   * @desc 自定义前缀
   * @descEN Prefix
   */
  prefixCls?: string;

  /**
   * @desc 自定义根类名
   * @descEN Custom class name
   */
  rootClassName?: string;
}

const Conversations: React.FC<ConversationsProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    data,
    activeKey,
    defaultActiveKey,
    onActiveChange,
    menu,
    styles = {},
    classNames = {},
    groupable,
    className,
    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================ ActiveKey ============================
  const [mergedActiveKey, setMergedActiveKey] = useMergedState<ConversationsProps['activeKey']>(
    defaultActiveKey,
    {
      value: activeKey,
    },
  );

  // ============================ Groupable ============================
  const [groupList, enableGroup] = useGroupable(groupable, data);

  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useConfigContext();

  const prefixCls = getPrefixCls('conversations', customizePrefixCls);

  // ============================ Style ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(className, rootClassName, prefixCls, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  // ============================ Events ============================
  const onConversationItemClick: ConversationsItemProps['onClick'] = (info) => {
    setMergedActiveKey(info.key);

    if (onActiveChange) {
      onActiveChange(info.key);
    }
  };

  // ============================ Render ============================
  return wrapCSSVar(
    <ul {...domProps} className={mergedCls}>
      {groupList.map((groupInfo, groupIndex) => {
        const convItems = groupInfo.data.map((convInfo: Conversation, convIndex: number) => (
          <ConversationsItem
            key={convInfo.key || `key-${convIndex}`}
            info={convInfo}
            prefixCls={prefixCls}
            direction={direction}
            className={classNames.item}
            style={styles.item}
            menu={typeof menu === 'function' ? menu(convInfo) : menu}
            active={mergedActiveKey === convInfo.key}
            onClick={onConversationItemClick}
          />
        ));

        // With group to show the title
        if (enableGroup) {
          return (
            <li key={groupInfo.name || `key-${groupIndex}`}>
              <GroupTitleContext.Provider value={{ direction }}>
                {groupInfo.title?.(groupInfo.name!, { components: { GroupTitle } }) || (
                  <GroupTitle key={groupInfo.name}>{groupInfo.name}</GroupTitle>
                )}
              </GroupTitleContext.Provider>
              <ul className={`${prefixCls}-list`}>{convItems}</ul>
            </li>
          );
        }

        return convItems;
      })}
    </ul>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Conversations.displayName = 'Conversations';
}

export type { Conversation };

export default Conversations;
