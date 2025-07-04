import { Tooltip } from 'antd';
import React from 'react';
import { ActionsProps, ItemType } from '.';
import ActionsMenu from './ActionsMenu';

export interface ActionsItemProps extends Omit<ActionsProps, 'items' | 'variant'> {
  /**
   * @desc 组件中某一项
   * @descEN Component item
   */
  item: ItemType;
}

const Item: React.FC<ActionsItemProps> = (props) => {
  const {
    item,
    onClick,
    prefixCls,
    className,
    style,
    classNames,
    styles,
    dropdownProps = {},
  } = props;
  const id = React.useId();
  const itemKey = item?.key || id;

  if (item === null) {
    return null;
  }

  if (React.isValidElement(item)) {
    return React.cloneElement(item, {
      key: itemKey,
    });
  }

  if ('subItems' in item) {
    return (
      <ActionsMenu
        key={itemKey}
        item={item}
        prefixCls={prefixCls}
        onClick={onClick}
        classNames={classNames}
        styles={styles}
        dropdownProps={dropdownProps}
      />
    );
  }

  return (
    <div
      className={className}
      style={style}
      onClick={(domEvent) => {
        if (item?.onItemClick) {
          item.onItemClick(item);
          return;
        }
        onClick?.({
          key: itemKey,
          item: item,
          keyPath: [itemKey],
          domEvent,
        });
      }}
      key={itemKey}
    >
      <Tooltip title={item.label}>
        <div className={`${prefixCls}-list-item-icon`}>{item?.icon}</div>
      </Tooltip>
    </div>
  );
};

export default Item;
