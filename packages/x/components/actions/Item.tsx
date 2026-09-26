import { Tooltip } from 'antd';
import { clsx } from 'clsx';
import React from 'react';
import useMobile from '../_util/hooks/use-mobile';
import ActionsMenu from './ActionsMenu';
import { ActionsContext } from './context';
import type { ActionsItemProps } from './interface';

const Item: React.FC<ActionsItemProps> = (props) => {
  const { item, onClick, dropdownProps = {} } = props;
  const { prefixCls, classNames = {}, styles = {} } = React.useContext(ActionsContext) || {};
  const isMobile = useMobile();

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

  const iconElement = <div className={`${prefixCls}-icon`}>{item?.icon}</div>;

  // Resolve tooltip config:
  // - `false`: no Tooltip rendered
  // - `string`/`number`: used as the tooltip title
  // - `TooltipProps` object: merged on top of the default `title={label}`
  // - `undefined`: default `title={label}`
  const tooltipProps =
    item.tooltip === false
      ? null
      : typeof item.tooltip === 'string' || typeof item.tooltip === 'number'
        ? { title: item.tooltip }
        : { title: item.label, ...(item.tooltip || {}) };

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
      {isMobile || tooltipProps === null ? (
        iconElement
      ) : (
        <Tooltip {...tooltipProps}>{iconElement}</Tooltip>
      )}
    </div>
  );
};

export default Item;
