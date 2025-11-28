import { Tooltip } from 'antd';
import clsx from 'clsx';
import React from 'react';
import ActionsMenu from './ActionsMenu';
import { ActionsContext } from './context';
import type { ActionsItemProps } from './interface';

const Item: React.FC<ActionsItemProps> = (props) => {
  const { item, onClick, dropdownProps = {} } = props;
  const { prefixCls, classNames = {}, styles = {} } = React.useContext(ActionsContext) || {};

  const id = React.useId();
  const itemKey = item?.key || id;

  if (!item) {
    return null;
  }

  if (item.actionRender) {
    return typeof item.actionRender === 'function' ? item.actionRender(item) : item.actionRender;
  }

  if (item.subItems) {
    return (
      <ActionsMenu key={itemKey} item={item} onClick={onClick} dropdownProps={dropdownProps} />
    );
  }

  return (
    <div
      className={clsx(`${prefixCls}-item`, classNames.item, {
        [`${prefixCls}-list-danger`]: item?.danger,
      })}
      style={styles.item}
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
        <div className={`${prefixCls}-icon`}>{item?.icon}</div>
      </Tooltip>
    </div>
  );
};

export default Item;
