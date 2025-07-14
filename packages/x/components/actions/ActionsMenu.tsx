import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, type MenuProps } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { ActionsContext } from '.';
import type { ActionItemType, ActionsItemProps } from './interface';

/** Tool function: Find data item by path */
export const findItem = (keyPath: string[], items: ActionItemType[]): ActionItemType | null => {
  const keyToFind = keyPath[0];

  for (const item of items) {
    if (item.key === keyToFind) {
      if (keyPath.length === 1) return item;

      if ('subItems' in item) {
        return findItem(keyPath.slice(1), item?.subItems!);
      }
    }
  }

  return null;
};

const ActionsMenu: React.FC<ActionsItemProps> = (props) => {
  const { onClick: onMenuClick, item, dropdownProps = {} } = props;
  const { prefixCls, classNames = {}, styles = {} } = React.useContext(ActionsContext) || {};

  const { subItems = [], triggerSubMenuAction = 'hover' } = item;
  const icon = item?.icon ?? <EllipsisOutlined />;

  const menuProps: MenuProps = {
    items: subItems as MenuProps['items'],
    onClick: ({ key, keyPath, domEvent }) => {
      if (findItem(keyPath, subItems)?.onItemClick) {
        findItem(keyPath, subItems)?.onItemClick?.(findItem(keyPath, subItems) as ActionItemType);
        return;
      }
      onMenuClick?.({
        key,
        keyPath: [...keyPath, item?.key || ''],
        domEvent,
        item: findItem(keyPath, subItems)!,
      });
    },
  };

  return (
    <Dropdown
      menu={menuProps}
      overlayClassName={classnames(`${prefixCls}-sub-item`, classNames?.itemDropdown)}
      overlayStyle={styles?.itemDropdown}
      arrow
      trigger={[triggerSubMenuAction]}
      {...dropdownProps}
    >
      <div className={classnames(`${prefixCls}-list-item`, classNames?.item)} style={styles?.item}>
        <div className={`${prefixCls}-list-item-icon`}>{icon}</div>
      </div>
    </Dropdown>
  );
};

export default ActionsMenu;
