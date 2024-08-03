import React from 'react';
import { Tooltip, Typography, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import type { ConversationProps, ConversationsProps } from './interface';

interface ConversationsItemProps extends React.HTMLAttributes<HTMLLIElement> {
  classNames?: ConversationsProps['classNames'];
  styles?: ConversationsProps['styles'];
  menu?: MenuProps;
  item: ConversationProps;
}

const ConversationsItem: React.FC<ConversationsItemProps> = (props) => {
  const {
    classNames,
    styles,
    onClick,
    menu,
    item: {
      disabled,
      icon,
      label,
      key,
    },
  } = props;

  const [ellipsised, setEllipsised] = React.useState(false);
  const [opened, setOpened] = React.useState(false);

  return (
    <Tooltip
      title={label}
      key={key}
      open={ellipsised && opened}
      onOpenChange={setOpened}
      placement="right"
      mouseLeaveDelay={0}
    >
      <li
        className={classNames?.item}
        style={styles?.item}
        onClick={disabled ? undefined : onClick}
        key={key}
      >
        {icon && (
          <div className={classNames?.icon} style={styles?.icon}>
            {icon}
          </div>
        )
        }
        <Typography.Text
          className={classNames?.label}
          style={styles?.label}
          ellipsis={{
            onEllipsis: setEllipsised,
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
              className={classNames?.menuIcon}
              style={styles?.menuIcon}
            />
          </Dropdown>}
      </li>
    </Tooltip>
  );
};

export default ConversationsItem;