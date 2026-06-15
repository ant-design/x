import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, type MenuProps } from 'antd';
import { clsx } from 'clsx';
import React from 'react';
import useMobile from '../_util/hooks/use-mobile';
import { ActionsContext } from './context';
import type { ActionsItemProps, ItemType } from './interface';

/** Tool function: Find data item by path */
export const findItem = (keyPath: string[], items: ItemType[]): ItemType | null => {
  const keyToFind = keyPath[0];
  for (const item of items) {
    if (!item) return null;
    if (item.key === keyToFind) {
      if (keyPath.length === 1) return item;

      if (item.subItems) {
        return findItem(keyPath.slice(1), item?.subItems!);
      }
    }
  }

  return null;
};

const ActionsMenu: React.FC<ActionsItemProps> = (props) => {
  const { onClick: onMenuClick, item, dropdownProps = {} } = props;
  const { prefixCls, classNames = {}, styles = {} } = React.useContext(ActionsContext) || {};
  const isMobile = useMobile();

  const { subItems = [], triggerSubMenuAction } = item;
  const mergedTriggerSubMenuAction = triggerSubMenuAction ?? (isMobile ? 'click' : 'hover');
  const icon = item?.icon ?? <EllipsisOutlined />;

  const menuProps: MenuProps = {
    items: subItems as MenuProps['items'],
    onClick: ({ key, keyPath, domEvent }) => {
      if (findItem(keyPath, subItems)?.onItemClick) {
        findItem(keyPath, subItems)?.onItemClick?.(findItem(keyPath, subItems) as ItemType);
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
      trigger={[mergedTriggerSubMenuAction]}
      {...dropdownProps}
      className={clsx(`${prefixCls}-dropdown`, classNames.itemDropdown, dropdownProps?.className)}
      styles={{
        root: styles.itemDropdown,
        ...dropdownProps?.styles,
      }}
    >
      <div
        className={clsx(`${prefixCls}-item`, `${prefixCls}-sub-item`, classNames?.item)}
        style={styles?.item}
      >
        <div className={`${prefixCls}-icon`}>{icon}</div>
      </div>
    </Dropdown>
  );
};

export default ActionsMenu;
