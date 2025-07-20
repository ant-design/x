import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import { ActionsProps } from '.';
import { ActionItem, ItemType } from './interface';

export const findItem = (keyPath: string[], items: ActionItem[]): ActionItem | null => {
  const keyToFind = keyPath[0]; // Get the first key from the keyPath

  for (const item of items) {
    if (item.key === keyToFind) {
      // If the item is found and this is the last key in the path
      if (keyPath.length === 1) return item;

      // If it is a SubItemType, recurse to find in its children
      if ('children' in item) {
        return findItem(keyPath.slice(1), item.children!);
      }
    }
  }

  return null;
};

const ActionMenu = (props: { item: ItemType } & Pick<ActionsProps, 'prefixCls' | 'onClick'>) => {
  const { onClick: onMenuClick, item } = props;
  const { children = [], triggerSubMenuAction = 'hover' } = item;
  const { getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('actions', props.prefixCls);
  const icon = item?.icon ?? <EllipsisOutlined />;

  const menuProps: MenuProps = {
    items: children as MenuProps['items'],
    onClick: ({ key, keyPath, domEvent }) => {
      if (findItem(keyPath, children)?.onItemClick) {
        findItem(keyPath, children)?.onItemClick?.(findItem(keyPath, children) as ActionItem);
        return;
      }
      onMenuClick?.({
        key,
        keyPath: [...keyPath, item.key],
        domEvent,
        item: findItem(keyPath, children)!,
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

export default ActionMenu;
