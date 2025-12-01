import type { CascaderProps } from 'antd';
import { Cascader, Flex } from 'antd';
import classnames from 'classnames';
import { useEvent, useMergedState } from 'rc-util';
import React from 'react';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { AnyObject } from '../_util/type';
import { useXProviderContext } from '../x-provider';
import useStyle from './style';
import useActive from './useActive';

type SemanticType = 'root' | 'content' | 'popup';
export interface SuggestionItem extends AnyObject {
  label: React.ReactNode;
  value: string;
  icon?: React.ReactNode;
  children?: SuggestionItem[];
  extra?: React.ReactNode;
}

export interface RenderChildrenProps<T> {
  onTrigger: (info?: T | false) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export interface SuggestionProps<T = any>
  extends Omit<
    CascaderProps,
    | 'children'
    | 'onChange'
    | 'optionRender'
    | 'value'
    | 'options'
    | 'multiple'
    | 'showSearch'
    | 'defaultValue'
    | 'fieldNames'
    | 'onOpenChange'
    | 'onDropdownVisibleChange'
    | 'dropdownMatchSelectWidth'
    | 'open'
    | 'rootClassName'
    | 'placement'
    | 'styles'
    | 'classNames'
  > {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  children?: (props: RenderChildrenProps<T>) => React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: SuggestionItem[] | ((info?: T) => SuggestionItem[]);
  onSelect?: (value: string, info: SuggestionItem[]) => void;
  block?: boolean;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  classNames?: Partial<Record<SemanticType, string>>;
}

function Suggestion<T = any>(props: SuggestionProps<T>) {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    classNames = {},
    styles = {},
    style,
    children,
    open,
    onOpenChange,
    items,
    onSelect,
    block,
    ...otherProps
  } = props;

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('suggestion', customizePrefixCls);
  const itemCls = `${prefixCls}-item`;

  const isRTL = direction === 'rtl';

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('suggestion');

  // ============================ Styles ============================
  const [hashId, cssVarCls] = useStyle(prefixCls);

  // =========================== Trigger ============================
  const [mergedOpen, setOpen] = useMergedState(false, {
    value: open,
  });

  const [itemList, setItemList] = useMergedState<SuggestionItem[]>([], {
    value: typeof items === 'function' ? undefined : items,
    defaultValue: typeof items === 'function' ? items() : items,
  });

  const triggerOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const onTrigger: RenderChildrenProps<T>['onTrigger'] = useEvent((nextInfo) => {
    if (nextInfo === false) {
      triggerOpen(false);
    } else {
      if (typeof items === 'function') {
        setItemList(items(nextInfo));
      }
      triggerOpen(true);
    }
  });

  const onClose = () => {
    triggerOpen(false);
  };

  // ============================ Items =============================

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

  const onInternalChange = (valuePath: string[], selectedOptions: SuggestionItem[]) => {
    if (onSelect) {
      onSelect(valuePath[valuePath.length - 1], selectedOptions);
    }
    triggerOpen(false);
  };

  // ============================= a11y =============================
  const [activePath, onKeyDown] = useActive(itemList, mergedOpen, isRTL, onClose);

  // =========================== Children ===========================
  const childNode = children?.({ onTrigger, onKeyDown });

  // ============================ Render ============================
  const onInternalOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  const compatibleProps: Pick<
    Partial<CascaderProps<SuggestionItem>>,
    'onDropdownVisibleChange' | 'onOpenChange'
  > = {};

  /* istanbul ignore else */

  compatibleProps.onOpenChange = onInternalOpenChange;

  return (
    <Cascader
      {...otherProps}
      options={itemList}
      open={mergedOpen}
      value={activePath}
      multiple={false}
      placement={isRTL ? 'topRight' : 'topLeft'}
      {...compatibleProps}
      optionRender={optionRender}
      rootClassName={classnames(rootClassName, classNames.root, prefixCls, hashId, cssVarCls, {
        [`${prefixCls}-block`]: block,
      })}
      classNames={{
        root: classNames.root,
        popup: {
          root: classNames.popup,
        },
      }}
      styles={{
        popup: {
          root: styles.popup,
        },
      }}
      style={{ ...contextConfig.style, ...styles.root, ...style }}
      onChange={onInternalChange}
      popupMatchSelectWidth={block}
    >
      <div
        className={classnames(
          prefixCls,
          rootClassName,
          contextConfig.classNames.content,
          classNames.content,
          `${prefixCls}-content`,
          hashId,
          cssVarCls,
        )}
        style={{
          ...contextConfig.styles.content,
          ...styles.content,
        }}
      >
        {childNode}
      </div>
    </Cascader>
  );
}

if (process.env.NODE_ENV !== 'production') {
  Suggestion.displayName = 'Suggestion';
}

export default Suggestion;
