import type {
  AgentCommandMeta,
  AgentCommandOf,
  AgentCommandPayloadMap,
  AgentCommandType,
} from './commands';

export interface AgentCommandFactoryOptions {
  sessionId: string;
  runId: string;
  now?: () => number;
  createCommandId?: (type: AgentCommandType) => string;
  createIdempotencyKey?: (commandId: string, type: AgentCommandType) => string;
}

export interface CreateAgentCommandOptions {
  commandId?: string;
  idempotencyKey?: string;
  timestamp?: number;
  meta?: AgentCommandMeta;
}

export interface AgentCommandFactory {
  create<Type extends AgentCommandType>(
    type: Type,
    payload: AgentCommandPayloadMap[Type],
    options?: CreateAgentCommandOptions,
  ): AgentCommandOf<Type>;
}
