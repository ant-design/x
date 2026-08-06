import type { ApprovalDecision } from '../protocol';

export const AGENT_COMMAND_PROTOCOL = 'agent-command' as const;
export const AGENT_COMMAND_PROTOCOL_VERSION = '0.1' as const;

export type AgentCommandProtocolVersion = typeof AGENT_COMMAND_PROTOCOL_VERSION;
export type AgentCommandDecision = Exclude<ApprovalDecision, 'expired'>;
export type AgentCommandMeta = Readonly<Record<string, unknown>>;

export interface AgentCommandPayloadMap {
  'approval.resolve': {
    approvalId: string;
    decision: AgentCommandDecision;
    data?: unknown;
    expectedVersion?: string | number;
  };
  'tool.retry': {
    toolCallId: string;
  };
  'run.cancel': {
    reason?: string;
  };
}

export type AgentCommandType = keyof AgentCommandPayloadMap;

const agentCommandTypeMap = {
  'approval.resolve': true,
  'tool.retry': true,
  'run.cancel': true,
} satisfies Record<AgentCommandType, true>;

export const agentCommandTypes = Object.keys(agentCommandTypeMap) as AgentCommandType[];

export interface AgentCommandEnvelope<Type extends AgentCommandType> {
  commandProtocol: typeof AGENT_COMMAND_PROTOCOL;
  commandProtocolVersion: AgentCommandProtocolVersion;
  type: Type;
  commandId: string;
  idempotencyKey: string;
  sessionId: string;
  runId: string;
  timestamp: number;
  payload: AgentCommandPayloadMap[Type];
  meta?: AgentCommandMeta;
}

export type AgentCommandOf<Type extends AgentCommandType> = AgentCommandEnvelope<Type>;

export type AgentCommand = {
  [Type in AgentCommandType]: AgentCommandOf<Type>;
}[AgentCommandType];

export interface UnknownAgentCommandEnvelope {
  commandProtocol: typeof AGENT_COMMAND_PROTOCOL;
  commandProtocolVersion: AgentCommandProtocolVersion;
  type: AgentCommandType;
  commandId: string;
  idempotencyKey: string;
  sessionId: string;
  runId: string;
  timestamp: number;
  payload: Record<string, unknown>;
  meta?: AgentCommandMeta;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const hasString = (value: Record<string, unknown>, key: string) =>
  typeof value[key] === 'string' && value[key] !== '';

export function isAgentCommandEnvelope(value: unknown): value is UnknownAgentCommandEnvelope {
  if (!isRecord(value)) return false;

  return (
    value.commandProtocol === AGENT_COMMAND_PROTOCOL &&
    value.commandProtocolVersion === AGENT_COMMAND_PROTOCOL_VERSION &&
    typeof value.type === 'string' &&
    agentCommandTypes.includes(value.type as AgentCommandType) &&
    hasString(value, 'commandId') &&
    hasString(value, 'idempotencyKey') &&
    hasString(value, 'sessionId') &&
    hasString(value, 'runId') &&
    typeof value.timestamp === 'number' &&
    Number.isFinite(value.timestamp) &&
    isRecord(value.payload) &&
    (value.meta === undefined || isRecord(value.meta))
  );
}

export function isAgentCommand(value: unknown): value is AgentCommand {
  if (!isAgentCommandEnvelope(value)) return false;
  const { payload } = value;

  switch (value.type) {
    case 'approval.resolve':
      return (
        hasString(payload, 'approvalId') &&
        ['approved', 'rejected', 'modified'].includes(payload.decision as string) &&
        (payload.expectedVersion === undefined ||
          typeof payload.expectedVersion === 'string' ||
          (typeof payload.expectedVersion === 'number' && Number.isFinite(payload.expectedVersion)))
      );
    case 'tool.retry':
      return hasString(payload, 'toolCallId');
    case 'run.cancel':
      return payload.reason === undefined || typeof payload.reason === 'string';
  }
}

export function getAgentCommandKey(command: AgentCommand): string {
  return command.commandId;
}

export interface AgentActionKeyOptions {
  runId: string;
  type: AgentCommandType;
  entityId?: string;
}

export function getAgentActionKey({ runId, type, entityId = '' }: AgentActionKeyOptions): string {
  return `${runId.length}:${runId}:${type}:${entityId}`;
}

export function getAgentCommandActionKey(command: AgentCommand): string {
  switch (command.type) {
    case 'approval.resolve':
      return getAgentActionKey({
        runId: command.runId,
        type: command.type,
        entityId: command.payload.approvalId,
      });
    case 'tool.retry':
      return getAgentActionKey({
        runId: command.runId,
        type: command.type,
        entityId: command.payload.toolCallId,
      });
    case 'run.cancel':
      return getAgentActionKey({ runId: command.runId, type: command.type });
  }
}
