import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import { ActionItemType, ActionsProps, SubItemType } from './interface';

export const findItem = (keyPath: string[], items: ActionItemType[]): ActionItemType | null => {
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

const ActionMenu = (props: { item: SubItemType } & Pick<ActionsProps, 'prefixCls' | 'onClick'>) => {
  const { onClick: onMenuClick } = props;
  const item = props.item;
  const { children = [], triggerSubMenuAction = 'hover' } = item;
  const { getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('actions', props.prefixCls);
  const icon = item?.icon ?? <EllipsisOutlined />;

  const menuProps: MenuProps = {
    items: children,

    onClick: ({ key, keyPath, domEvent }) => {
      onMenuClick?.({
        key,
        keyPath: [item.key, ...keyPath],
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

if (process.env.NODE_ENV === 'production') {
  ActionMenu.displayName = 'ActionMenu';
}

export default ActionMenu;