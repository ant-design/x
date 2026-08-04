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
