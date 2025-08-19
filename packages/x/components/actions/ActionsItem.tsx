import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';


import { useXProviderContext } from '../x-provider';

import useStyle from './style';
import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

export enum ACTIONS_ITEM_STATUS {
  /**
   * @desc 等待状态
   */
  LOADING = 'loading',
  /**
   * @desc 失败状态
   */
  ERROR = 'error',
  /**
 * @desc 执行中
 */
  RUNNING = 'running',
  /**
 * @desc 默认
 */
  DEFAULT = 'default',
}




export interface ActionsItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * @desc 状态
   * @descEN status
   */
  status?: `${ACTIONS_ITEM_STATUS}`;
  /**
   * @desc 图标
   * @descEN icon
   */
  defaultIcon: React.ReactNode,
  /**
   * @desc 自定义操作的显示标签
   * @descEN Display label for the custom action.
   */
  label?: string,
  /**
 * @desc 执行中图标
 * @descEN running icon
 */
  runningIcon?: React.ReactNode,
  /**
   * @desc 状态
   * @descEN status
   */
  onChange?: (status: `${ACTIONS_ITEM_STATUS}`) => void;

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

const ActionsItem: React.FC<ActionsItemProps> = (props) => {
  const {
    status = ACTIONS_ITEM_STATUS.DEFAULT,
    defaultIcon,
    runningIcon,
    label,
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
  const itemCls = `${prefixCls}-button-item`;

  // ============================ Classname ============================

  const mergedCls = classnames(itemCls, hashId, cssVarCls, rootClassName, className, `${prefixCls}-item`, {
    [`${itemCls}-rtl`]: direction === 'rtl',
  });

  const StatusIcon = {
    [ACTIONS_ITEM_STATUS.LOADING]: <LoadingOutlined />,
    [ACTIONS_ITEM_STATUS.ERROR]: <CloseCircleOutlined />,
    [ACTIONS_ITEM_STATUS.RUNNING]: runningIcon,
    [ACTIONS_ITEM_STATUS.DEFAULT]: defaultIcon
  };

  const iconNode = status && StatusIcon[status] ? StatusIcon[status] : defaultIcon;


  return (
    <div {...domProps} className={mergedCls} style={style} >
      <Tooltip title={label}>
        {iconNode}
      </Tooltip>
    </div>
  );
};

export default ActionsItem;
