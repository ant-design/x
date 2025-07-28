import { Button } from 'antd';
import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import pickAttrs from 'rc-util/lib/pickAttrs';
import * as React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import { useXProviderContext } from '../x-provider';
import useStyle from './style';

export interface SenderSwitchProps
  extends Omit<
    React.HTMLAttributes<HTMLLIElement>,
    'onClick' | 'value' | 'defaultValue' | 'onChange'
  > {
  prefixCls?: string;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  value?: boolean;
  defaultValue?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (checked: boolean) => void;
}

type SenderSwitchRef = {
  nativeElement: HTMLDivElement;
};

const SenderSwitch = React.forwardRef<SenderSwitchRef, SenderSwitchProps>((props, ref) => {
  const {
    children,
    className,
    icon,
    style,
    onChange,
    loading,
    defaultValue,
    value: customValue,
    checkedChildren,
    unCheckedChildren,
    disabled,
    prefixCls: customizePrefixCls,
    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  const id = React.useId();

  // ============================ Prefix ============================
  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('sender', customizePrefixCls);
  const switchCls = `${prefixCls}-switch`;
  const [hashId, cssVarCls] = useStyle(prefixCls);

  // ============================= Refs =============================
  const containerRef = React.useRef<HTMLDivElement>(null);

  useProxyImperativeHandle(ref, () => {
    return {
      nativeElement: containerRef.current!,
    };
  });

  // ============================ Checked ============================
  const [mergedChecked, setMergedChecked] = useMergedState<SenderSwitchProps['value']>(
    defaultValue,
    {
      value: customValue,
      onChange: (key) => {
        onChange?.(key || false);
      },
    },
  );

  return (
    <div
      ref={containerRef}
      className={classNames(prefixCls, switchCls, className, hashId, cssVarCls, {
        [`${switchCls}-checked`]: mergedChecked,
        [`${switchCls}-rtl`]: direction === 'rtl',
      })}
      key={id}
      style={{
        ...style,
      }}
      {...domProps}
    >
      <Button
        disabled={disabled}
        loading={loading}
        className={classNames(`${switchCls}-content`)}
        variant="outlined"
        color={mergedChecked ? 'primary' : 'default'}
        icon={icon}
        onClick={() => {
          setMergedChecked(!mergedChecked);
        }}
      >
        {mergedChecked ? checkedChildren : unCheckedChildren}
        {children}
      </Button>
    </div>
  );
});

export default SenderSwitch;
