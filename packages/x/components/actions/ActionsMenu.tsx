import React from 'react';
import { Dropdown, MenuProps } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import { ActionsProps } from '.';
import { useXProviderContext } from '../x-provider';
import { ActionItem, ItemType } from './interface';

export const findItem = (keyPath: string[], items: ActionItem[]): ActionItem | null => {
  const keyToFind = keyPath[0]; // Get the first key from the keyPath

  for (const item of items) {
    if (item.key === keyToFind) {
      // If the item is found and this is the last key in the path
      if (keyPath.length === 1) return item;

      // If it is a SubItemType, recurse to find in its subItems
      if ('subItems' in item) {
        return findItem(keyPath.slice(1), item?.subItems!);
      }
    }
  }

  return null;
};

const ActionsMenu = (props: { item: ItemType } & Pick<ActionsProps, 'prefixCls' | 'onClick'>) => {
  const { onClick: onMenuClick, item } = props;
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
      overlayClassName={`${prefixCls}-sub-item`}
      arrow
      trigger={[triggerSubMenuAction]}
    >
      <div className={`${prefixCls}-list-item`}>
        <div className={`${prefixCls}-list-item-icon`}>{icon}</div>
      </div>
    </Dropdown>
  );
};

export default ActionsMenu;
