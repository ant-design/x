import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import React from 'react';

export enum THOUGHT_CHAIN_ITEM_STATUS {
  /**
   * @desc 等待状态
   */
  LOADING = 'loading',
  /**
   * @desc 成功状态
   */
  SUCCESS = 'success',
  /**
   * @desc 错误状态
   */
  ERROR = 'error',
  /**
   * @desc 中止状态
   */
  ABORT = 'abort',
}

export interface StatusProps {
  /**
   * @desc 唯一标识符
   * @descEN Unique identifier
   */
  key?: string;

  /**
   * @desc 图标
   * @descEN Thought chain item icon
   */
  icon?: React.ReactNode;

  /**
   * @desc 状态
   * @descEN Thought chain item status
   */
  status?: `${THOUGHT_CHAIN_ITEM_STATUS}`;
  /**
   * @desc 自定义前缀
   * @descEN Prefix
   */
  prefixCls?: string;
  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  className?: string;
  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  style?: React.CSSProperties;
}

const StatusIcon = {
  [THOUGHT_CHAIN_ITEM_STATUS.LOADING]: <LoadingOutlined />,
  [THOUGHT_CHAIN_ITEM_STATUS.ERROR]: <CloseCircleOutlined />,
  [THOUGHT_CHAIN_ITEM_STATUS.SUCCESS]: <CheckCircleOutlined />,
  [THOUGHT_CHAIN_ITEM_STATUS.ABORT]: <MinusCircleOutlined />,
};

const Status: React.FC<StatusProps> = (props) => {
  const { prefixCls, icon, status, className, style } = props;

  // ============================ Style ============================
  const statusCls = `${prefixCls}-status`;

  const IconNode = status ? StatusIcon[status] : icon;

  // ============================ Render ============================
  return (
    <div
      className={classnames(statusCls, className, {
        [`${statusCls}-${status}`]: status,
      })}
      style={style}
    >
      {IconNode}
    </div>
  );
};

export default Status;
