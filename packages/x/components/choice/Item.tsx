import { CheckCircleFilled } from '@ant-design/icons';
import { Radio } from 'antd';
import { clsx } from 'clsx';
import React from 'react';
import { ChoiceContext } from './context';
import type { ChoiceItemType } from './interface';

export interface ChoiceItemProps {
  item: ChoiceItemType;
  index: number;
}

const ChoiceItem: React.FC<ChoiceItemProps> = ({ item, index }) => {
  const context = React.useContext(ChoiceContext);
  const {
    prefixCls,
    mode,
    disabled: groupDisabled,
    indicator,
    isSelected,
    onItemClick,
    classNames,
    styles,
  } = context;

  const selected = isSelected(item.key);
  const disabled = groupDisabled || item.disabled;
  const isNumber = indicator === 'number';

  const itemCls = clsx(`${prefixCls}-item`, classNames?.item, {
    [`${prefixCls}-item-selected`]: selected,
    [`${prefixCls}-item-disabled`]: disabled,
    [`${prefixCls}-item-recommended`]: item.recommended,
    [`${prefixCls}-item-recommended-primary`]:
      item.recommended === 'primary' || item.recommended === true,
    [`${prefixCls}-item-recommended-secondary`]: item.recommended === 'secondary',
  });

  const renderIndicator = () => {
    if (indicator === 'none') return null;

    const indicatorCls = clsx(`${prefixCls}-indicator`, classNames?.indicator);

    if (indicator === 'check') {
      return (
        <span className={indicatorCls} style={styles?.indicator}>
          {selected && <CheckCircleFilled style={{ color: 'inherit' }} />}
        </span>
      );
    }

    if (indicator === 'radio') {
      return (
        <span className={indicatorCls} style={styles?.indicator}>
          <Radio checked={selected} disabled={disabled} />
        </span>
      );
    }

    if (isNumber) {
      return (
        <span className={indicatorCls} style={styles?.indicator}>
          {selected ? (
            <CheckCircleFilled />
          ) : (
            <span className={`${prefixCls}-indicator-number`}>{index + 1}</span>
          )}
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className={itemCls}
      style={styles?.item}
      data-role={mode === 'single' ? 'radio' : 'checkbox'}
      data-selected={selected}
      data-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (disabled) return;
        onItemClick(item, index);
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onItemClick(item, index);
        }
      }}
    >
      {/* Indicator */}
      {renderIndicator()}

      {/* Content */}
      <div
        className={clsx(`${prefixCls}-item-content`, classNames?.itemContent)}
        style={styles?.itemContent}
      >
        {/* Icon + Label row */}
        {item.icon && <div className={`${prefixCls}-item-icon`}>{item.icon}</div>}

        {item.label && <div className={`${prefixCls}-item-label`}>{item.label}</div>}

        {item.description && <div className={`${prefixCls}-item-desc`}>{item.description}</div>}

        {item.extra && <div className={`${prefixCls}-item-extra`}>{item.extra}</div>}
      </div>

      {/* Recommended badge */}
      {(item.recommended === true || item.recommended === 'primary') && (
        <div className={`${prefixCls}-item-recommend-badge`}>
          {item.recommendedReason || 'AI Recommended'}
        </div>
      )}
      {item.recommended === 'secondary' && (
        <div
          className={`${prefixCls}-item-recommend-badge ${prefixCls}-item-recommend-badge-secondary`}
        >
          {item.recommendedReason || 'Recommended'}
        </div>
      )}

      {/* Disabled reason */}
      {disabled && item.disabledReason && (
        <div className={`${prefixCls}-item-disabled-reason`}>{item.disabledReason}</div>
      )}
    </div>
  );
};

export default ChoiceItem;
