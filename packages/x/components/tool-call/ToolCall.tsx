import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseCircleFilled,
  CopyOutlined,
  DownOutlined,
  LoadingOutlined,
  ReloadOutlined,
  StopOutlined,
} from '@ant-design/icons';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import { Button, Tooltip } from 'antd';
import { clsx } from 'clsx';
import copy from 'copy-to-clipboard';
import React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useLocale } from '../locale';
import enUS from '../locale/en_US';
import { useXProviderContext } from '../x-provider';
import type {
  ToolCallError,
  ToolCallItem,
  ToolCallProps,
  ToolCallRef,
  ToolCallSemanticType,
  ToolCallStatus,
} from './interface';
import useStyle from './style';

const DEFAULT_EXPANDED: Record<ToolCallStatus, boolean> = {
  pending: true,
  streaming: true,
  running: true,
  completed: false,
  failed: true,
  cancelled: false,
};

const STATUS_ICONS: Record<ToolCallStatus, React.ReactNode> = {
  pending: <ClockCircleOutlined />,
  streaming: <LoadingOutlined spin />,
  running: <LoadingOutlined spin />,
  completed: <CheckCircleFilled />,
  failed: <CloseCircleFilled />,
  cancelled: <StopOutlined />,
};

const MAX_CONTENT_LENGTH = 20_000;

const valueType = (value: unknown): string => {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return `Array(${value.length})`;
  }
  return Object.prototype.toString.call(value).slice(8, -1);
};

const safeStringify = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean' || value == null) {
    return String(value);
  }
  if (
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value) ||
    (typeof Blob !== 'undefined' && value instanceof Blob)
  ) {
    return `[${valueType(value)} data]`;
  }

  try {
    const serialized = JSON.stringify(value, null, 2);
    if (serialized === undefined) {
      return `[${valueType(value)}]`;
    }
    if (serialized.length > MAX_CONTENT_LENGTH) {
      return `[${valueType(value)}, ${serialized.length.toLocaleString()} characters]`;
    }
    return serialized;
  } catch {
    return `[${valueType(value)}, unable to serialize]`;
  }
};

const renderArguments = (item: ToolCallItem): string => {
  if (item.argumentsText !== undefined) {
    try {
      return JSON.stringify(JSON.parse(item.argumentsText), null, 2);
    } catch {
      return item.argumentsText;
    }
  }
  return safeStringify(item.arguments);
};

const getDuration = (item: ToolCallItem): string | undefined => {
  if (item.startedAt === undefined || item.completedAt === undefined) {
    return undefined;
  }
  const duration = Math.max(0, item.completedAt - item.startedAt);
  return duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(1)}s`;
};

const getResultSummary = (value: unknown): string => {
  const serialized = safeStringify(value).replace(/\s+/g, ' ');
  return serialized.length > 80 ? `${serialized.slice(0, 77)}...` : serialized;
};

const ToolCall = React.forwardRef<ToolCallRef, ToolCallProps>((props, ref) => {
  const {
    item,
    expanded: controlledExpanded,
    defaultExpanded,
    onExpandedChange,
    retrying = false,
    onRetry,
    argumentsRender,
    resultRender,
    errorRender,
    actions,
    classNames = {},
    styles = {},
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    style,
    ...restProps
  } = props;

  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('tool-call', customizePrefixCls);
  const contextConfig = useXComponentConfig('toolCall');
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const [locale] = useLocale('ToolCall', enUS.ToolCall);

  const [innerExpanded, setInnerExpanded] = React.useState(
    defaultExpanded ?? DEFAULT_EXPANDED[item.status],
  );
  const mergedExpanded = controlledExpanded ?? innerExpanded;
  const detailsId = `${prefixCls}-details-${React.useId().replace(/:/g, '')}`;
  const rootRef = React.useRef<HTMLDivElement>(null);

  useProxyImperativeHandle(ref, () => ({ nativeElement: rootRef.current! }));

  const setExpanded = (next: boolean) => {
    if (controlledExpanded === undefined) {
      setInnerExpanded(next);
    }
    onExpandedChange?.(next);
  };

  const hasArguments = item.argumentsText !== undefined || item.arguments !== undefined;
  const hasResult = item.result !== undefined;
  const hasError = item.error !== undefined;
  const hasDetails = hasArguments || hasResult || hasError;
  const canRetry = item.status === 'failed' && item.error?.retryable === true && onRetry;
  const customActions = typeof actions === 'function' ? actions(item) : actions;
  const duration = getDuration(item);
  const statusLabel = locale.status[item.status];
  const showResultSummary = item.status === 'completed' && hasResult && !mergedExpanded;
  const domProps = pickAttrs(restProps, { attr: true, aria: true, data: true });

  const semanticClass = (name: ToolCallSemanticType) =>
    clsx(`${prefixCls}-${name}`, contextConfig.classNames[name], classNames[name]);
  const semanticStyle = (name: ToolCallSemanticType) => ({
    ...contextConfig.styles[name],
    ...styles[name],
  });

  const renderError = (error: ToolCallError) => {
    if (errorRender) {
      return errorRender(error, item);
    }
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
      aria-label={restProps['aria-label'] ?? item.name}
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
        >
          <span className={`${prefixCls}-status-icon`} aria-hidden="true">
            {STATUS_ICONS[item.status]}
          </span>
          <span className={`${prefixCls}-status-text`} aria-live="polite">
            {statusLabel}
          </span>
        </span>
        <div className={`${prefixCls}-summary`}>
          <div className={semanticClass('name')} style={semanticStyle('name')}>
            {item.name}
            {item.attempt !== undefined && (
              <span className={`${prefixCls}-attempt`}>#{item.attempt}</span>
            )}
          </div>
          <div className={semanticClass('description')} style={semanticStyle('description')}>
            {item.description && <span>{item.description}</span>}
            {item.description && <span aria-hidden="true"> · </span>}
            <span>{statusLabel}</span>
            {duration && <span aria-hidden="true"> · {duration}</span>}
            {showResultSummary && (
              <span className={`${prefixCls}-result-summary`}>
                {' '}
                · {locale.result}: {getResultSummary(item.result)}
              </span>
            )}
          </div>
        </div>
        <div className={semanticClass('actions')} style={semanticStyle('actions')}>
          {customActions}
          {item.status === 'completed' && hasResult && (
            <Tooltip title={locale.copyResult}>
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                aria-label={`${locale.copyResult} ${item.name}`}
                onClick={() => copy(safeStringify(item.result))}
              />
            </Tooltip>
          )}
          {canRetry && (
            <Tooltip title={locale.retry}>
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined />}
                loading={retrying}
                disabled={retrying}
                aria-label={`${locale.retry} ${item.name}`}
                onClick={() => onRetry(item)}
              />
            </Tooltip>
          )}
          {hasDetails && (
            <Tooltip title={mergedExpanded ? locale.collapse : locale.expand}>
              <Button
                type="text"
                size="small"
                icon={<DownOutlined />}
                className={clsx(`${prefixCls}-expand`, {
                  [`${prefixCls}-expand-open`]: mergedExpanded,
                })}
                aria-label={mergedExpanded ? locale.collapse : locale.expand}
                aria-expanded={mergedExpanded}
                aria-controls={detailsId}
                onClick={() => setExpanded(!mergedExpanded)}
              />
            </Tooltip>
          )}
        </div>
      </div>

      {hasDetails && mergedExpanded && (
        <div id={detailsId} className={semanticClass('details')} style={semanticStyle('details')}>
          {hasArguments && (
            <section className={semanticClass('arguments')} style={semanticStyle('arguments')}>
              <div className={`${prefixCls}-section-title`}>{locale.arguments}</div>
              {argumentsRender ? (
                argumentsRender(item)
              ) : (
                <pre className={`${prefixCls}-code`}>{renderArguments(item)}</pre>
              )}
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
        </div>
      )}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  ToolCall.displayName = 'ToolCall';
}

export default ToolCall;
