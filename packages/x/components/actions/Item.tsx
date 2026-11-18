import { Tooltip, type TooltipProps } from 'antd';
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

  // ============================ Tooltip ============================
  const tooltipConfig = item.tooltip;
  const tooltipEnabled = tooltipConfig !== false;
  const tooltipProps: TooltipProps =
    typeof tooltipConfig === 'string'
      ? { title: tooltipConfig }
      : (tooltipConfig as TooltipProps) || { title: item.label };

  const wrappedIcon =
    isMobile || !tooltipEnabled ? iconElement : <Tooltip {...tooltipProps}>{iconElement}</Tooltip>;

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
      {wrappedIcon}
    </div>
  );
};

export default Item;
