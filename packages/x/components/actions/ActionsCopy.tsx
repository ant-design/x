import { Typography } from 'antd';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import useStyle from './style';

const { Text } = Typography;
export type SemanticType = 'root';
export interface ActionsCopyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * @desc 复制的文本
   * @descEN Text to be copied
   */
  text?: string;

  /**
   * @desc 复制图标
   * @descEN Copy icon
   */
  icon?: React.ReactNode;

  /**
   * @desc 自定义样式前缀
   * @descEN Customize the component's prefixCls
   */
  prefixCls?: string;

  /**
   * @desc 根节点样式类
   * @descEN Root node style class.
   */
  rootClassName?: string;
  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<SemanticType, string>>;
  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
}

const ActionsCopy: React.FC<ActionsCopyProps> = (props) => {
  const {
    text = '',
    icon,
    className,
    style,
    prefixCls: customizePrefixCls,
    rootClassName,
    classNames = {},
    styles = {},
    ...otherHtmlProps
  } = props;

  const domProps = pickAttrs(otherHtmlProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================ Prefix ============================

  const { direction, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('actions', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const copyCls = `${prefixCls}-copy`;

  // ============================ Classname ============================

  const mergedCls = classnames(
    `${prefixCls}-item`,
    copyCls,
    hashId,
    cssVarCls,
    rootClassName,
    className,
    classNames.root,
    {
      [`${copyCls}-rtl`]: direction === 'rtl',
    },
  );
  return (
    <Text
      {...domProps}
      className={mergedCls}
      style={{ ...style, ...styles.root }}
      prefixCls={copyCls}
      copyable={{ text, icon }}
    />
  );
};

export default ActionsCopy;
