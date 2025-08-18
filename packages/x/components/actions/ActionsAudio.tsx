import classnames from 'classnames';
import React from 'react';
import Item, { ActionsItemProps } from './ActionsItem';

import { useXProviderContext } from '../x-provider';

import useStyle from './style';
import { MutedOutlined } from '@ant-design/icons';


export interface ActionsAudioProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {

  /**
   * @desc 状态
   * @descEN status
   */
  status?: ActionsItemProps['status'];
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

const ActionsAudio: React.FC<ActionsAudioProps> = (props) => {
  const {
    status,
    className,
    style,
    prefixCls: customizePrefixCls,
    rootClassName,
    ...otherProps
  } = props;




  // ============================ Prefix ============================

  const { direction, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('actions', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const audioCls = `${prefixCls}-audio`;

  // ============================ Classname ============================

  const mergedCls = classnames(audioCls, hashId, cssVarCls, rootClassName, className, {
    [`${audioCls}-rtl`]: direction === 'rtl',
  });


  return (
    <Item label='播放语音' className={mergedCls} status={status} defaultIcon={<MutedOutlined />} {...otherProps}/>
  );
};

export default ActionsAudio;
