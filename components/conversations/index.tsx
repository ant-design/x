import React from 'react';
import classnames from 'classnames';
import type { MenuProps } from 'antd';

import ConversationsItem from './Item';
import GroupTitle from './GroupTitle';

import useMergedState from 'rc-util/lib/hooks/useMergedState';
import useConfigContext from '../config-provider/useConfigContext';
import useGroupable from './hooks/useGroupable';

import useStyle from './style';

import type { ConversationProps, Groupable } from './interface';

/**
 * @desc 会话列表组件参数
 * @descEN Props for the conversation list component
 */
export interface ConversationsProps extends React.HTMLAttributes<HTMLUListElement> {
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
  onActiveChange?: (value?: ConversationProps['key'], preValue?: ConversationProps['key']) => void;

  /**
   * @desc 会话操作菜单
   * @descEN Operation menu for conversations
   */
  menu?: MenuProps | ((value: ConversationProps) => MenuProps);

  /**
   * @desc 是否支持分组, 开启后默认按 {@link ConversationProps.group} 字段分组
   * @descEN If grouping is supported, it defaults to the {@link ConversationProps.group} field
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
    ...htmlULProps
  } = props;

  // ============================ ActiveKey ============================
  const [mergedActiveKey, setMergedActiveKey] = useMergedState<ConversationsProps['activeKey']>(
    defaultActiveKey,
    {
      value: activeKey,
      onChange: onActiveChange,
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

  // ============================ Render ============================
  return wrapCSSVar(
    <ul {...htmlULProps} className={mergedCls}>
      {groupList.map((groupInfo, groupIndex) => {
        const convItems = groupInfo.data.map((convInfo: ConversationProps, convIndex: number) => (
          <ConversationsItem
            key={convInfo.key || `key-${convIndex}`}
            info={convInfo}
            prefixCls={prefixCls}
            direction={direction}
            className={classNames.item}
            style={styles.item}
            menu={typeof menu === 'function' ? menu(convInfo) : menu}
            active={mergedActiveKey === convInfo.key}
            onClick={(info) => setMergedActiveKey(info.key)}
          />
        ));

        return enableGroup ? (
          <li key={groupInfo.name || `key-${groupIndex}`}>
            {groupInfo.title?.(groupInfo.name!, { components: { GroupTitle } }) || (
              <GroupTitle group={groupInfo.name} direction={direction} key={groupInfo.name} />
            )}
            <ul className={`${prefixCls}-list`}>{convItems}</ul>
          </li>
        ) : (
          convItems
        );
      })}
    </ul>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Conversations.displayName = 'Conversations';
}

export type { ConversationsProps, ConversationProps };

export default Conversations;
