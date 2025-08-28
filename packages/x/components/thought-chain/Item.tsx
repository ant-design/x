import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
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

export interface ThoughtChainItemProp
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
  className?: string;
  classNames?: Partial<Record<SemanticType, string>>;
  style?: React.CSSProperties;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
}

type ItemRef = {
  nativeElement: HTMLElement;
};
const Item = React.forwardRef<ItemRef, ThoughtChainItemProp>((props, ref) => {
  // ============================ Info ============================
  const {
    key,
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
      onClick={onClick}
      style={style}
      className={classnames(
        prefixCls,
        hashId,
        className,
        cssVarCls,
        rootClassName,
        classNames?.root,
        itemCls,
        {
          [`${itemCls}-${variant}`]: variant,
          [`${itemCls}-click`]: onClick,
          [`${itemCls}-error`]: status === THOUGHT_CHAIN_ITEM_STATUS.ERROR,
          [`${itemCls}-rtl`]: direction === 'rtl',
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
      <div className={classnames(`${itemCls}-content`)}>
        {title && (
          <div
            style={styles?.title}
            className={classnames(`${itemCls}-title`, classNames?.title, {
              [`${itemCls}-title-with-description`]: description,
            })}
          >
            {title}
          </div>
        )}
        {description && (
          <div
            style={styles?.description}
            className={classnames(`${itemCls}-description`, classNames?.description)}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
});

export default Item;
