import { Cascader, Flex, Input, Popover, Space } from 'antd';
import classnames from 'classnames';
import useStyle from './style';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useConfigContext from '../config-provider/useConfigContext';
import type { TooltipProps, InputProps, CascaderProps } from 'antd';
import { useEvent, useMergedState } from 'rc-util';
import useActive from './useActive';

export type SuggestionItem = {
  // id: string;
  label: React.ReactNode;
  value: string;

  icon?: React.ReactNode;

  className?: string;
  children?: SuggestionItem[];
  // onClick?: () => void;

  extra?: React.ReactNode;
};

export interface RenderChildrenProps<T> {
  onTrigger: (info?: T) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export interface SuggestionProps<T = any> {
  prefixCls?: string;
  // items: SuggestionItem[];
  triggerCharacter?: string;
  // children?: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  // onChange?: (value: string) => void;
  value?: string;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;

  // Refactor
  children?: (props: RenderChildrenProps<T>) => React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: SuggestionItem[] | ((info?: T) => SuggestionItem[]);
  onSelect?: (value: string) => void;
}

// React.FC<
//   SuggestionProps & Pick<InputProps, 'placeholder'> & Pick<TooltipProps, 'placement'>
// >

function Suggestion<T = any>(props: SuggestionProps<T>) {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    placement = 'topLeft',
    value: outValue,
    onChange: outOnChange,
    placeholder,
    triggerCharacter = '/',
    style,

    children,
    open,
    onOpenChange,
    items,
    onSelect,
  } = props;

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useConfigContext();
  const prefixCls = getPrefixCls('suggestion', customizePrefixCls);
  const itemCls = `${prefixCls}-item`;

  const isRTL = direction === 'rtl';

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const mergedCls = classnames(className, rootClassName, prefixCls, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  const [inputValue, setInputValue] = useMergedState('', {
    value: outValue,
    onChange: outOnChange,
  });
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<any>(null);
  const handleSearch = (searchText: string) => {
    if (searchText.startsWith(triggerCharacter)) {
      setVisible(true);
    } else {
      setVisible(false);
    }
    setInputValue(searchText);
  };

  const handleSelect = (value: string) => {
    const selectedSuggestion = items.find((item) => item.value === value);
    if (selectedSuggestion && selectedSuggestion.onClick) {
      selectedSuggestion.onClick();
    }
    setInputValue(value);
    setVisible(false);
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault();
        handleSelect(items[activeIndex].value);
      }
    },
    [items, activeIndex],
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.oninput = (e: any) => handleSearch(e.target.value);
      inputRef.current.onkeydown = handleKeyDown;
    }
  }, [children, handleKeyDown]);

  // ============================ Render ============================
  // const content = (
  //   <div className={classnames(`${prefixCls}-container`, hashId)}>
  //     {items.map((item, index) => (
  //       <div
  //         key={item.id}
  //         onMouseDown={() => handleSelect(item.value)}
  //         onClick={() => item?.onClick && item?.onClick()}
  //         onMouseEnter={() => setActiveIndex(index)}
  //         className={classnames(
  //           `${prefixCls}-item`,
  //           item.className,
  //           index === activeIndex && `${prefixCls}-item-active`,
  //         )}
  //       >
  //         {item.icon && <div className={classnames(`${prefixCls}-item-icon`)}>{item.icon}</div>}
  //         <div className={classnames(`${prefixCls}-item-label`)}>{item.label}</div>
  //         {item.extra && <div className={classnames(`${prefixCls}-item-extra`)}>{item.extra}</div>}
  //       </div>
  //     ))}
  //   </div>
  // );

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
    setInfo(nextInfo);
    triggerOpen(true);
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
      rootClassName={classnames(className, rootClassName, prefixCls, hashId, cssVarCls)}
      onChange={onInternalChange}
    >
      <div>{childNode}</div>
    </Cascader>,
  );
}

if (process.env.NODE_ENV !== 'production') {
  Suggestion.displayName = 'Suggestion';
}

export default Suggestion;
