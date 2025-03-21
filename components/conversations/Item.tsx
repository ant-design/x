import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Tooltip, Typography } from 'antd';
import classnames from 'classnames';
import React, { useCallback } from 'react';

import type { DirectionType } from 'antd/es/config-provider';
import pickAttrs from 'rc-util/lib/pickAttrs';
import type { Conversation, menuType } from './interface';

export interface ConversationsItemProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> {
  info: Conversation;
  prefixCls?: string;
  direction?: DirectionType;
  menu?: menuType;
  active?: boolean;
  onClick?: (info: Conversation) => void;
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

  // =========================== Ellipsis ===========================
  const [inEllipsis, onEllipsis] = React.useState(false);

  // =========================== Tooltip ============================
  const [opened, setOpened] = React.useState(false);

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
      onClick(info);
    }
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setOpened(!open);
    }
  };

  // ============================ Menu ============================

  const { trigger, items = [], ...menuOther } = menu || {};

  const menusTriggerNode = useCallback(
    (value: Conversation) => {
      if (trigger) {
        if (typeof trigger === 'function') {
          const triggerNode = trigger(value);
          if (React.isValidElement(triggerNode)) return triggerNode;
        }
        if (React.isValidElement(trigger)) return trigger;
      }
      return <EllipsisOutlined onClick={stopPropagation} className={`${prefixCls}-menu-icon`} />;
    },
    [trigger, menu],
  );

  // ============================ Render ============================
  return (
    <Tooltip
      title={info.label}
      open={inEllipsis && opened}
      onOpenChange={setOpened}
      placement={direction === 'rtl' ? 'left' : 'right'}
    >
      <li {...domProps} className={mergedCls} onClick={onInternalClick}>
        {info.icon && <div className={`${prefixCls}-icon`}>{info.icon}</div>}
        <Typography.Text
          className={`${prefixCls}-label`}
          ellipsis={{
            onEllipsis,
          }}
        >
          {info.label}
        </Typography.Text>
        {!disabled && menu && (
          <Dropdown
            menu={{
              ...menuOther,
              items,
            }}
            placement={direction === 'rtl' ? 'bottomLeft' : 'bottomRight'}
            trigger={['click']}
            disabled={disabled}
            onOpenChange={onOpenChange}
          >
            {menusTriggerNode(info)}
          </Dropdown>
        )}
      </li>
    </Tooltip>
  );
};

export default ConversationsItem;
