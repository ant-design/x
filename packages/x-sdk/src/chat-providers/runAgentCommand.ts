import type { AgentEvent } from '../agent';
import { AGENT_EVENT_PROTOCOL_VERSION, isAgentCommand, isAgentEvent } from '../agent';
import type { RunAgentCommandOptions } from './AgentProvider';

class AgentCommandConsumerError extends Error {
  cause: unknown;

  constructor(cause: unknown) {
    super('Agent command event consumer failed.');
    this.cause = cause;
  }
}

export type AgentCommandRunnerErrorCode =
  | 'unsupported_capability'
  | 'invalid_command'
  | 'protocol_error';

export class AgentCommandRunnerError extends Error {
  code: AgentCommandRunnerErrorCode;

  constructor(code: AgentCommandRunnerErrorCode, message: string) {
    super(message);
    this.name = 'AgentCommandRunnerError';
    this.code = code;
  }
}

export async function runAgentCommand(options: RunAgentCommandOptions): Promise<void> {
  const { provider, command, onEvent } = options;
  if (!isAgentCommand(command)) {
    throw new AgentCommandRunnerError('invalid_command', 'Agent command is invalid.');
  }
  if (provider.protocol.version !== AGENT_EVENT_PROTOCOL_VERSION) {
    throw new AgentCommandRunnerError(
      'protocol_error',
      `Provider "${provider.id}" uses unsupported agent protocol "${provider.protocol.version}".`,
    );
  }
  if (!provider.capabilities.commands?.includes(command.type) || !provider.executeCommand) {
    throw new AgentCommandRunnerError(
      'unsupported_capability',
      `Provider "${provider.id}" does not support command "${command.type}".`,
    );
  }

  const controller = new AbortController();
  const externalSignal = options.signal;
  const abort = () => controller.abort(externalSignal?.reason);
  externalSignal?.addEventListener('abort', abort, { once: true });
  if (externalSignal?.aborted) abort();

  let lastSequence = options.initialSequence;
  const emit = (event: AgentEvent) => {
    if (!isAgentEvent(event)) {
      throw new AgentCommandRunnerError(
        'protocol_error',
        `Provider "${provider.id}" emitted an invalid command event.`,
      );
    }
    if (event.sessionId !== command.sessionId || event.runId !== command.runId) {
      throw new AgentCommandRunnerError(
        'protocol_error',
        `Provider "${provider.id}" emitted a command event outside the active session or run.`,
      );
    }
    if (!provider.capabilities.eventTypes.includes(event.type)) {
      throw new AgentCommandRunnerError(
        'protocol_error',
        `Provider "${provider.id}" emitted undeclared event type "${event.type}".`,
      );
    }
    if (event.sequence <= lastSequence) {
      throw new AgentCommandRunnerError(
        'protocol_error',
        `Command event sequence ${event.sequence} must be greater than ${lastSequence}.`,
      );
    }
    try {
      onEvent(event);
    } catch (error) {
      throw new AgentCommandConsumerError(error);
    }
    lastSequence = event.sequence;
  };

  try {
    if (controller.signal.aborted) {
      throw new DOMException('Agent command was interrupted.', 'AbortError');
    }
    for await (const event of provider.executeCommand(command, {
      signal: controller.signal,
      initialSequence: options.initialSequence,
      now: options.now,
    })) {
      if (controller.signal.aborted) {
        throw new DOMException('Agent command was interrupted.', 'AbortError');
      }
      emit(event);
    }
    if (controller.signal.aborted) {
      throw new DOMException('Agent command was interrupted.', 'AbortError');
    }
  } catch (error) {
    if (error instanceof AgentCommandConsumerError) throw error.cause;
    throw error;
  } finally {
    externalSignal?.removeEventListener('abort', abort);
  }
}
