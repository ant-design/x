import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';
import CopyBtn from 'antd/lib/typography/Base';


import { useXProviderContext } from '../x-provider';

import useStyle from './style';


export interface ActionsCopyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * @desc 反馈状态值
   * @descEN Feedback status value
   */
  text?: string;
  /**
   * @desc 反馈状态变化回调
   * @descEN Feedback status change callback
   */
  icon?: React.ReactNode,

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
}

const ActionsCopy: React.FC<ActionsCopyProps> = (props) => {
  const {
    text = '',
    icon,
    className,
    style,
    prefixCls: customizePrefixCls,
    rootClassName,
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

  const mergedCls = classnames(copyCls, hashId, cssVarCls, rootClassName, className, `${prefixCls}-list-item`, {
    [`${copyCls}-rtl`]: direction === 'rtl',
  });


  return (
    <CopyBtn {...domProps} className={mergedCls} prefixCls={copyCls} copyable={{
      text,
      icon
    }} />
  );
};

export default ActionsCopy;
