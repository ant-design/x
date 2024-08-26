import { Input, Popover } from 'antd';
import classnames from 'classnames';
import useStyle from './style';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useConfigContext from '../config-provider/useConfigContext';
import type { TooltipProps, InputProps } from 'antd';

export type Suggestion = {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  value: string;
  extra?: React.ReactNode;
};

export type SuggestionsProps = {
  prefixCls?: string;
  suggestions: Suggestion[];
  triggerCharacter?: string;
  children?: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
};

const Suggestions: React.FC<
  SuggestionsProps & Pick<InputProps, 'placeholder'> & Pick<TooltipProps, 'placement'>
> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    suggestions,
    placement = 'topLeft',
    placeholder,
    triggerCharacter = '/',
    style,
    children,
  } = props;

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useConfigContext();
  const prefixCls = getPrefixCls('suggestions', customizePrefixCls);

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const mergedCls = classnames(className, rootClassName, prefixCls, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Suggestion[]>([]);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<any>(null);

  const handleSearch = (searchText: string) => {
    if (searchText.startsWith(triggerCharacter)) {
      setVisible(true);
      const filteredSuggestions = suggestions.filter((item) =>
        item.value.toLowerCase().includes(searchText.slice(1).toLowerCase()),
      );
      setOptions(filteredSuggestions);
    } else {
      setVisible(false);
    }
    setInputValue(searchText);
  };

  const handleSelect = (value: string) => {
    const selectedSuggestion = suggestions.find((item) => item.value === value);

    if (selectedSuggestion && selectedSuggestion.onClick) {
      selectedSuggestion.onClick();
    }
    setInputValue('');
    setVisible(false);
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        setActiveIndex((prevIndex) => (prevIndex + 1) % options.length);
      } else if (event.key === 'ArrowUp') {
        setActiveIndex((prevIndex) => (prevIndex - 1 + options.length) % options.length);
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        handleSelect(options[activeIndex].value);
      }
    },
    [options, activeIndex],
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
      {options.map((item, index) => (
        <div
          key={item.id}
          onMouseDown={() => handleSelect(item.value)}
          onMouseEnter={() => setActiveIndex(index)}
          className={classnames(
            `${prefixCls}-item`,
            item.className,
            index === activeIndex && `${prefixCls}-item-active`,
          )}
        >
          {item.icon && (
            <div className={classnames(`${prefixCls}-suggestion-icon`)}>{item.icon}</div>
          )}
          <div className={classnames(`${prefixCls}-suggestion-label`)}>{item.label}</div>
          {item.extra && (
            <div className={classnames(`${prefixCls}-suggestion-extra`)}>{item.extra}</div>
          )}
        </div>
      ))}
    </div>
  );

  return wrapCSSVar(
    <div className={mergedCls} style={style}>
      <Popover
        content={content}
        // open={visible}
        open
        placement={placement}
        arrow={false}
        overlayStyle={{
          width: inputRef.current?.clientWidth,
        }}
      >
        <div ref={inputRef} className={classnames(`${prefixCls}-input`)}>
          {children || (
            <Input
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}
        </div>
      </Popover>
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Suggestions.displayName = 'Suggestions';
}

export default Suggestions;
