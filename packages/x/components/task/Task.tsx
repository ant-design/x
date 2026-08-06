import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseCircleFilled,
  DownOutlined,
  LoadingOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { CSSMotionProps } from '@rc-component/motion';
import CSSMotion from '@rc-component/motion';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import { Progress } from 'antd';
import { clsx } from 'clsx';
import React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import initCollapseMotion from '../_util/motion';
import { useLocale } from '../locale';
import enUS from '../locale/en_US';
import { useXProviderContext } from '../x-provider';
import type { TaskError, TaskProps, TaskRef, TaskSemanticType, TaskStatus } from './interface';
import useStyle from './style';

const DEFAULT_EXPANDED: Record<TaskStatus, boolean> = {
  pending: false,
  running: true,
  completed: false,
  failed: true,
  cancelled: false,
};

const STATUS_ICONS: Record<TaskStatus, React.ReactNode> = {
  pending: <ClockCircleOutlined />,
  running: <LoadingOutlined spin />,
  completed: <CheckCircleFilled />,
  failed: <CloseCircleFilled />,
  cancelled: <StopOutlined />,
};

const valueType = (value: unknown): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return `Array(${value.length})`;
  return Object.prototype.toString.call(value).slice(8, -1);
};

const safeStringify = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || value == null) {
    return String(value);
  }
  try {
    return JSON.stringify(value, null, 2) ?? `[${valueType(value)}]`;
  } catch {
    return `[${valueType(value)}, unable to serialize]`;
  }
};

const normalizeProgress = (progress: number) => Math.min(100, Math.max(0, progress * 100));

const Task = React.forwardRef<TaskRef, TaskProps>((props, ref) => {
  const {
    item,
    expanded: controlledExpanded,
    defaultExpanded,
    onExpandedChange,
    statusRender,
    progressRender,
    resultRender,
    errorRender,
    actions,
    classNames = {},
    styles = {},
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    style,
    children,
    ...restProps
  } = props;

  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('task', customizePrefixCls);
  const contextConfig = useXComponentConfig('task');
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const [locale] = useLocale('Task', enUS.Task);
  const [innerExpanded, setInnerExpanded] = React.useState(
    defaultExpanded ?? DEFAULT_EXPANDED[item.status],
  );
  const mergedExpanded = controlledExpanded ?? innerExpanded;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const detailsId = `${prefixCls}-details-${React.useId().replace(/:/g, '')}`;

  useProxyImperativeHandle(ref, () => ({ nativeElement: rootRef.current! }));

  React.useEffect(() => {
    if (controlledExpanded === undefined && defaultExpanded === undefined) {
      setInnerExpanded(DEFAULT_EXPANDED[item.status]);
    }
  }, [controlledExpanded, defaultExpanded, item.status]);

  const setExpanded = (next: boolean) => {
    if (controlledExpanded === undefined) setInnerExpanded(next);
    onExpandedChange?.(next);
  };

  const hasResult = item.result !== undefined;
  const hasError = item.error !== undefined;
  const hasReason = item.reason !== undefined;
  const hasContent = children !== undefined && children !== null;
  const hasDetails = hasContent || hasResult || hasError || hasReason;
  const customActions = typeof actions === 'function' ? actions(item) : actions;
  const visibleProgress = item.status === 'completed' ? 1 : item.progress;
  const percent = visibleProgress === undefined ? undefined : normalizeProgress(visibleProgress);
  const statusLabel = locale.status[item.status];
  const domProps = pickAttrs(restProps, { attr: true, aria: true, data: true });

  const semanticClass = (name: TaskSemanticType) =>
    clsx(`${prefixCls}-${name}`, contextConfig.classNames[name], classNames[name]);
  const semanticStyle = (name: TaskSemanticType) => ({
    ...contextConfig.styles[name],
    ...styles[name],
  });

  const collapseMotion: CSSMotionProps = {
    ...initCollapseMotion(),
    motionAppear: false,
    leavedClassName: `${prefixCls}-details-hidden`,
  };

  const renderError = (error: TaskError) => {
    if (errorRender) return errorRender(error, item);
    return (
      <>
        <div className={`${prefixCls}-error-message`}>{error.message}</div>
        {error.code && <div className={`${prefixCls}-error-code`}>{error.code}</div>}
        {error.details !== undefined && (
          <pre className={`${prefixCls}-code`}>{safeStringify(error.details)}</pre>
        )}
      </>
    );
  };

  return (
    <div
      {...domProps}
      ref={rootRef}
      role="group"
      aria-label={
        restProps['aria-label'] ?? (typeof item.title === 'string' ? item.title : undefined)
      }
      className={clsx(
        prefixCls,
        `${prefixCls}-${item.status}`,
        contextConfig.className,
        contextConfig.classNames.root,
        rootClassName,
        className,
        classNames.root,
        hashId,
        cssVarCls,
        { [`${prefixCls}-rtl`]: direction === 'rtl' },
      )}
      style={{ ...contextConfig.style, ...contextConfig.styles.root, ...styles.root, ...style }}
    >
      <div className={semanticClass('header')} style={semanticStyle('header')}>
        <span
          className={semanticClass('status')}
          style={semanticStyle('status')}
          data-status={item.status}
          aria-live="polite"
        >
          {statusRender ? statusRender(item.status, item) : STATUS_ICONS[item.status]}
          <span className={`${prefixCls}-status-text`}>{statusLabel}</span>
        </span>

        <div className={semanticClass('summary')} style={semanticStyle('summary')}>
          <div className={semanticClass('title')} style={semanticStyle('title')}>
            {item.title}
          </div>
          <div className={semanticClass('description')} style={semanticStyle('description')}>
            {item.description && <span>{item.description}</span>}
            {item.description && <span aria-hidden="true"> · </span>}
            <span>{statusLabel}</span>
          </div>
        </div>

        <div className={semanticClass('actions')} style={semanticStyle('actions')}>
          {customActions}
          {hasDetails && (
            <button
              type="button"
              className={clsx(`${prefixCls}-expand`, {
                [`${prefixCls}-expand-open`]: mergedExpanded,
              })}
              aria-label={mergedExpanded ? locale.collapse : locale.expand}
              aria-expanded={mergedExpanded}
              aria-controls={detailsId}
              onClick={() => setExpanded(!mergedExpanded)}
            >
              <DownOutlined />
            </button>
          )}
        </div>

        {percent !== undefined && (
          <div className={semanticClass('progress')} style={semanticStyle('progress')}>
            {progressRender ? (
              progressRender(visibleProgress!, item)
            ) : (
              <>
                <Progress
                  percent={percent}
                  showInfo={false}
                  size="small"
                  status={item.status === 'failed' ? 'exception' : undefined}
                />
                <span className={`${prefixCls}-progress-text`}>{Math.round(percent)}%</span>
              </>
            )}
          </div>
        )}
      </div>

      {hasDetails && (
        <CSSMotion {...collapseMotion} visible={mergedExpanded}>
          {({ className: motionClassName, style: motionStyle }, motionRef) => (
            <div
              ref={motionRef}
              className={motionClassName || ''}
              style={motionStyle}
              aria-hidden={!mergedExpanded}
            >
              <div
                id={detailsId}
                className={semanticClass('details')}
                style={semanticStyle('details')}
              >
                {hasContent && (
                  <section className={semanticClass('content')} style={semanticStyle('content')}>
                    {children}
                  </section>
                )}
                {hasResult && (
                  <section className={semanticClass('result')} style={semanticStyle('result')}>
                    <div className={`${prefixCls}-section-title`}>{locale.result}</div>
                    {resultRender ? (
                      resultRender(item.result, item)
                    ) : (
                      <pre className={`${prefixCls}-code`}>{safeStringify(item.result)}</pre>
                    )}
                  </section>
                )}
                {hasError && (
                  <section className={semanticClass('error')} style={semanticStyle('error')}>
                    <div className={`${prefixCls}-section-title`}>{locale.error}</div>
                    {renderError(item.error!)}
                  </section>
                )}
                {hasReason && (
                  <section className={semanticClass('reason')} style={semanticStyle('reason')}>
                    <div className={`${prefixCls}-section-title`}>{locale.reason}</div>
                    {item.reason}
                  </section>
                )}
              </div>
            </div>
          )}
        </CSSMotion>
      )}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') Task.displayName = 'Task';

export default Task;
