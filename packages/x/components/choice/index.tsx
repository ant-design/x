import CSSMotion from '@rc-component/motion';
import { composeRef } from '@rc-component/util/lib/ref';
import { Button, Skeleton, Typography } from 'antd';
import { clsx } from 'clsx';
import React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useLocale } from '../locale';
import enUS from '../locale/en_US';
import { useXProviderContext } from '../x-provider';
import { ChoiceContext } from './context';
import useSelect from './hooks/use-select';
import ChoiceItem from './Item';
import type { ChoiceProps, ChoiceRef, ChoiceValueType } from './interface';
import useStyle from './style';

const ForwardChoice = React.forwardRef<ChoiceRef, ChoiceProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    items: rawItems,
    mode = 'single',
    layout = 'list',
    value,
    defaultValue,
    onChange,
    onItemClick,
    onConfirm,
    title,
    description,
    footer,
    disabled = false,
    loading = false,
    maxCount,
    indicator: customIndicator,
    confirmable = false,
    confirmText,
    fadeIn,
    fadeInLeft,
    className,
    rootClassName,
    classNames = {},
    styles = {},
    style,
    ...htmlProps
  } = props;

  const items = rawItems || [];

  // ============================ PrefixCls ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('choice', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('choice');

  // ============================ Style ============================
  const [hashId, cssVarCls] = useStyle(prefixCls);

  // ============================ Locale ============================
  const [locale] = useLocale('Choice', enUS.Choice);

  // ============================ Indicator =========================
  const indicator = customIndicator ?? (mode === 'single' ? 'radio' : 'check');

  // ============================ Select ============================
  const { mergedValue, handleItemClick, isSelected } = useSelect({
    mode,
    value,
    defaultValue,
    onChange,
    maxCount,
    disabled,
    items,
  });

  // ============================= Refs =============================
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  useProxyImperativeHandle(ref, () => ({
    nativeElement: containerRef.current!,
    scrollTo: (key: ChoiceValueType) => {
      const itemEl = listRef.current?.querySelector(`[${'data-key'}="${key}"]`);
      itemEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
    getValue: () => {
      if (mode === 'single') return mergedValue[0];
      return mergedValue;
    },
  }));

  // ============================= Motion =============================
  const rootPrefixCls = getPrefixCls();
  const motionName =
    fadeInLeft || fadeIn ? `${rootPrefixCls}-x-fade${fadeInLeft ? '-left' : ''}` : '';

  // ============================ Render ============================
  const mergedCls = clsx(
    prefixCls,
    contextConfig.className,
    className,
    rootClassName,
    classNames.root,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

  const mergedListCls = clsx(
    `${prefixCls}-list`,
    `${prefixCls}-layout-${layout}`,
    contextConfig.classNames.list,
    classNames.list,
  );

  const renderHeader = () => {
    if (!title && !description) return null;
    return (
      <div
        className={clsx(`${prefixCls}-header`, contextConfig.classNames.header, classNames.header)}
        style={{ ...contextConfig.styles.header, ...styles.header }}
      >
        {title && (
          <Typography.Title
            level={5}
            className={clsx(`${prefixCls}-title`, contextConfig.classNames.title, classNames.title)}
            style={{ ...contextConfig.styles.title, ...styles.title }}
          >
            {title}
          </Typography.Title>
        )}
        {description && (
          <div
            className={clsx(
              `${prefixCls}-description`,
              contextConfig.classNames.description,
              classNames.description,
            )}
            style={{ ...contextConfig.styles.description, ...styles.description }}
          >
            {description}
          </div>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    if (!footer && !confirmable) return null;

    const selectedCount = mergedValue.length;
    const maxText = mode === 'multiple' && maxCount ? `${selectedCount}/${maxCount}` : null;

    return (
      <div
        className={clsx(`${prefixCls}-footer`, contextConfig.classNames.footer, classNames.footer)}
        style={{ ...contextConfig.styles.footer, ...styles.footer }}
      >
        {footer}
        {maxText && <span className={`${prefixCls}-footer-count`}>{maxText}</span>}
        {confirmable && (
          <Button
            type="primary"
            disabled={selectedCount === 0}
            onClick={() => {
              if (onConfirm) {
                const val = mode === 'single' ? mergedValue[0] : mergedValue;
                onConfirm(val, {
                  value: val,
                  items,
                  changedItems: [],
                  type: 'select',
                });
              }
            }}
          >
            {confirmText || locale.confirmText}
          </Button>
        )}
      </div>
    );
  };

  return (
    <CSSMotion motionName={motionName}>
      {({ className: motionClassName }, motionRef) => {
        return (
          <div
            {...htmlProps}
            ref={composeRef(containerRef, motionRef)}
            className={clsx(mergedCls, motionClassName)}
            style={{ ...style, ...contextConfig.style, ...styles.root }}
          >
            {/* Header */}
            {renderHeader()}

            {/* List */}
            <div
              ref={listRef}
              className={mergedListCls}
              style={{ ...contextConfig.styles.list, ...styles.list }}
              data-role={mode === 'single' ? 'radiogroup' : 'group'}
            >
              {loading ? (
                <div className={`${prefixCls}-loading`}>
                  <Skeleton active paragraph={{ rows: 2 }} />
                </div>
              ) : (
                <ChoiceContext.Provider
                  value={{
                    prefixCls,
                    mode,
                    disabled,
                    indicator,
                    selectedKeys: mergedValue,
                    isSelected,
                    onItemClick: (item, index) => {
                      handleItemClick(item, index);
                      onItemClick?.({ data: item, index });
                    },
                    classNames,
                    styles,
                  }}
                >
                  {items.map((item, index) => {
                    return (
                      <div key={item.key} data-key={item.key}>
                        <ChoiceItem item={item} index={index} />
                        {/* Nested children */}
                        {item.children && item.children.length > 0 && (
                          <div className={`${prefixCls}-nested`}>
                            {item.children.map((child, childIndex) => (
                              <ChoiceItem key={child.key} item={child} index={childIndex} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </ChoiceContext.Provider>
              )}
            </div>

            {/* Footer */}
            {renderFooter()}
          </div>
        );
      }}
    </CSSMotion>
  );
});

type CompoundedChoice = typeof ForwardChoice;

const Choice = ForwardChoice as CompoundedChoice;

if (process.env.NODE_ENV !== 'production') {
  Choice.displayName = 'Choice';
}

export default Choice;
