import React from 'react';
import classnames from 'classnames';
import { Tooltip, Typography, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

import type { MenuProps } from 'antd';
import type { DirectionType } from 'antd/es/config-provider';
import type { Conversation } from './interface';
import pickAttrs from 'rc-util/lib/pickAttrs';

export interface ConversationsItemProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> {
  info: Conversation;
  prefixCls?: string;
  direction?: DirectionType;
  menu?: MenuProps;
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
        {menu && !disabled && (
          <Dropdown
            menu={menu}
            placement={direction === 'rtl' ? 'bottomLeft' : 'bottomRight'}
            trigger={['click']}
            disabled={disabled}
            onOpenChange={onOpenChange}
          >
            <MoreOutlined
              onClick={stopPropagation}
              disabled={disabled}
              className={`${prefixCls}-menu-icon`}
            />
          </Dropdown>
        )}
      </li>
    </Tooltip>
  );
};

export default ConversationsItem;
