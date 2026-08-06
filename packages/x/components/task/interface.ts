import type React from 'react';

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface TaskError {
  code?: string;
  message: string;
  retryable?: boolean;
  details?: unknown;
}

export interface TaskItem {
  id: React.Key;
  title: React.ReactNode;
  description?: React.ReactNode;
  status: TaskStatus;
  /** Progress ratio between 0 and 1. */
  progress?: number;
  result?: unknown;
  error?: TaskError;
  reason?: React.ReactNode;
}

export type TaskSemanticType =
  | 'root'
  | 'header'
  | 'status'
  | 'summary'
  | 'title'
  | 'description'
  | 'progress'
  | 'actions'
  | 'details'
  | 'content'
  | 'result'
  | 'error'
  | 'reason';

export interface TaskProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  item: TaskItem;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  statusRender?: (status: TaskStatus, item: TaskItem) => React.ReactNode;
  progressRender?: (progress: number, item: TaskItem) => React.ReactNode;
  resultRender?: (result: TaskItem['result'], item: TaskItem) => React.ReactNode;
  errorRender?: (error: TaskError, item: TaskItem) => React.ReactNode;
  actions?: React.ReactNode | ((item: TaskItem) => React.ReactNode);
  classNames?: Partial<Record<TaskSemanticType, string>>;
  styles?: Partial<Record<TaskSemanticType, React.CSSProperties>>;
  prefixCls?: string;
  rootClassName?: string;
}

export interface TaskRef {
  nativeElement: HTMLDivElement;
}
