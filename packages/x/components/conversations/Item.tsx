import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Typography } from 'antd';
import type { MenuProps } from 'antd';
import classnames from 'classnames';
import React from 'react';

import type { DirectionType } from 'antd/es/config-provider';
import pickAttrs from 'rc-util/lib/pickAttrs';
import type { ConversationsProps } from '.';
import type { ConversationItemType } from './interface';

export interface ConversationsItemProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> {
  info: ConversationItemType;
  prefixCls?: string;
  direction?: DirectionType;
  menu?: MenuProps & {
    trigger?:
      | React.ReactNode
      | ((
          conversation: ConversationItemType,
          info: { originNode: React.ReactNode },
        ) => React.ReactNode);
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  };
  active?: boolean;
  onClick?: ConversationsProps['onActiveChange'];
}

const stopPropagation: React.MouseEventHandler<HTMLSpanElement> = (e) => {
  e.stopPropagation();
};

const ConversationsItem: React.FC<ConversationsItemProps> = (props) => {
  const { prefixCls, info, className, direction, onClick, active, menu, ...restProps } = props;

  const domProps = pickAttrs(restProps, {
    aria: true,
    data: true,
    attr: true,
  });

  // ============================= MISC =============================
  const { disabled } = info;

  // ============================ Style =============================
  const mergedCls = classnames(
    className,
    `${prefixCls}-item`,
    { [`${prefixCls}-item-active`]: active && !disabled },
    { [`${prefixCls}-item-disabled`]: disabled },
  );

  // ============================ Events ============================
  const onInternalClick: React.MouseEventHandler<HTMLLIElement> = () => {
    if (!disabled && onClick) {
      onClick(info.key);
    }
  };

  // ============================ Menu ============================

  const { trigger, ...dropdownMenu } = menu || {};

  const getPopupContainer = dropdownMenu?.getPopupContainer;

  const renderMenuTrigger = (conversation: ConversationItemType) => {
    const originTriggerNode = (
      <EllipsisOutlined onClick={stopPropagation} className={`${prefixCls}-menu-icon`} />
    );
    if (trigger) {
      return typeof trigger === 'function'
        ? trigger(conversation, { originNode: originTriggerNode })
        : trigger;
    }
    return originTriggerNode;
  };

  // ============================ Render ============================
  return (
    <li
      title={typeof info.label === 'object' ? undefined : `${info.label}`}
      {...domProps}
      className={mergedCls}
      onClick={onInternalClick}
    >
      {info.icon && <div className={`${prefixCls}-icon`}>{info.icon}</div>}
      <Typography.Text className={`${prefixCls}-label`}>{info.label}</Typography.Text>
      {!disabled && menu && (
        <Dropdown
          menu={dropdownMenu}
          placement={direction === 'rtl' ? 'bottomLeft' : 'bottomRight'}
          trigger={['click']}
          disabled={disabled}
          getPopupContainer={getPopupContainer}
        >
          {renderMenuTrigger(info)}
        </Dropdown>
      )}
    </li>
  );
};

export default ConversationsItem;
