import { Button } from 'antd';
import classnames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import pickAttrs from 'rc-util/lib/pickAttrs';
import * as React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import { SenderContext } from './context';
import useStyle from './style';

type SemanticType = 'root' | 'content' | 'icon' | 'title';
export interface SenderSwitchProps
  extends Omit<
    React.HTMLAttributes<HTMLLIElement>,
    'onClick' | 'value' | 'defaultValue' | 'onChange'
  > {
  prefixCls?: string;
  rootClassName?: string;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  value?: boolean;
  defaultValue?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
}

type SenderSwitchRef = {
  nativeElement: HTMLDivElement;
};

const SenderSwitch = React.forwardRef<SenderSwitchRef, SenderSwitchProps>((props, ref) => {
  const {
    children,
    className,
    classNames = {},
    styles = {},
    icon,
    style,
    onChange,
    rootClassName,
    loading,
    defaultValue,
    value: customValue,
    checkedChildren,
    unCheckedChildren,
    disabled,
    prefixCls: customizePrefixCls,
    ...restProps
  } = props;

  const {
    styles: contextStyles = {},
    classNames: contextClassNames = {},
    prefixCls: contextPrefixCls,
  } = React.useContext(SenderContext);

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  const id = React.useId();

  // ============================ Prefix ============================
  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('sender', customizePrefixCls || contextPrefixCls);
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
        onChange?.(key as boolean);
      },
    },
  );

  // ============================ style ============================
  const contextConfig = useXComponentConfig('sender');

  const mergedCls = classnames(
    switchCls,
    className,
    rootClassName,
    contextConfig.classNames.switch,
    contextClassNames.switch,
    classNames.root,
    hashId,
    cssVarCls,
    {
      [`${switchCls}-checked`]: mergedChecked,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

  return (
    <div
      ref={containerRef}
      className={mergedCls}
      key={id}
      style={{
        ...style,
        ...contextConfig.styles.switch,
        ...contextStyles.switch,
        ...styles.root,
      }}
      {...domProps}
    >
      <Button
        disabled={disabled}
        loading={loading}
        styles={{
          icon: styles.icon,
          root: styles.content,
          content: styles.title,
        }}
        classNames={{
          root: classnames(`${switchCls}-content`, classNames.content),
          icon: classNames.icon,
          content: classNames.title,
        }}
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
