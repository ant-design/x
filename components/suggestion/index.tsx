import { Cascader, Flex } from 'antd';
import type { CascaderProps } from 'antd';
import classnames from 'classnames';
import { useEvent, useMergedState } from 'rc-util';
import React, { useState } from 'react';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProvider } from '../x-provider';
import useStyle from './style';
import useActive from './useActive';

export type SuggestionItem = {
  label: React.ReactNode;
  value: string;

  icon?: React.ReactNode;

  children?: SuggestionItem[];

  extra?: React.ReactNode;
};

export interface RenderChildrenProps<T> {
  onTrigger: (info?: T | false) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export interface SuggestionProps<T = any> {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  children?: (props: RenderChildrenProps<T>) => React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: SuggestionItem[] | ((info?: T) => SuggestionItem[]);
  onSelect?: (value: string) => void;
  block?: boolean;
}

function Suggestion<T = any>(props: SuggestionProps<T>) {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    children,
    open,
    onOpenChange,
    items,
    onSelect,
    block,
  } = props;

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useXProvider();
  const prefixCls = getPrefixCls('suggestion', customizePrefixCls);
  const itemCls = `${prefixCls}-item`;

  const isRTL = direction === 'rtl';

  // ===================== Component Config =========================
  const compConfig = useXComponentConfig('suggestion');

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  // =========================== Trigger ============================
  const [mergedOpen, setOpen] = useMergedState(false, {
    value: open,
  });
  const [info, setInfo] = useState<T | undefined>();

  const triggerOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const onTrigger: RenderChildrenProps<T>['onTrigger'] = useEvent((nextInfo) => {
    if (nextInfo === false) {
      triggerOpen(false);
    } else {
      setInfo(nextInfo);
      triggerOpen(true);
    }
  });

  const onClose = () => {
    triggerOpen(false);
  };

  // ============================ Items =============================
  const itemList = React.useMemo(
    () => (typeof items === 'function' ? items(info) : items),
    [items, info],
  );

  // =========================== Cascader ===========================
  const optionRender: CascaderProps<SuggestionItem>['optionRender'] = (node) => {
    return (
      <Flex className={itemCls}>
        {node.icon && <div className={`${itemCls}-icon`}>{node.icon}</div>}
        {node.label}
        {node.extra && <div className={`${itemCls}-extra`}>{node.extra}</div>}
      </Flex>
    );
  };

  const onInternalChange = (valuePath: string[]) => {
    if (onSelect) {
      onSelect(valuePath[valuePath.length - 1]);
    }
    triggerOpen(false);
  };

  // ============================= a11y =============================
  const [activePath, onKeyDown] = useActive(itemList, mergedOpen, isRTL, onInternalChange, onClose);

  // =========================== Children ===========================
  const childNode = children?.({ onTrigger, onKeyDown });

  // ============================ Render ============================
  return wrapCSSVar(
    <Cascader
      options={itemList}
      open={mergedOpen}
      value={activePath}
      placement={isRTL ? 'topRight' : 'topLeft'}
      onDropdownVisibleChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      optionRender={optionRender}
      rootClassName={classnames(rootClassName, prefixCls, hashId, cssVarCls, {
        [`${prefixCls}-block`]: block,
      })}
      onChange={onInternalChange}
      dropdownMatchSelectWidth={block}
    >
      <div
        className={classnames(
          prefixCls,
          compConfig.className,
          rootClassName,
          className,
          `${prefixCls}-wrapper`,
          hashId,
          cssVarCls,
        )}
        style={{
          ...compConfig.style,
          ...style,
        }}
      >
        {childNode}
      </div>
    </Cascader>,
  );
}

if (process.env.NODE_ENV !== 'production') {
  Suggestion.displayName = 'Suggestion';
}

export default Suggestion;
