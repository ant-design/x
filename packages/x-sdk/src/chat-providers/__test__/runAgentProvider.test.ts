import type { AgentEvent, AgentEventFactory } from '../../agent/protocol';
import {
  AGENT_EVENT_PROTOCOL,
  AGENT_EVENT_PROTOCOL_VERSION,
  createAgentEventFactory,
} from '../../agent/protocol';
import type { AgentProvider, AgentTransport } from '..';
import { runAgentProvider, validateAgentProviderEvents } from '..';

interface FixtureContext {
  events: AgentEventFactory;
  messageId: string;
}

const eventTypes = [
  'run.started',
  'message.started',
  'message.delta',
  'message.completed',
  'message.failed',
  'run.completed',
  'run.failed',
] as const;

function createFixtureProvider(
  transport: AgentTransport<string, string>,
): AgentProvider<string, string, string, FixtureContext> {
  return {
    id: 'fixture.provider',
    protocol: {
      name: AGENT_EVENT_PROTOCOL,
      version: AGENT_EVENT_PROTOCOL_VERSION,
    },
    transport,
    capabilities: {
      eventTypes,
      transports: ['async-iterable'],
    },
    createContext(options) {
      return { events: options.events, messageId: 'message-1' };
    },
    start(input, context) {
      return [
        context.events.create('run.started', { input }),
        context.events.create('message.started', {
          messageId: context.messageId,
          role: 'assistant',
        }),
      ];
    },
    prepareRequest(input) {
      return input;
    },
    transformChunk(chunk, context) {
      return [
        context.events.create('message.delta', {
          messageId: context.messageId,
          delta: chunk,
        }),
      ];
    },
    flush(context) {
      return [
        context.events.create('message.completed', { messageId: context.messageId }),
        context.events.create('run.completed', {}),
      ];
    },
    transformError(error, context) {
      const agentError = { message: error instanceof Error ? error.message : String(error) };
      return [
        context.events.create('message.failed', {
          messageId: context.messageId,
          error: agentError,
        }),
        context.events.create('run.failed', { error: agentError }),
      ];
    },
  };
}

describe('runAgentProvider', () => {
  it('runs a model-independent provider over an async transport', async () => {
    const transport: AgentTransport<string, string> = {
      kind: 'async-iterable',
      async *open(request) {
        yield `${request} `;
        yield 'world';
      },
    };
    const provider = createFixtureProvider(transport);
    const emitted: AgentEvent[] = [];

    await runAgentProvider({
      provider,
      input: 'hello',
      run: { sessionId: 'session-1', runId: 'run-1', now: () => 1 },
      onEvent: (event) => emitted.push(event),
    });

    expect(emitted.map(({ type }) => type)).toEqual([
      'run.started',
      'message.started',
      'message.delta',
      'message.delta',
      'message.completed',
      'run.completed',
    ]);
    expect(validateAgentProviderEvents(provider.capabilities, emitted)).toEqual([]);
  });

  it('lets the provider normalize transport errors before the first chunk', async () => {
    const transport: AgentTransport<string, string> = {
      kind: 'async-iterable',
      open() {
        return {
          async *[Symbol.asyncIterator]() {
            yield await Promise.reject(new Error('offline'));
          },
        };
      },
    };
    const provider = createFixtureProvider(transport);
    const emitted: AgentEvent[] = [];

    await runAgentProvider({
      provider,
      input: 'hello',
      run: { sessionId: 'session-1', runId: 'run-1' },
      onEvent: (event) => emitted.push(event),
    });

    expect(emitted.map(({ type }) => type)).toEqual([
      'run.started',
      'message.started',
      'message.failed',
      'run.failed',
    ]);
    expect(validateAgentProviderEvents(provider.capabilities, emitted)).toEqual([]);
  });

  it('reports provider contract violations', () => {
    const provider = createFixtureProvider({
      kind: 'async-iterable',
      async *open() {},
    });
    const events = createAgentEventFactoryForInvalidSequence();

    expect(
      validateAgentProviderEvents(provider.capabilities, events).map(({ code }) => code),
    ).toEqual(
      expect.arrayContaining(['invalid_sequence', 'missing_run_terminal', 'invalid_lifecycle']),
    );
  });

  it('rejects malformed payloads and incompatible protocol versions', async () => {
    const transport: AgentTransport<string, string> = {
      kind: 'async-iterable',
      async *open() {},
    };
    const provider = createFixtureProvider(transport);
    const malformed = {
      ...createAgentEventFactory({ sessionId: 's', runId: 'r' }).create('message.started', {
        messageId: 'm',
        role: 'assistant',
      }),
      payload: {},
    };

    expect(validateAgentProviderEvents(provider.capabilities, [malformed])).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'invalid_event' })]),
    );

    const malformedProvider = {
      ...provider,
      start() {
        return [malformed as AgentEvent];
      },
    };
    await expect(
      runAgentProvider({
        provider: malformedProvider,
        input: 'hello',
        run: { sessionId: 's', runId: 'r' },
        onEvent: () => {},
      }),
    ).rejects.toThrow('emitted an invalid event');

    const incompatible = {
      ...provider,
      protocol: { name: 'agent-event', version: '0.2' },
    } as unknown as AgentProvider<string, string, string, FixtureContext>;
    await expect(
      runAgentProvider({
        provider: incompatible,
        input: 'hello',
        run: { sessionId: 's', runId: 'r' },
        onEvent: () => {},
      }),
    ).rejects.toThrow('unsupported agent protocol "0.2"');
  });

  it('reports undeclared, duplicate, inconsistent and multiple terminal events', () => {
    const provider = createFixtureProvider({
      kind: 'async-iterable',
      async *open() {},
    });
    const first = createAgentEventFactory({ sessionId: 's1', runId: 'r1' });
    const second = createAgentEventFactory({ sessionId: 's2', runId: 'r2' });
    const started = first.create('run.started', {}, { eventId: 'duplicate' });
    const events: AgentEvent[] = [
      started,
      { ...started },
      second.create('task.created', { taskId: 'task', title: 'Task' }),
      first.create('run.completed', {}),
      first.create('run.failed', { error: { message: 'late' } }),
    ];

    expect(
      validateAgentProviderEvents(provider.capabilities, events).map(({ code }) => code),
    ).toEqual(
      expect.arrayContaining([
        'duplicate_event_id',
        'inconsistent_run',
        'invalid_lifecycle',
        'invalid_sequence',
        'multiple_run_terminals',
        'undeclared_event_type',
      ]),
    );
  });

  it('rejects undeclared transports and preserves consumer errors', async () => {
    const unsupported: AgentTransport<string, string> = {
      kind: 'websocket',
      async *open() {
        yield 'unused';
      },
    };
    const provider = createFixtureProvider(unsupported);

    await expect(
      runAgentProvider({
        provider,
        input: 'hello',
        run: { sessionId: 's', runId: 'r' },
        onEvent: () => {},
      }),
    ).rejects.toThrow('does not declare transport "websocket"');

    const supported: AgentTransport<string, string> = {
      kind: 'async-iterable',
      async *open() {
        yield 'hello';
      },
    };
    const supportedProvider = createFixtureProvider(supported);
    const consumerError = new Error('consumer failed');
    await expect(
      runAgentProvider({
        provider: supportedProvider,
        input: 'hello',
        run: { sessionId: 's', runId: 'r' },
        onEvent: () => {
          throw consumerError;
        },
      }),
    ).rejects.toBe(consumerError);
  });
});

function createAgentEventFactoryForInvalidSequence(): AgentEvent[] {
  const factory = createAgentEventFactory({ sessionId: 's', runId: 'r' });
  return [
    factory.create('run.started', {}, { sequence: 1 }),
    factory.create('message.started', { messageId: 'm', role: 'assistant' }, { sequence: 0 }),
  ];
}
