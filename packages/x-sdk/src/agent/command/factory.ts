import type { AgentCommandOf, AgentCommandType } from './commands';
import { AGENT_COMMAND_PROTOCOL, AGENT_COMMAND_PROTOCOL_VERSION } from './commands';
import type {
  AgentCommandFactory,
  AgentCommandFactoryOptions,
  CreateAgentCommandOptions,
} from './types';

let nextCommandId = 0;

export function createAgentCommandFactory(
  options: AgentCommandFactoryOptions,
): AgentCommandFactory {
  const now = options.now ?? Date.now;
  const createCommandId =
    options.createCommandId ??
    ((type: AgentCommandType) => {
      nextCommandId += 1;
      return `${options.runId}:command:${nextCommandId}:${type}`;
    });
  const createIdempotencyKey =
    options.createIdempotencyKey ?? ((commandId: string) => `${commandId}:idempotency`);

  return {
    create(type, payload, commandOptions: CreateAgentCommandOptions = {}) {
      const commandId = commandOptions.commandId ?? createCommandId(type);
      const command = {
        commandProtocol: AGENT_COMMAND_PROTOCOL,
        commandProtocolVersion: AGENT_COMMAND_PROTOCOL_VERSION,
        type,
        commandId,
        idempotencyKey: commandOptions.idempotencyKey ?? createIdempotencyKey(commandId, type),
        sessionId: options.sessionId,
        runId: options.runId,
        timestamp: commandOptions.timestamp ?? now(),
        payload,
      } as AgentCommandOf<typeof type>;
      if (commandOptions.meta !== undefined) command.meta = commandOptions.meta;
      return command;
    },
  };
}
