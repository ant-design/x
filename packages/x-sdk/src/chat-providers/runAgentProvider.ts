import type { AgentEvent } from '../agent/protocol';
import {
  AGENT_EVENT_PROTOCOL_VERSION,
  createAgentEventFactory,
  isAgentEvent,
} from '../agent/protocol';
import type { RunAgentProviderOptions } from './AgentProvider';

class AgentEventConsumerError extends Error {
  cause: unknown;

  constructor(cause: unknown) {
    super('Agent event consumer failed.');
    this.cause = cause;
  }
}

class AgentProviderProtocolError extends Error {}

export async function runAgentProvider<Input, Request, Chunk, Context>(
  options: RunAgentProviderOptions<Input, Request, Chunk, Context>,
): Promise<void> {
  const { provider, input, onEvent } = options;
  if (provider.protocol.version !== AGENT_EVENT_PROTOCOL_VERSION) {
    throw new Error(
      `Provider "${provider.id}" uses unsupported agent protocol "${provider.protocol.version}".`,
    );
  }
  const { transport } = provider;
  if (!provider.capabilities.transports.includes(transport.kind)) {
    throw new Error(`Provider "${provider.id}" does not declare transport "${transport.kind}".`);
  }
  const controller = new AbortController();
  const externalSignal = options.run.signal;
  const abort = () => controller.abort(externalSignal?.reason);
  externalSignal?.addEventListener('abort', abort, { once: true });
  if (externalSignal?.aborted) abort();

  const events = createAgentEventFactory(options.run);
  const context = provider.createContext({ ...options.run, events });
  const emit = (event: AgentEvent) => {
    if (!isAgentEvent(event)) {
      throw new AgentProviderProtocolError(`Provider "${provider.id}" emitted an invalid event.`);
    }
    if (event.sessionId !== options.run.sessionId || event.runId !== options.run.runId) {
      throw new AgentProviderProtocolError(
        `Provider "${provider.id}" emitted an event outside the active session or run.`,
      );
    }
    if (!provider.capabilities.eventTypes.includes(event.type)) {
      throw new AgentProviderProtocolError(
        `Provider "${provider.id}" emitted undeclared event type "${event.type}".`,
      );
    }
    try {
      onEvent(event);
    } catch (error) {
      throw new AgentEventConsumerError(error);
    }
  };

  try {
    provider.start(input, context).forEach(emit);
    const request = provider.prepareRequest(input, context);
    for await (const chunk of transport.open(request, controller.signal)) {
      provider.transformChunk(chunk, context).forEach(emit);
    }
    provider.flush(context).forEach(emit);
  } catch (error) {
    if (error instanceof AgentEventConsumerError) throw error.cause;
    if (error instanceof AgentProviderProtocolError) throw error;
    provider.transformError(error, context).forEach(emit);
  } finally {
    externalSignal?.removeEventListener('abort', abort);
  }
}
