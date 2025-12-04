import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import useStyle from './style';

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
type SemanticType = 'root' | 'default' | 'running' | 'error' | 'loading';

export interface ActionsItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * @desc 状态
   * @descEN status
   */
  status?: `${ACTIONS_ITEM_STATUS}`;
  /**
   * @desc 图标
   * @descEN icon
   */
  defaultIcon: React.ReactNode;
  /**
   * @desc 自定义操作的显示标签
   * @descEN Display label for the custom action.
   */
  label?: string;
  /**
   * @desc 执行中图标
   * @descEN running icon
   */
  runningIcon?: React.ReactNode;

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

const ActionsItem: React.FC<ActionsItemProps> = (props) => {
  const {
    status = 'default',
    defaultIcon,
    runningIcon,
    label,
    className,
    classNames = {},
    styles = {},
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

  const mergedCls = classnames(
    itemCls,
    hashId,
    cssVarCls,
    rootClassName,
    className,
    classNames.root,
    `${prefixCls}-item`,
    {
      [`${itemCls}-rtl`]: direction === 'rtl',
      [`${classNames[status]}`]: classNames[status],
    },
  );

  const StatusIcon = {
    [ACTIONS_ITEM_STATUS.LOADING]: <LoadingOutlined />,
    [ACTIONS_ITEM_STATUS.ERROR]: <CloseCircleOutlined />,
    [ACTIONS_ITEM_STATUS.RUNNING]: runningIcon,
    [ACTIONS_ITEM_STATUS.DEFAULT]: defaultIcon,
  };

  const iconNode = status && StatusIcon[status] ? StatusIcon[status] : defaultIcon;

  return (
    <Tooltip title={label}>
      <div
        {...domProps}
        className={mergedCls}
        style={{ ...style, ...styles.root, ...styles?.[status] }}
      >
        {iconNode}
      </div>
    </Tooltip>
  );
};

export default ActionsItem;
