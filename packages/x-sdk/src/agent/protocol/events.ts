export type AgentEventMeta = Readonly<Record<string, unknown>>;

export const AGENT_EVENT_PROTOCOL = 'agent-event' as const;
export const AGENT_EVENT_PROTOCOL_VERSION = '0.1' as const;
export type AgentEventProtocolVersion = typeof AGENT_EVENT_PROTOCOL_VERSION;

export interface AgentError {
  code?: string;
  message: string;
  retryable?: boolean;
  details?: unknown;
}

export type AgentTerminalStatus = 'completed' | 'failed' | 'cancelled';
export type AgentRole = 'assistant' | 'user' | 'system' | 'tool' | (string & {});
export type ApprovalDecision = 'approved' | 'rejected' | 'modified' | 'expired';

export type AgentContentPart =
  | { type: 'text'; text: string }
  | { type: 'image'; url?: string; data?: unknown; mediaType?: string }
  | { type: 'file'; url?: string; data?: unknown; mediaType?: string; name?: string }
  | { type: `${string}.${string}`; data: unknown };

export type AgentMessageContent = string | readonly AgentContentPart[];

export interface AgentEventPayloadMap {
  'session.started': {
    title?: string;
  };
  'run.started': {
    input?: unknown;
  };
  'run.completed': {
    output?: unknown;
    usage?: Readonly<Record<string, number>>;
  };
  'run.failed': {
    error: AgentError;
  };
  'run.cancelled': {
    reason?: string;
  };
  'message.started': {
    messageId: string;
    role: AgentRole;
    content?: AgentMessageContent;
  };
  'message.delta': {
    messageId: string;
    delta: AgentMessageContent;
  };
  'message.completed': {
    messageId: string;
    content?: AgentMessageContent;
  };
  'message.failed': {
    messageId: string;
    error: AgentError;
  };
  'message.cancelled': {
    messageId: string;
    reason?: string;
  };
  'reasoning.started': {
    reasoningId: string;
    redacted?: boolean;
  };
  'reasoning.delta': {
    reasoningId: string;
    delta: string;
  };
  'reasoning.completed': {
    reasoningId: string;
    content?: string;
    summary?: string;
  };
  'reasoning.failed': {
    reasoningId: string;
    error: AgentError;
  };
  'reasoning.cancelled': {
    reasoningId: string;
    reason?: string;
  };
  'tool.requested': {
    toolCallId: string;
    name: string;
    arguments?: string;
    index?: number;
    attempt?: number;
    retryOf?: string;
  };
  'tool.arguments_delta': {
    toolCallId: string;
    delta: string;
  };
  'tool.running': {
    toolCallId: string;
  };
  'tool.completed': {
    toolCallId: string;
    result?: unknown;
  };
  'tool.failed': {
    toolCallId: string;
    error: AgentError;
  };
  'tool.cancelled': {
    toolCallId: string;
    reason?: string;
  };
  'approval.requested': {
    approvalId: string;
    toolCallId?: string;
    description?: string;
    risk?: 'low' | 'medium' | 'high' | (string & {});
    data?: unknown;
    editable?: boolean;
    expiresAt?: number;
    version?: string | number;
  };
  'approval.resolved': {
    approvalId: string;
    decision: ApprovalDecision;
    data?: unknown;
  };
  'task.created': {
    taskId: string;
    title: string;
    description?: string;
  };
  'task.updated': {
    taskId: string;
    title?: string;
    description?: string;
    progress?: number;
  };
  'task.completed': {
    taskId: string;
    result?: unknown;
  };
  'task.failed': {
    taskId: string;
    error: AgentError;
  };
  'task.cancelled': {
    taskId: string;
    reason?: string;
  };
  'artifact.created': {
    artifactId: string;
    name: string;
    mediaType?: string;
    content?: unknown;
  };
  'artifact.updated': {
    artifactId: string;
    content: unknown;
    version?: string | number;
  };
  'artifact.completed': {
    artifactId: string;
    content?: unknown;
    version?: string | number;
  };
  'artifact.failed': {
    artifactId: string;
    error: AgentError;
  };
}

export type AgentEventType = keyof AgentEventPayloadMap;

const agentEventTypeMap = {
  'session.started': true,
  'run.started': true,
  'run.completed': true,
  'run.failed': true,
  'run.cancelled': true,
  'message.started': true,
  'message.delta': true,
  'message.completed': true,
  'message.failed': true,
  'message.cancelled': true,
  'reasoning.started': true,
  'reasoning.delta': true,
  'reasoning.completed': true,
  'reasoning.failed': true,
  'reasoning.cancelled': true,
  'tool.requested': true,
  'tool.arguments_delta': true,
  'tool.running': true,
  'tool.completed': true,
  'tool.failed': true,
  'tool.cancelled': true,
  'approval.requested': true,
  'approval.resolved': true,
  'task.created': true,
  'task.updated': true,
  'task.completed': true,
  'task.failed': true,
  'task.cancelled': true,
  'artifact.created': true,
  'artifact.updated': true,
  'artifact.completed': true,
  'artifact.failed': true,
} satisfies Record<AgentEventType, true>;

export const agentEventTypes = Object.keys(agentEventTypeMap) as AgentEventType[];

export interface AgentEventEnvelope<
  Type extends AgentEventType,
  Payload extends AgentEventPayloadMap[Type],
> {
  protocolVersion: AgentEventProtocolVersion;
  type: Type;
  eventId: string;
  sessionId: string;
  runId: string;
  sequence: number;
  timestamp: number;
  parentId?: string;
  payload: Payload;
  meta?: AgentEventMeta;
}

export type AgentEventOf<Type extends AgentEventType> = AgentEventEnvelope<
  Type,
  AgentEventPayloadMap[Type]
>;

export type AgentEvent = {
  [Type in AgentEventType]: AgentEventOf<Type>;
}[AgentEventType];

export interface UnknownAgentEventEnvelope {
  protocolVersion: AgentEventProtocolVersion;
  type: AgentEventType;
  eventId: string;
  sessionId: string;
  runId: string;
  sequence: number;
  timestamp: number;
  parentId?: string;
  payload: Record<string, unknown>;
  meta?: AgentEventMeta;
}

export function isAgentEventEnvelope(value: unknown): value is UnknownAgentEventEnvelope {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const event = value as Partial<UnknownAgentEventEnvelope>;
  return (
    event.protocolVersion === AGENT_EVENT_PROTOCOL_VERSION &&
    typeof event.type === 'string' &&
    agentEventTypes.includes(event.type as AgentEventType) &&
    typeof event.eventId === 'string' &&
    event.eventId !== '' &&
    typeof event.sessionId === 'string' &&
    event.sessionId !== '' &&
    typeof event.runId === 'string' &&
    event.runId !== '' &&
    typeof event.sequence === 'number' &&
    Number.isInteger(event.sequence) &&
    event.sequence >= 0 &&
    typeof event.timestamp === 'number' &&
    Number.isFinite(event.timestamp) &&
    (event.parentId === undefined || typeof event.parentId === 'string') &&
    !!event.payload &&
    typeof event.payload === 'object' &&
    !Array.isArray(event.payload) &&
    (event.meta === undefined ||
      (!!event.meta && typeof event.meta === 'object' && !Array.isArray(event.meta)))
  );
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const hasString = (value: Record<string, unknown>, key: string) =>
  typeof value[key] === 'string' && value[key] !== '';

const hasOptionalString = (value: Record<string, unknown>, key: string) =>
  value[key] === undefined || typeof value[key] === 'string';

const isAgentError = (value: unknown) =>
  isRecord(value) &&
  hasString(value, 'message') &&
  hasOptionalString(value, 'code') &&
  (value.retryable === undefined || typeof value.retryable === 'boolean');

const isAgentMessageContent = (value: unknown): value is AgentMessageContent => {
  if (typeof value === 'string') return true;
  if (!Array.isArray(value)) return false;
  return value.every((part) => {
    if (!isRecord(part) || typeof part.type !== 'string' || part.type === '') return false;
    const { type } = part;
    if (type === 'text') return typeof part.text === 'string';
    if (type === 'image') {
      return hasOptionalString(part, 'url') && hasOptionalString(part, 'mediaType');
    }
    if (type === 'file') {
      return (
        hasOptionalString(part, 'url') &&
        hasOptionalString(part, 'mediaType') &&
        hasOptionalString(part, 'name')
      );
    }
    return type.includes('.') && 'data' in part;
  });
};

const hasId = (payload: Record<string, unknown>, key: string) => hasString(payload, key);

export function isAgentEvent(value: unknown): value is AgentEvent {
  if (!isAgentEventEnvelope(value)) return false;
  const { payload, type } = value;

  switch (type) {
    case 'session.started':
      return hasOptionalString(payload, 'title');
    case 'run.started':
      return true;
    case 'run.completed':
      return (
        payload.usage === undefined ||
        (isRecord(payload.usage) && Object.values(payload.usage).every(Number.isFinite))
      );
    case 'run.failed':
      return isAgentError(payload.error);
    case 'run.cancelled':
      return hasOptionalString(payload, 'reason');
    case 'message.started':
      return (
        hasId(payload, 'messageId') &&
        hasString(payload, 'role') &&
        (payload.content === undefined || isAgentMessageContent(payload.content))
      );
    case 'message.delta':
      return hasId(payload, 'messageId') && isAgentMessageContent(payload.delta);
    case 'message.completed':
      return (
        hasId(payload, 'messageId') &&
        (payload.content === undefined || isAgentMessageContent(payload.content))
      );
    case 'message.failed':
      return hasId(payload, 'messageId') && isAgentError(payload.error);
    case 'message.cancelled':
      return hasId(payload, 'messageId') && hasOptionalString(payload, 'reason');
    case 'reasoning.started':
      return (
        hasId(payload, 'reasoningId') &&
        (payload.redacted === undefined || typeof payload.redacted === 'boolean')
      );
    case 'reasoning.delta':
      return hasId(payload, 'reasoningId') && typeof payload.delta === 'string';
    case 'reasoning.completed':
      return (
        hasId(payload, 'reasoningId') &&
        hasOptionalString(payload, 'content') &&
        hasOptionalString(payload, 'summary')
      );
    case 'reasoning.failed':
      return hasId(payload, 'reasoningId') && isAgentError(payload.error);
    case 'reasoning.cancelled':
      return hasId(payload, 'reasoningId') && hasOptionalString(payload, 'reason');
    case 'tool.requested':
      return (
        hasId(payload, 'toolCallId') &&
        hasString(payload, 'name') &&
        hasOptionalString(payload, 'arguments') &&
        (payload.index === undefined || Number.isInteger(payload.index)) &&
        (payload.attempt === undefined ||
          (Number.isInteger(payload.attempt) && (payload.attempt as number) >= 1)) &&
        hasOptionalString(payload, 'retryOf')
      );
    case 'tool.arguments_delta':
      return hasId(payload, 'toolCallId') && typeof payload.delta === 'string';
    case 'tool.running':
    case 'tool.completed':
      return hasId(payload, 'toolCallId');
    case 'tool.failed':
      return hasId(payload, 'toolCallId') && isAgentError(payload.error);
    case 'tool.cancelled':
      return hasId(payload, 'toolCallId') && hasOptionalString(payload, 'reason');
    case 'approval.requested':
      return (
        hasId(payload, 'approvalId') &&
        hasOptionalString(payload, 'toolCallId') &&
        hasOptionalString(payload, 'description') &&
        hasOptionalString(payload, 'risk') &&
        (payload.editable === undefined || typeof payload.editable === 'boolean') &&
        (payload.expiresAt === undefined ||
          (typeof payload.expiresAt === 'number' && Number.isFinite(payload.expiresAt))) &&
        (payload.version === undefined ||
          typeof payload.version === 'string' ||
          (typeof payload.version === 'number' && Number.isFinite(payload.version)))
      );
    case 'approval.resolved':
      return (
        hasId(payload, 'approvalId') &&
        ['approved', 'rejected', 'modified', 'expired'].includes(payload.decision as string)
      );
    case 'task.created':
      return (
        hasId(payload, 'taskId') &&
        hasString(payload, 'title') &&
        hasOptionalString(payload, 'description')
      );
    case 'task.updated':
      return (
        hasId(payload, 'taskId') &&
        hasOptionalString(payload, 'title') &&
        hasOptionalString(payload, 'description') &&
        (payload.progress === undefined || Number.isFinite(payload.progress))
      );
    case 'task.completed':
      return hasId(payload, 'taskId');
    case 'task.failed':
      return hasId(payload, 'taskId') && isAgentError(payload.error);
    case 'task.cancelled':
      return hasId(payload, 'taskId') && hasOptionalString(payload, 'reason');
    case 'artifact.created':
      return (
        hasId(payload, 'artifactId') &&
        hasString(payload, 'name') &&
        hasOptionalString(payload, 'mediaType')
      );
    case 'artifact.updated':
      return hasId(payload, 'artifactId') && 'content' in payload;
    case 'artifact.completed':
      return hasId(payload, 'artifactId');
    case 'artifact.failed':
      return hasId(payload, 'artifactId') && isAgentError(payload.error);
  }
}
