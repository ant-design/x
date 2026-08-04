import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseCircleFilled,
  CopyOutlined,
  DownOutlined,
  LoadingOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
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

const formatDuration = (duration: number): string => {
  if (duration < 1000) {
    return `${duration}ms`;
  }
  if (duration < 60_000) {
    return `${(duration / 1000).toFixed(1)}s`;
  }

  const totalSeconds = Math.floor(duration / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  if (totalMinutes < 60) {
    return `${totalMinutes}m ${String(seconds).padStart(2, '0')}s`;
  }
  const hours = Math.floor(totalMinutes / 60);
  return `${hours}h ${String(totalMinutes % 60).padStart(2, '0')}m`;
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
    approval,
    duration = true,
    cancelling,
    onCancel,
    cancelButtonProps,
    approvalRender,
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
  const [innerApprovalStatus, setInnerApprovalStatus] = React.useState(
    approval?.defaultStatus ?? 'pending',
  );
  const [innerApprovalAction, setInnerApprovalAction] = React.useState<'approve' | 'reject' | null>(
    null,
  );
  const [innerCancelling, setInnerCancelling] = React.useState(false);
  const durationConfig = typeof duration === 'object' ? duration : undefined;
  const durationVisible = duration !== false;
  const durationRefreshInterval = Math.max(250, durationConfig?.refreshInterval ?? 1000);
  const shouldTick =
    durationVisible &&
    durationConfig?.value === undefined &&
    item.status === 'running' &&
    item.startedAt !== undefined;
  const [now, setNow] = React.useState(item.startedAt ?? 0);
  const mergedExpanded = controlledExpanded ?? innerExpanded;
  const mergedApprovalStatus = approval?.status ?? innerApprovalStatus;
  const approvalAction =
    typeof approval?.loading === 'string'
      ? approval.loading
      : approval?.loading
        ? (innerApprovalAction ?? 'approve')
        : innerApprovalAction;
  const mergedCancelling = cancelling ?? innerCancelling;
  const detailsId = `${prefixCls}-details-${React.useId().replace(/:/g, '')}`;
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!shouldTick) {
      return undefined;
    }

    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, durationRefreshInterval);
    return () => window.clearInterval(timer);
  }, [durationRefreshInterval, item.startedAt, shouldTick]);

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
  const hasApproval = approval !== undefined;
  const hasExpandableContent = hasDetails || hasApproval;
  const elapsedTime = durationVisible
    ? (durationConfig?.value ??
      (item.startedAt === undefined
        ? undefined
        : Math.max(0, (item.completedAt ?? now) - item.startedAt)))
    : undefined;
  const durationLabel =
    elapsedTime === undefined
      ? undefined
      : (durationConfig?.formatter?.(elapsedTime, item) ?? formatDuration(elapsedTime));
  const awaitingApproval = hasApproval && mergedApprovalStatus === 'pending';
  const statusLabel = awaitingApproval ? locale.awaitingApproval : locale.status[item.status];
  const statusIcon = awaitingApproval ? <SafetyCertificateOutlined /> : STATUS_ICONS[item.status];
  const showResultSummary = item.status === 'completed' && hasResult && !mergedExpanded;
  const domProps = pickAttrs(restProps, { attr: true, aria: true, data: true });

  const semanticClass = (name: ToolCallSemanticType) =>
    clsx(`${prefixCls}-${name}`, contextConfig.classNames[name], classNames[name]);
  const semanticStyle = (name: ToolCallSemanticType) => ({
    ...contextConfig.styles[name],
    ...styles[name],
  });

  const triggerApproval = async (action: 'approve' | 'reject') => {
    const callback = action === 'approve' ? approval?.onApprove : approval?.onReject;
    if (!approval || !callback || approvalAction) {
      return;
    }

    setInnerApprovalAction(action);
    try {
      await callback(item);
      const nextStatus = action === 'approve' ? 'approved' : 'rejected';
      if (approval.status === undefined) {
        setInnerApprovalStatus(nextStatus);
      }
      approval.onStatusChange?.(nextStatus, item);
    } catch {
      // A rejected action keeps the approval pending so the user can try again.
    } finally {
      setInnerApprovalAction(null);
    }
  };

  const triggerCancel = async () => {
    if (!onCancel || mergedCancelling) {
      return;
    }
    setInnerCancelling(true);
    try {
      await onCancel(item);
    } catch {
      // Keep the running state when cancellation is rejected by the runtime.
    } finally {
      setInnerCancelling(false);
    }
  };

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
        {
          [`${prefixCls}-approval-pending`]: awaitingApproval,
          [`${prefixCls}-rtl`]: direction === 'rtl',
        },
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
            {statusIcon}
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
            {item.description && (
              <span className={`${prefixCls}-separator`} aria-hidden="true">
                ·
              </span>
            )}
            <span>{statusLabel}</span>
            {durationLabel !== undefined && (
              <span
                className={`${prefixCls}-duration`}
                role="timer"
                aria-label={`${locale.duration} ${durationLabel}`}
              >
                <span aria-hidden="true">
                  <span className={`${prefixCls}-separator`}>·</span>
                  {durationLabel}
                </span>
              </span>
            )}
            {showResultSummary && (
              <span className={`${prefixCls}-result-summary`}>
                <span className={`${prefixCls}-separator`} aria-hidden="true">
                  ·
                </span>
                {`${locale.result}: ${getResultSummary(item.result)}`}
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
          {item.status === 'running' && onCancel && (
            <Tooltip title={locale.cancel}>
              <Button
                {...cancelButtonProps}
                type={cancelButtonProps?.type ?? 'text'}
                size={cancelButtonProps?.size ?? 'small'}
                icon={cancelButtonProps?.icon ?? <StopOutlined />}
                loading={mergedCancelling}
                disabled={mergedCancelling || cancelButtonProps?.disabled}
                aria-label={cancelButtonProps?.['aria-label'] ?? `${locale.cancel} ${item.name}`}
                onClick={() => void triggerCancel()}
              />
            </Tooltip>
          )}
          {hasExpandableContent && (
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

      {hasExpandableContent && mergedExpanded && (
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
          {hasApproval && (
            <section
              className={semanticClass('approval')}
              style={semanticStyle('approval')}
              aria-label={locale.approval}
            >
              {approvalRender ? (
                approvalRender(approval, item, {
                  status: mergedApprovalStatus,
                  loading: approvalAction,
                  approve: () => void triggerApproval('approve'),
                  reject: () => void triggerApproval('reject'),
                })
              ) : (
                <>
                  <div className={`${prefixCls}-approval-copy`}>
                    <div className={`${prefixCls}-approval-heading`}>
                      <SafetyCertificateOutlined aria-hidden="true" />
                      <span>{approval.title ?? locale.approvalTitle}</span>
                      {approval.risk && (
                        <span className={`${prefixCls}-risk ${prefixCls}-risk-${approval.risk}`}>
                          {locale.riskLevel[approval.risk]}
                        </span>
                      )}
                    </div>
                    {approval.description && (
                      <div className={`${prefixCls}-approval-description`}>
                        {approval.description}
                      </div>
                    )}
                    {mergedApprovalStatus !== 'pending' && (
                      <div className={`${prefixCls}-approval-decision`} aria-live="polite">
                        {mergedApprovalStatus === 'approved'
                          ? locale.approvalApproved
                          : locale.approvalRejected}
                      </div>
                    )}
                  </div>
                  {mergedApprovalStatus === 'pending' &&
                    (approval.onApprove || approval.onReject) && (
                      <div className={`${prefixCls}-approval-actions`}>
                        {approval.onReject && (
                          <Button
                            {...approval.rejectButtonProps}
                            size={approval.rejectButtonProps?.size ?? 'small'}
                            loading={approvalAction === 'reject'}
                            disabled={
                              Boolean(approvalAction) || approval.rejectButtonProps?.disabled
                            }
                            onClick={() => void triggerApproval('reject')}
                          >
                            {approval.rejectText ?? locale.reject}
                          </Button>
                        )}
                        {approval.onApprove && (
                          <Button
                            {...approval.approveButtonProps}
                            type={approval.approveButtonProps?.type ?? 'primary'}
                            danger={approval.approveButtonProps?.danger ?? approval.risk === 'high'}
                            size={approval.approveButtonProps?.size ?? 'small'}
                            loading={approvalAction === 'approve'}
                            disabled={
                              Boolean(approvalAction) || approval.approveButtonProps?.disabled
                            }
                            onClick={() => void triggerApproval('approve')}
                          >
                            {approval.approveText ?? locale.approveAndRun}
                          </Button>
                        )}
                      </div>
                    )}
                </>
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
