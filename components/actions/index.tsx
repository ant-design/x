import { Tooltip, TooltipProps } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { ReactNode } from 'react';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import ActionMenu from './ActionMenu';
import { ActionItemType, ActionsProps, ItemType } from './interface';
import useStyle from './style';

export { ActionsProps } from './interface';

const Actions = (props: ActionsProps) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName = {},
    style = {},
    variant = 'borderless',
    block = false,
    onClick,
    items = [],
  } = props;
  // ============================ PrefixCls ============================
  const { getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('actions', customizePrefixCls);

  // ======================= Component Config =======================
  const contextConfig = useXComponentConfig('actions');

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    prefixCls,
    contextConfig.className,
    rootClassName,
    cssVarCls,
    hashId,
  );

  const mergedStyle = {
    ...style,
    ...contextConfig.style,
  };

  const getTooltipNode = (node: ReactNode, title?: string, tooltipProps?: TooltipProps) => {
    if (title) {
      return (
        <Tooltip {...tooltipProps} title={title}>
          {node}
        </Tooltip>
      );
    }
    return node;
  };

  const handleItemClick = (
    key: string,
    item: ActionItemType,
    domEvent: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    onClick?.({
      key,
      item,
      keyPath: [key],
      domEvent,
    });
  };

  const renderSingleItem = (item: ItemType) => {
    const { icon, label, key } = item;

    return (
      <div
        className={classnames(`${prefixCls}-list-item`)}
        onClick={(domEvent) => handleItemClick(key, item, domEvent)}
        key={key}
      >
        {getTooltipNode(<div className={`${prefixCls}-list-item-icon`}>{icon}</div>, label)}
      </div>
    );
  };

  return wrapCSSVar(
    <div className={mergedCls} style={mergedStyle}>
      <div className={classnames(`${prefixCls}-list`, variant, block)}>
        {items.map((item) => {
          if ('children' in item) {
            return (
              <ActionMenu key={item.key} item={item} prefixCls={prefixCls} onClick={onClick} />
            );
          }
          return renderSingleItem(item);
        })}
      </div>
    </div>,
  );
};

if (process.env.NODE_ENV === 'production') {
  Actions.displayName = 'Actions';
}

export default Actions;
