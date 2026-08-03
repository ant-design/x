import type {
  AgentError,
  AgentEventMeta,
  AgentMessageContent,
  AgentRole,
  ApprovalDecision,
} from '../protocol';

export type AgentRunStatus = 'running' | 'completed' | 'failed' | 'cancelled';
export type AgentEntityStatus =
  | 'pending'
  | 'streaming'
  | 'running'
  | 'waiting'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface AgentSessionState {
  id: string;
  title?: string;
  createdAt: number;
}

export interface AgentRunState {
  id: string;
  sessionId: string;
  status: AgentRunStatus;
  input?: unknown;
  output?: unknown;
  usage?: Readonly<Record<string, number>>;
  error?: AgentError;
  reason?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AgentMessageState {
  id: string;
  runId: string;
  parentId?: string;
  role: AgentRole;
  content: AgentMessageContent;
  status: AgentEntityStatus;
  error?: AgentError;
  reason?: string;
  createdAt: number;
  updatedAt: number;
  meta?: AgentEventMeta;
}

export interface AgentReasoningState {
  id: string;
  runId: string;
  parentId?: string;
  content: string;
  summary?: string;
  redacted: boolean;
  status: AgentEntityStatus;
  error?: AgentError;
  reason?: string;
  createdAt: number;
  updatedAt: number;
  meta?: AgentEventMeta;
}

export interface AgentToolCallState {
  id: string;
  runId: string;
  parentId?: string;
  name: string;
  arguments: string;
  index?: number;
  result?: unknown;
  status: AgentEntityStatus;
  error?: AgentError;
  reason?: string;
  createdAt: number;
  updatedAt: number;
  meta?: AgentEventMeta;
}

export interface AgentApprovalState {
  id: string;
  runId: string;
  parentId?: string;
  toolCallId?: string;
  description?: string;
  risk?: string;
  data?: unknown;
  decision?: ApprovalDecision;
  status: AgentEntityStatus;
  createdAt: number;
  updatedAt: number;
  meta?: AgentEventMeta;
}

export interface AgentTaskState {
  id: string;
  runId: string;
  parentId?: string;
  title: string;
  description?: string;
  progress?: number;
  result?: unknown;
  status: AgentEntityStatus;
  error?: AgentError;
  reason?: string;
  createdAt: number;
  updatedAt: number;
  meta?: AgentEventMeta;
}

export interface AgentArtifactState {
  id: string;
  runId: string;
  parentId?: string;
  name: string;
  mediaType?: string;
  content?: unknown;
  version?: string | number;
  status: AgentEntityStatus;
  error?: AgentError;
  createdAt: number;
  updatedAt: number;
  meta?: AgentEventMeta;
}

export type AgentEntityKind = 'message' | 'reasoning' | 'tool' | 'approval' | 'task' | 'artifact';

export interface AgentEntityReference {
  kind: AgentEntityKind;
  id: string;
  runId: string;
}

export interface AgentProtocolIssue {
  code:
    | 'duplicate_entity'
    | 'invalid_sequence'
    | 'invalid_transition'
    | 'missing_entity'
    | 'missing_run';
  eventId: string;
  runId: string;
  message: string;
}

export interface AgentState {
  sessions: Readonly<Record<string, AgentSessionState>>;
  runs: Readonly<Record<string, AgentRunState>>;
  messages: Readonly<Record<string, AgentMessageState>>;
  reasoning: Readonly<Record<string, AgentReasoningState>>;
  toolCalls: Readonly<Record<string, AgentToolCallState>>;
  approvals: Readonly<Record<string, AgentApprovalState>>;
  tasks: Readonly<Record<string, AgentTaskState>>;
  artifacts: Readonly<Record<string, AgentArtifactState>>;
  order: readonly AgentEntityReference[];
  issues: readonly AgentProtocolIssue[];
  processedEventIds: Readonly<Record<string, true>>;
  lastSequenceByRun: Readonly<Record<string, number>>;
}

export function getAgentEntityKey(runId: string, entityId: string): string {
  return `${runId.length}:${runId}${entityId}`;
}

export function getAgentEventKey(runId: string, eventId: string): string {
  return getAgentEntityKey(runId, eventId);
}

export function createInitialAgentState(): AgentState {
  return {
    sessions: {},
    runs: {},
    messages: {},
    reasoning: {},
    toolCalls: {},
    approvals: {},
    tasks: {},
    artifacts: {},
    order: [],
    issues: [],
    processedEventIds: {},
    lastSequenceByRun: {},
  };
}
