import { Input, Popover } from 'antd';
import classnames from 'classnames';
import useStyle from './style';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useConfigContext from '../config-provider/useConfigContext';
import type { TooltipProps, InputProps } from 'antd';
import { useMergedState } from 'rc-util';

export type SuggestionItem = {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  value: string;
  extra?: React.ReactNode;
};

export type SuggestionProps = {
  prefixCls?: string;
  items: SuggestionItem[];
  triggerCharacter?: string;
  children?: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
};

const Suggestion: React.FC<
  SuggestionProps & Pick<InputProps, 'placeholder'> & Pick<TooltipProps, 'placement'>
> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    items,
    placement = 'topLeft',
    value: outValue,
    onChange: outOnChange,
    placeholder,
    triggerCharacter = '/',
    style,
    children,
  } = props;

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useConfigContext();
  const prefixCls = getPrefixCls('suggestion', customizePrefixCls);

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
  const content = (
    <div className={classnames(`${prefixCls}-container`, hashId)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          onMouseDown={() => handleSelect(item.value)}
          onClick={() => item?.onClick && item?.onClick()}
          onMouseEnter={() => setActiveIndex(index)}
          className={classnames(
            `${prefixCls}-item`,
            item.className,
            index === activeIndex && `${prefixCls}-item-active`,
          )}
        >
          {item.icon && <div className={classnames(`${prefixCls}-item-icon`)}>{item.icon}</div>}
          <div className={classnames(`${prefixCls}-item-label`)}>{item.label}</div>
          {item.extra && <div className={classnames(`${prefixCls}-item-extra`)}>{item.extra}</div>}
        </div>
      ))}
    </div>
  );

  return wrapCSSVar(
    <div className={mergedCls} style={style}>
      <Popover
        content={content}
        open={visible}
        placement={placement}
        arrow={false}
        overlayStyle={{
          width: inputRef.current?.clientWidth,
        }}
      >
        <div ref={inputRef} className={classnames(`${prefixCls}-input`)}>
          {children ? (
            React.cloneElement(children as React.ReactElement, {
              value: inputValue,
              onChange: setInputValue,
              placeholder,
            })
          ) : (
            <Input
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
          )}
        </div>
      </Popover>
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Suggestion.displayName = 'Suggestion';
}

export default Suggestion;
