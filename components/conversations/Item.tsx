import React from 'react';
import { Tooltip, Typography, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

import type { MenuProps } from 'antd';
import type { ConversationProps } from './interface';

interface ConversationsItemProps extends ConversationProps, React.HTMLAttributes<HTMLLIElement> {
  classNames?: {
    item?: string;
    label?: string;
    menu?: string;
  };
  styles?: {
    item?: React.CSSProperties;
  };
  prefixCls?: string;
  menu?: MenuProps;
}

const ConversationsItem: React.FC<ConversationsItemProps> = (props) => {
  const {
    classNames,
    styles,
    disabled,
    onClick,
    icon,
    label,
    key,
    prefixCls,
    menu,
  } = props;

  const [ellipsised, setEllipsised] = React.useState(false);
  const [opened, setOpened] = React.useState(false);

  return (
    <Tooltip
      title={label}
      open={ellipsised && opened}
      onOpenChange={(open) => {
        setOpened(open);
      }}
      placement="right"
      mouseLeaveDelay={0}
    >
      <li
        className={classNames?.item}
        style={styles?.item}
        onClick={disabled ? undefined : onClick}
        key={key}
      >
        {icon && <div className={`${prefixCls}-icon`}>
          {icon}
        </div>}
        <Typography.Text
          className={classNames?.label}
          ellipsis={{
            onEllipsis: (value) => {
              setEllipsised(value);
            },
          }}
        >
          {label}
        </Typography.Text>
        {menu && !disabled &&
          <Dropdown
            menu={menu}
            placement="bottomRight"
            trigger={['click']}
            mouseLeaveDelay={0}
            disabled={disabled}
            onOpenChange={(open) => {
              if (open) {
                setOpened(!open);
              }
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentElement ?? document.body}
          >
            <MoreOutlined
              onClick={(event) => {
                event.stopPropagation();
              }}
              disabled={disabled}
              className={classNames?.menu}
            />
          </Dropdown>}
      </li>
    </Tooltip>
  );
};

export default ConversationsItem;