import { MutedOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import React from 'react';
import { useLocale } from '../locale';
import enUS from '../locale/en_US';
import RecordingIcon from '../sender/components/SpeechButton/RecordingIcon';
import { useXProviderContext } from '../x-provider';
import type { ActionsItemProps } from './ActionsItem';
import Item, { ACTIONS_ITEM_STATUS } from './ActionsItem';
import useStyle from './style';

export type SemanticType = 'root' | 'default' | 'running' | 'error' | 'loading';
export interface ActionsAudioProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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

const ActionsAudio: React.FC<ActionsAudioProps> = (props) => {
  const {
    status = ACTIONS_ITEM_STATUS.DEFAULT,
    className,
    style,
    prefixCls: customizePrefixCls,
    rootClassName,
    classNames = {},
    styles = {},
    ...otherProps
  } = props;

  // ============================ Prefix ============================

  const { direction, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('actions', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const audioCls = `${prefixCls}-audio`;

  // ============================ Classname ============================

  const mergedCls = classnames(
    audioCls,
    hashId,
    cssVarCls,
    rootClassName,
    className,
    classNames.root,
    {
      [`${audioCls}-rtl`]: direction === 'rtl',
      [`${audioCls}-${status}`]: status,
    },
  );

  // ============================ Locale ============================

  const [contextLocale] = useLocale('Actions', enUS.Actions);

  const StatusLabel = {
    [ACTIONS_ITEM_STATUS.LOADING]: contextLocale.audioLoading,
    [ACTIONS_ITEM_STATUS.ERROR]: contextLocale.audioError,
    [ACTIONS_ITEM_STATUS.RUNNING]: contextLocale.audioRunning,
    [ACTIONS_ITEM_STATUS.DEFAULT]: contextLocale.audio,
  };

  return (
    <Item
      label={status ? StatusLabel[status] : ''}
      style={{ ...style, ...styles.root }}
      styles={{
        ...styles,
        root: { ...style, ...styles.root },
      }}
      classNames={{
        ...classNames,
        root: mergedCls,
      }}
      status={status}
      defaultIcon={<MutedOutlined />}
      runningIcon={<RecordingIcon className={`${audioCls}-recording-icon`} />}
      {...otherProps}
    />
  );
};

export default ActionsAudio;
