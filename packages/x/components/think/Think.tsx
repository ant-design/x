import { LoadingOutlined, RightOutlined } from '@ant-design/icons';
import type { CSSMotionProps } from '@rc-component/motion';
import CSSMotion from '@rc-component/motion';
import useMergedState from '@rc-component/util/lib/hooks/useMergedState';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import { clsx } from 'clsx';
import React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
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

export interface ThinkProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
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
  blink?: boolean;
}

type ThinkRef = {
  nativeElement: HTMLElement;
};

const Think = React.forwardRef<ThinkRef, ThinkProps>((props, ref) => {
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
    blink,
    ...restProps
  } = props;

  // ============================ Prefix ============================

  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('think', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);

  // ======================= Component Config =======================

  const contextConfig = useXComponentConfig('think');
  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================= Refs =============================
  const thinkRef = React.useRef<HTMLDivElement>(null);
  useProxyImperativeHandle(ref, () => {
    return {
      nativeElement: thinkRef.current!,
    };
  });

  const mergedCls = clsx(
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

  // ============================  Collapsible ============================

  const [isExpand, setIsExpand] = useMergedState(defaultExpanded, {
    value: expanded,
    onChange: onExpand,
  });

  const collapseMotion: CSSMotionProps = {
    ...initCollapseMotion(),
    motionAppear: false,
    leavedClassName: `${prefixCls}-content-hidden`,
  };

  // ============================ Render ============================
  return (
    <div
      ref={thinkRef}
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
        className={clsx(`${prefixCls}-status-wrapper`, classNames.status)}
        onClick={() => setIsExpand(!isExpand)}
        style={styles.status}
      >
        <div className={`${prefixCls}-status-icon`}>
          <StatusIcon loading={loading} icon={icon} />
        </div>
        <div
          className={clsx(`${prefixCls}-status-text`, {
            [`${prefixCls}-motion-blink`]: blink,
          })}
        >
          {title}
        </div>
        <RightOutlined className={`${prefixCls}-status-down-icon`} rotate={isExpand ? 90 : 0} />
      </div>
      <CSSMotion {...collapseMotion} visible={isExpand}>
        {({ className: motionClassName, style }, motionRef) => (
          <div className={motionClassName || ''} ref={motionRef} style={style}>
            <div
              className={clsx(`${prefixCls}-content`, classNames.content)}
              style={styles.content}
            >
              {children}
            </div>
          </div>
        )}
      </CSSMotion>
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Think.displayName = 'Think';
}

export default Think;
