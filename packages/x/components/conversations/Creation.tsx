import classNames from 'classnames';
import * as React from 'react';
import type { ShortcutKeyInfoType } from '../_util/hooks/use-shortcut-keys';
import useCreation, { CreationLabelProps } from './hooks/useCreation';

type CreationLabelInfo = {
  shortcutKeyInfo?: ShortcutKeyInfoType;
  components: { CreationLabel: React.ComponentType<CreationLabelProps> };
};
export interface CreationProps {
  label?: React.ReactNode | ((info: CreationLabelInfo) => React.ReactNode);
  align?: 'start' | 'center' | 'end';
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  shortcutKeyInfo?: ShortcutKeyInfoType;
  disabled?: boolean;
  icon?: React.ReactNode | (() => React.ReactNode);
  onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Creation: React.FC<CreationProps> = ({
  className,
  icon,
  label,
  align,
  style,
  disabled,
  onClick,
  prefixCls,
  shortcutKeyInfo,
}) => {
  const [iconNode, labelNode, mergeAlign] = useCreation({
    prefixCls,
    label,
    icon,
    align,
    shortcutKeyInfo,
  });

  return (
    <button
      type="button"
      onClick={(e) => {
        if (disabled) {
          return;
        }
        onClick?.(e);
      }}
      style={style}
      className={classNames(prefixCls, className, `${prefixCls}-${mergeAlign}`, {
        [`${prefixCls}-disabled`]: disabled,
      })}
    >
      {iconNode}
      {labelNode}
    </button>
  );
};

export default Creation;
