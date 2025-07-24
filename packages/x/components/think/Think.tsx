import { LoadingOutlined, RightOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import type { CSSMotionProps } from 'rc-motion';
import CSSMotion from 'rc-motion';
import pickAttrs from 'rc-util/lib/pickAttrs';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import React from 'react';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import initCollapseMotion from '../_util/motion';
import { useXProviderContext } from '../x-provider';
import ThinkIcon from './icons/think';
import useStyle from './style';

export type SemanticType = 'root' | 'status' | 'content';

const StatusIcon = ({
  loading,
  icon,
}: {
  loading?: boolean | React.ReactNode;
  icon?: React.ReactNode;
}) => {
  if (loading) {
    return loading === true ? <LoadingOutlined /> : loading;
  }
  return icon || <ThinkIcon />;
};

export interface ThinkProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
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
    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('think', customizePrefixCls);
  const contextConfig = useXComponentConfig('think');

  const collapseMotion: CSSMotionProps = {
    ...initCollapseMotion(),
    motionAppear: false,
    leavedClassName: `${prefixCls}-content-hidden`,
  };

  const [hashId, cssVarCls] = useStyle(prefixCls);

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

  return (
    <div
      {...domProps}
      className={mergedCls}
      style={{
        ...contextConfig.style,
        ...contextConfig.styles.root,
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
          <StatusIcon loading={loading} icon={icon} />
        </div>
        <div className={`${prefixCls}-status-text`}>{title}</div>
        <RightOutlined className={`${prefixCls}-status-down-icon`} rotate={isExpand ? 90 : 0} />
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
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Think.displayName = 'Think';
}

export default Think;
