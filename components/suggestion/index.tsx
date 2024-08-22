import { AutoComplete, AutoCompleteProps, Input } from 'antd';
import classnames from 'classnames';

import useStyle from './style';
import React, { useState } from 'react';
import useConfigContext from '../config-provider/useConfigContext';

export type Suggestion = {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
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

const { Option } = AutoComplete;

const Suggestions: React.FC<SuggestionsProps & Pick<AutoCompleteProps, 'placement'>> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    suggestions,
    placement = 'topLeft',
    triggerCharacter = '/',
    style,
    children,
    ...rest
  } = props;

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useConfigContext();
  const prefixCls = getPrefixCls('Suggestion', customizePrefixCls);

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const mergedCls = classnames(className, rootClassName, prefixCls, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Suggestion[]>([]);
  const [visible, setVisible] = useState(false);

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

  const handleSelect = (value: string, option: any) => {
    const selectedSuggestion = suggestions.find((item) => item.value === value);
    console.log("selectedSuggestion",selectedSuggestion);

    if (selectedSuggestion && selectedSuggestion.onClick) {
      selectedSuggestion.onClick();
    }
    setInputValue('');
    setVisible(false);
  };

  // ============================ Render ============================
  return wrapCSSVar(
    <div className={mergedCls} style={style}>
      <AutoComplete
        value={inputValue}
        // open={visible}
        open={true}
        placement={placement}
        options={options.map((item) => ({
          value: item.value,
          label: (
            <div>
              {item.icon && <span>{item.icon}</span>}
              {item.label}
              {item.extra && <span>{item.extra}</span>}
            </div>
          ),
        }))}
        
        onSearch={handleSearch}
        onSelect={handleSelect}
      >
        {children || (
          <Input
            placeholder="输入 '/' 触发快捷指令"
            onChange={(e) => handleSearch(e.target.value)}
          />
        )}
      </AutoComplete>
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Suggestions.displayName = 'Suggestions';
}

export default Suggestions;
