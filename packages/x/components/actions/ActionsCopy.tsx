import { createStyles } from 'antd-style';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';
import { useLocale } from '../locale';
import enUS from '../locale/en_US';
import CopyBtn from 'antd/lib/typography/Base';


import { useXProviderContext } from '../x-provider';

import useStyle from './style';

enum FEEDBACK_VALUE {
  like = 'like',
  dislike = 'dislike',
  default = 'default',
}

export interface ActionsCopyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * @desc 反馈状态值
   * @descEN Feedback status value
   */
  value?: `${FEEDBACK_VALUE}`;
  /**
   * @desc 反馈状态变化回调
   * @descEN Feedback status change callback
   */
  onChange?: (value: `${FEEDBACK_VALUE}`) => void;

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
    value = 'default',
    onChange,
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

  const [contextLocale] = useLocale('Actions', enUS.Actions);

  // ============================ Prefix ============================

  const { direction, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('actions', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const copyCls = `${prefixCls}-feedback`;

  // ============================ Styles ============================
  const useStyles = createStyles(({ token }) => ({
    feedbackItem: {
      padding: token.paddingXXS,
      borderRadius: token.borderRadius,
      height: token.controlHeightSM,
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      '&:hover': {
        background: token.colorBgTextHover,
      },
    },
    [`${copyCls}-rtl`]: {
      direction: 'rtl',
    },
  }));

  const { styles } = useStyles();

  const mergedCls = classnames(copyCls, hashId, cssVarCls, rootClassName, className, {
    [`${copyCls}-rtl`]: direction === 'rtl',
  });

  
  return (
   <CopyBtn prefixCls={copyCls} copyable={{
    text:'1111111'
   }}/>
  );
};

export default ActionsCopy;
