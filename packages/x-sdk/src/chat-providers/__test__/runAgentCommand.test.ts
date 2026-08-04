import type { AgentCommand, AgentEvent } from '../../agent';
import {
  AGENT_EVENT_PROTOCOL,
  AGENT_EVENT_PROTOCOL_VERSION,
  createAgentCommandFactory,
  createAgentEventFactory,
} from '../../agent';
import type { AgentProvider } from '..';
import { AgentCommandRunnerError, runAgentCommand } from '..';

const commandFactory = createAgentCommandFactory({
  sessionId: 'session-1',
  runId: 'run-1',
  now: () => 1,
});

function createProvider(
  executeCommand?: AgentProvider<never, never, never>['executeCommand'],
): AgentProvider<never, never, never> {
  return {
    id: 'command-provider',
    protocol: { name: AGENT_EVENT_PROTOCOL, version: AGENT_EVENT_PROTOCOL_VERSION },
    capabilities: {
      eventTypes: ['approval.resolved', 'run.cancelled'],
      transports: ['test.transport'],
      commands: ['approval.resolve', 'run.cancel'],
    },
    transport: { kind: 'test.transport', async *open() {} },
    createContext() {},
    start() {
      return [];
    },
    prepareRequest() {
      throw new Error('not used');
    },
    transformChunk() {
      return [];
    },
    flush() {
      return [];
    },
    transformError() {
      return [];
    },
    executeCommand,
  };
}

function eventFactory(initialSequence = 2) {
  return createAgentEventFactory({
    sessionId: 'session-1',
    runId: 'run-1',
    initialSequence,
    now: () => 10,
  });
}

describe('runAgentCommand', () => {
  it('emits declared command events in sequence', async () => {
    const events = eventFactory();
    const provider = createProvider(async function* () {
      yield events.create('approval.resolved', {
        approvalId: 'approval-1',
        decision: 'approved',
      });
      yield events.create('run.cancelled', { reason: 'done' });
    });
    const emitted: AgentEvent[] = [];

    await runAgentCommand({
      provider,
      command: commandFactory.create('approval.resolve', {
        approvalId: 'approval-1',
        decision: 'approved',
      }),
      initialSequence: 2,
      now: () => 10,
      onEvent: (event) => emitted.push(event),
    });

    expect(emitted.map(({ type, sequence }) => [type, sequence])).toEqual([
      ['approval.resolved', 3],
      ['run.cancelled', 4],
    ]);
  });

  it('rejects invalid commands, protocols and unsupported capabilities', async () => {
    const command = commandFactory.create('run.cancel', {});
    await expect(
      runAgentCommand({
        provider: createProvider(async function* () {}),
        command: { ...command, commandId: '' } as AgentCommand,
        initialSequence: -1,
        onEvent: () => {},
      }),
    ).rejects.toMatchObject({ code: 'invalid_command' });

    const incompatible = {
      ...createProvider(async function* () {}),
      protocol: { name: AGENT_EVENT_PROTOCOL, version: '0.2' },
    } as unknown as AgentProvider<never, never, never>;
    await expect(
      runAgentCommand({
        provider: incompatible,
        command,
        initialSequence: -1,
        onEvent: () => {},
      }),
    ).rejects.toMatchObject({ code: 'protocol_error' });

    const unsupported = createProvider();
    unsupported.capabilities.commands = [];
    await expect(
      runAgentCommand({
        provider: unsupported,
        command,
        initialSequence: -1,
        onEvent: () => {},
      }),
    ).rejects.toEqual(
      new AgentCommandRunnerError(
        'unsupported_capability',
        'Provider "command-provider" does not support command "run.cancel".',
      ),
    );
  });

  it.each([
    ['invalid event', (event: AgentEvent) => ({ ...event, payload: {} })],
    ['wrong session', (event: AgentEvent) => ({ ...event, sessionId: 'other' })],
    ['undeclared type', (event: AgentEvent) => ({ ...event, type: 'task.created' })],
    ['old sequence', (event: AgentEvent) => ({ ...event, sequence: 2 })],
  ])('rejects %s from the provider', async (_name, mutate) => {
    const events = eventFactory();
    const provider = createProvider(async function* () {
      yield mutate(
        events.create('approval.resolved', {
          approvalId: 'approval-1',
          decision: 'approved',
        }),
      ) as AgentEvent;
    });

    await expect(
      runAgentCommand({
        provider,
        command: commandFactory.create('approval.resolve', {
          approvalId: 'approval-1',
          decision: 'approved',
        }),
        initialSequence: 2,
        onEvent: () => {},
      }),
    ).rejects.toMatchObject({ code: 'protocol_error' });
  });

  it('rethrows consumer failures without wrapping them', async () => {
    const consumerError = new Error('consumer failed');
    const events = eventFactory();
    const provider = createProvider(async function* () {
      yield events.create('run.cancelled', {});
    });

    await expect(
      runAgentCommand({
        provider,
        command: commandFactory.create('run.cancel', {}),
        initialSequence: 2,
        onEvent: () => {
          throw consumerError;
        },
      }),
    ).rejects.toBe(consumerError);
  });

  it('honors aborts before and during command iteration', async () => {
    const before = new AbortController();
    before.abort('before');
    await expect(
      runAgentCommand({
        provider: createProvider(async function* () {}),
        command: commandFactory.create('run.cancel', {}),
        signal: before.signal,
        initialSequence: -1,
        onEvent: () => {},
      }),
    ).rejects.toMatchObject({ name: 'AbortError' });

    const during = new AbortController();
    const events = eventFactory(-1);
    const provider = createProvider(async function* () {
      yield events.create('approval.resolved', {
        approvalId: 'approval-1',
        decision: 'approved',
      });
      yield events.create('run.cancelled', {});
    });
    await expect(
      runAgentCommand({
        provider,
        command: commandFactory.create('approval.resolve', {
          approvalId: 'approval-1',
          decision: 'approved',
        }),
        signal: during.signal,
        initialSequence: -1,
        onEvent: () => during.abort('during'),
      }),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('propagates provider failures and removes the external abort listener', async () => {
    const failure = new Error('provider failed');
    const provider = createProvider(async function* () {
      yield await Promise.reject(failure);
    });
    const controller = new AbortController();
    const removeEventListener = jest.spyOn(controller.signal, 'removeEventListener');

    await expect(
      runAgentCommand({
        provider,
        command: commandFactory.create('run.cancel', {}),
        signal: controller.signal,
        initialSequence: -1,
        onEvent: () => {},
      }),
    ).rejects.toBe(failure);
    expect(removeEventListener).toHaveBeenCalledWith('abort', expect.any(Function));
  });
});
