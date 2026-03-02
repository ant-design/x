import pickAttrs from '@rc-component/util/lib/pickAttrs';
import { clsx } from 'clsx';
import React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import { useXProviderContext } from '../x-provider';
import Status, { THOUGHT_CHAIN_ITEM_STATUS } from './Status';
import useStyle from './style';

enum VARIANT {
  SOLID = 'solid',
  OUTLINED = 'outlined',
  TEXT = 'text',
}

export type SemanticType = 'root' | 'icon' | 'title' | 'description';

export interface ThoughtChainItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'content'> {
  /**
   * @desc 思维节点唯一标识符
   * @descEN Unique identifier
   */
  key?: string;

  /**
   * @desc 自定义前缀
   * @descEN Prefix
   */
  prefixCls?: string;

  /**
   * @desc 思维节点图标
   * @descEN Thought chain item icon
   */
  icon?: React.ReactNode;

  /**
   * @desc 思维节点标题
   * @descEN Thought chain item title
   */
  title?: React.ReactNode;

  /**
   * @desc 思维节点描述
   * @descEN Thought chain item description
   */
  description?: React.ReactNode;

  /**
   * @desc 根节点样式类
   * @descEN Root node style class.
   */
  rootClassName?: string;

  /**
   * @desc 思维节点状态
   * @descEN Thought chain item status
   */
  status?: `${THOUGHT_CHAIN_ITEM_STATUS}`;
  /**
   * @desc 思维节点变体
   * @descEN Thought chain item variant
   */
  variant?: `${VARIANT}`;
  /**
   * @desc 闪烁
   * @descEN blink
   */
  blink?: boolean;
  /**
   * @desc 自定义样式类名
   * @descEN Custom CSS class name
   */
  className?: string;
  /**
   * @desc 语义化样式类名配置
   * @descEN Semantic class names configuration
   */
  classNames?: Partial<Record<SemanticType, string>>;
  /**
   * @desc 自定义内联样式
   * @descEN Custom inline styles
   */
  style?: React.CSSProperties;
  /**
   * @desc 语义化样式配置
   * @descEN Semantic styles configuration
   */
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  /**
   * @desc 是否禁用
   * @descEN Whether disabled
   */
  disabled?: boolean;
}

type ItemRef = {
  nativeElement: HTMLElement;
};
const Item = React.forwardRef<ItemRef, ThoughtChainItemProps>((props, ref) => {
  // ============================ Info ============================
  const {
    key,
    blink,
    variant = 'solid',
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    classNames,
    style,
    styles,
    title,
    icon,
    status,
    onClick,
    description,
    disabled,
    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  const id = React.useId();

  // ============================= Refs =============================
  const itemRef = React.useRef<HTMLDivElement>(null);
  useProxyImperativeHandle(ref, () => {
    return {
      nativeElement: itemRef.current!,
    };
  });

  // ============================ Prefix ============================

  const { getPrefixCls, direction } = useXProviderContext();

  const prefixCls = getPrefixCls('thought-chain', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const itemCls = `${prefixCls}-item`;
  // ============================ Render ============================
  return (
    <div
      ref={itemRef}
      key={key || id}
      onClick={disabled ? undefined : onClick}
      style={style}
      className={clsx(
        prefixCls,
        hashId,
        className,
        cssVarCls,
        rootClassName,
        classNames?.root,
        itemCls,
        {
          [`${itemCls}-${variant}`]: variant,
          [`${itemCls}-click`]: !disabled && onClick,
          [`${itemCls}-error`]: status === THOUGHT_CHAIN_ITEM_STATUS.ERROR,
          [`${itemCls}-rtl`]: direction === 'rtl',
          [`${itemCls}-disabled`]: disabled,
        },
      )}
      {...domProps}
    >
      {(status || icon) && (
        <Status
          style={styles?.icon}
          className={classNames?.icon}
          prefixCls={prefixCls}
          icon={icon}
          status={status}
        />
      )}
      <div
        className={clsx(`${itemCls}-content`, {
          [`${prefixCls}-motion-blink`]: blink,
        })}
      >
        {title && (
          <div
            style={styles?.title}
            className={clsx(`${itemCls}-title`, classNames?.title, {
              [`${itemCls}-title-with-description`]: description,
            })}
          >
            {title}
          </div>
        )}
        {description && (
          <div
            style={styles?.description}
            className={clsx(`${itemCls}-description`, classNames?.description)}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
});

export default Item;
