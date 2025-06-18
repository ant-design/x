import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import CSSMotion from 'rc-motion';
import type { CSSMotionProps } from 'rc-motion';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import React from 'react';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import initCollapseMotion from '../_util/motion';
import { useXProviderContext } from '../x-provider';
import ThinkIcon from './icons/think';
import useStyle from './style';

export interface ThinkProps {
  prefixCls?: string;
  style?: React.CSSProperties;
  className?: string;
  rootClassName?: string;
  content?: React.ReactNode;
  statusText?: React.ReactNode;
  statusIcon?: React.ReactNode;
  loading?: boolean;
  loadingIcon?: React.ReactNode;
  defaultExpand?: boolean;
  expand?: boolean;
  onExpandChange?: (expand: boolean) => void;
}

const Think: React.FC<ThinkProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    style,
    className,
    rootClassName,
    content,
    statusText,
    statusIcon,
    loading,
    loadingIcon,
    defaultExpand = true,
    expand,
    onExpandChange,
  } = props;

  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('think', customizePrefixCls);
  const contextConfig = useXComponentConfig('think');

  const collapseMotion: CSSMotionProps = {
    ...initCollapseMotion(),
    motionAppear: false,
    leavedClassName: `${prefixCls}-content-hidden`,
  };

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    prefixCls,
    contextConfig.className,
    className,
    rootClassName,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

  const [isExpand, setIsExpand] = useMergedState(defaultExpand, {
    value: expand,
    onChange: onExpandChange,
  });

  const StatusIcon = () => {
    if (loading) {
      return loadingIcon || <LoadingOutlined />;
    }
    return statusIcon || <ThinkIcon />;
  };

  return wrapCSSVar(
    <div
      className={mergedCls}
      style={{
        ...contextConfig.style,
        ...style,
      }}
    >
      <div className={`${prefixCls}-status-wrapper`} onClick={() => setIsExpand(!isExpand)}>
        <div className={`${prefixCls}-status-icon`}>
          <StatusIcon />
        </div>
        <span className={`${prefixCls}-status-text`}>{statusText}</span>
        {<DownOutlined rotate={isExpand ? 180 : 0} />}
      </div>
      <CSSMotion {...collapseMotion} visible={isExpand}>
        {({ className: motionClassName, style }, motionRef) => (
          <div
            className={classnames(`${prefixCls}-content`, motionClassName)}
            ref={motionRef}
            style={style}
          >
            {content}
          </div>
        )}
      </CSSMotion>
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Think.displayName = 'Think';
}

export default Think;
