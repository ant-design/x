import type { ButtonProps } from 'antd';
import type React from 'react';

export type ToolCallStatus =
  | 'pending'
  | 'streaming'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface ToolCallError {
  code?: string;
  message: string;
  retryable?: boolean;
  details?: unknown;
}

export type ToolCallApprovalStatus = 'pending' | 'approved' | 'rejected';

export type ToolCallApprovalRisk = 'low' | 'medium' | 'high';

export interface ToolCallApprovalConfig {
  status?: ToolCallApprovalStatus;
  defaultStatus?: ToolCallApprovalStatus;
  title?: React.ReactNode;
  description?: React.ReactNode;
  risk?: ToolCallApprovalRisk;
  approveText?: React.ReactNode;
  rejectText?: React.ReactNode;
  approveButtonProps?: Omit<ButtonProps, 'children' | 'loading' | 'onClick'>;
  rejectButtonProps?: Omit<ButtonProps, 'children' | 'loading' | 'onClick'>;
  loading?: boolean | 'approve' | 'reject';
  onStatusChange?: (status: ToolCallApprovalStatus, item: ToolCallItem) => void;
  onApprove?: (item: ToolCallItem) => void | Promise<void>;
  onReject?: (item: ToolCallItem) => void | Promise<void>;
}

export interface ToolCallApprovalActions {
  status: ToolCallApprovalStatus;
  loading: 'approve' | 'reject' | null;
  approve: () => void;
  reject: () => void;
}

export interface ToolCallDurationConfig {
  value?: number;
  refreshInterval?: number;
  formatter?: (milliseconds: number, item: ToolCallItem) => React.ReactNode;
}

export interface ToolCallItem {
  id: React.Key;
  name: string;
  description?: React.ReactNode;
  argumentsText?: string;
  arguments?: unknown;
  result?: unknown;
  status: ToolCallStatus;
  error?: ToolCallError;
  attempt?: number;
  startedAt?: number;
  completedAt?: number;
}

export type ToolCallSemanticType =
  | 'root'
  | 'header'
  | 'status'
  | 'name'
  | 'description'
  | 'actions'
  | 'details'
  | 'approval'
  | 'arguments'
  | 'result'
  | 'error';

export interface ToolCallProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  item: ToolCallItem;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  retrying?: boolean;
  onRetry?: (item: ToolCallItem) => void;
  approval?: ToolCallApprovalConfig;
  duration?: boolean | ToolCallDurationConfig;
  cancelling?: boolean;
  onCancel?: (item: ToolCallItem) => void | Promise<void>;
  cancelButtonProps?: Omit<ButtonProps, 'children' | 'loading' | 'onClick'>;
  approvalRender?: (
    approval: ToolCallApprovalConfig,
    item: ToolCallItem,
    actions: ToolCallApprovalActions,
  ) => React.ReactNode;
  argumentsRender?: (item: ToolCallItem) => React.ReactNode;
  resultRender?: (value: ToolCallItem['result'], item: ToolCallItem) => React.ReactNode;
  errorRender?: (error: ToolCallError, item: ToolCallItem) => React.ReactNode;
  actions?: React.ReactNode | ((item: ToolCallItem) => React.ReactNode);
  classNames?: Partial<Record<ToolCallSemanticType, string>>;
  styles?: Partial<Record<ToolCallSemanticType, React.CSSProperties>>;
  prefixCls?: string;
  rootClassName?: string;
}

export interface ToolCallRef {
  nativeElement: HTMLDivElement;
}
