import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, type MenuProps } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import { ActionItem } from '.';
import { ActionsItemProps } from './Item';

/** Tool function: Find data item by path */
export const findItem = (keyPath: string[], items: ActionItem[]): ActionItem | null => {
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
  const { onClick: onMenuClick, item, classNames, styles, dropdownProps = {} } = props;
  const { subItems = [], triggerSubMenuAction = 'hover' } = item;
  const { getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('actions', props.prefixCls);
  const icon = item?.icon ?? <EllipsisOutlined />;

  const menuProps: MenuProps = {
    items: subItems as MenuProps['items'],
    onClick: ({ key, keyPath, domEvent }) => {
      if (findItem(keyPath, subItems)?.onItemClick) {
        findItem(keyPath, subItems)?.onItemClick?.(findItem(keyPath, subItems) as ActionItem);
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
      <div className={`${prefixCls}-list-item`}>
        <div className={`${prefixCls}-list-item-icon`}>{icon}</div>
      </div>
    </Dropdown>
  );
};

export default ActionsMenu;
