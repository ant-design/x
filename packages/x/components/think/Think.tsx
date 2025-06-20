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

export type SemanticType = 'root' | 'status' | 'content';

export interface ThinkProps {
  prefixCls?: string;
  style?: React.CSSProperties;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  className?: string;
  classNames?: Partial<Record<SemanticType, string>>;
  rootClassName?: string;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean | React.ReactNode;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpand?: (expand: boolean) => void;
}

const Think: React.FC<React.PropsWithChildren<ThinkProps>> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    style,
    styles = {},
    className,
    rootClassName,
    classNames = {},
    children,
    title,
    icon,
    loading,
    defaultExpanded = true,
    expanded,
    onExpand,
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
    classNames.root,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

  const [isExpand, setIsExpand] = useMergedState(defaultExpanded, {
    value: expanded,
    onChange: onExpand,
  });

  const StatusIcon = () => {
    if (loading) {
      return loading === true ? <LoadingOutlined /> : loading;
    }
    return icon || <ThinkIcon />;
  };

  return wrapCSSVar(
    <div
      className={mergedCls}
      style={{
        ...contextConfig.style,
        ...style,
        ...styles.root,
      }}
    >
      <div
        className={classnames(`${prefixCls}-status-wrapper`, classNames.status)}
        onClick={() => setIsExpand(!isExpand)}
        style={styles.status}
      >
        <div className={`${prefixCls}-status-icon`}>
          <StatusIcon />
        </div>
        <div className={`${prefixCls}-status-text`}>{title}</div>
        <DownOutlined className={`${prefixCls}-status-down-icon`} rotate={isExpand ? 180 : 0} />
      </div>
      <CSSMotion {...collapseMotion} visible={isExpand}>
        {({ className: motionClassName, style }, motionRef) => (
          <div
            className={classnames(`${prefixCls}-content`, motionClassName, classNames.content)}
            ref={motionRef}
            style={{ ...style, ...styles.content }}
          >
            {children}
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
