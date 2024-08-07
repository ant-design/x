import React from 'react';
import classnames from 'classnames';
import { Tooltip, Typography, Dropdown } from 'antd';

import { MoreOutlined } from '@ant-design/icons';
import useConfigContext from '../config-provider/useConfigContext';

import type { MenuProps } from 'antd';
import type { ConversationProps } from './interface';

export interface ConversationsItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> {
  info: ConversationProps;
  prefixCls?: string;
  menu?: MenuProps;
  active?: boolean;
  onClick?: (info: ConversationProps) => void;
}

const ConversationsItem: React.FC<ConversationsItemProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    info,
    className,
    onClick,
    active,
    menu,
    ...htmlLiProps
  } = props;

  // ============================ Ellipsis ============================
  const [ellipsised, setEllipsised] = React.useState(false);

  // ============================ Tootip ============================
  const [opened, setOpened] = React.useState(false);

  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useConfigContext();

  const prefixCls = getPrefixCls('conversations', customizePrefixCls);

  // ============================ Style ============================
  const mergedCls = classnames(
    className,
    `${prefixCls}-item`,
    { [`${prefixCls}-item-active`]: active && !info.disabled },
    { [`${prefixCls}-item-disabled`]: info.disabled },
  );

  // ============================ Render ============================
  return (
    <Tooltip
      title={info.label}
      open={ellipsised && opened}
      onOpenChange={setOpened}
      placement={direction === 'ltr' ? 'right' : 'left'}
    >
      <li
        {...htmlLiProps}
        className={mergedCls}
        onClick={() => info.disabled ? undefined : onClick?.(info)}
      >
        {info.icon && (
          <div className={`${prefixCls}-icon`}>
            {info.icon}
          </div>
        )
        }
        <Typography.Text
          className={`${prefixCls}-label`}
          ellipsis={{
            onEllipsis: setEllipsised,
          }}
        >
          {info.label}
        </Typography.Text>
        {menu && !info.disabled &&
          <Dropdown
            menu={menu}
            placement={direction === 'ltr' ? 'bottomRight' : 'bottomLeft'}
            trigger={['click']}
            disabled={info.disabled}
            onOpenChange={(open) => {
              if (open) {
                setOpened(!open);
              }
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentElement ?? document.body}
          >
            <MoreOutlined
              onClick={(event) => event.stopPropagation()}
              disabled={info.disabled}
              className={`${prefixCls}-menu-icon`}
            />
          </Dropdown>}
      </li>
    </Tooltip>
  );
};

export default ConversationsItem;