import { Tooltip } from 'antd';
import classnames from 'classnames';
import React from 'react';

import { ActionsContext } from '.';
import ActionsMenu from './ActionsMenu';
import type { ActionsItemProps } from './interface';

const Item: React.FC<ActionsItemProps> = (props) => {
  const { item, onClick, dropdownProps = {} } = props;
  const { prefixCls, classNames = {}, styles = {} } = React.useContext(ActionsContext) || {};

  const id = React.useId();
  const itemKey = item?.key || id;

  if (item === null) {
    return null;
  }

  if (item?.actionRender) {
    return item?.actionRender(item);
  }

  if ('subItems' in item) {
    return (
      <ActionsMenu key={itemKey} item={item} onClick={onClick} dropdownProps={dropdownProps} />
    );
  }

  return (
    <div
      className={classnames(`${prefixCls}-list-item`, classNames.item, {
        danger: item?.danger,
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
        <div className={`${prefixCls}-list-item-icon`}>{item?.icon}</div>
      </Tooltip>
    </div>
  );
};

export default Item;
