import {
  AGENT_EVENT_PROTOCOL_VERSION,
  createAgentEventFactory,
  isAgentEvent,
  isAgentEventEnvelope,
} from '..';

describe('AgentEventFactory', () => {
  it('creates deterministic, typed event envelopes', () => {
    const factory = createAgentEventFactory({
      sessionId: 'session-1',
      runId: 'run-1',
      now: () => 100,
    });

    const started = factory.create('message.started', {
      messageId: 'message-1',
      role: 'assistant',
    });
    const delta = factory.create(
      'message.delta',
      { messageId: 'message-1', delta: 'hello' },
      { parentId: 'task-1', meta: { provider: 'fixture' } },
    );

    expect(started).toEqual({
      protocolVersion: AGENT_EVENT_PROTOCOL_VERSION,
      type: 'message.started',
      eventId: 'run-1:0:message.started',
      sessionId: 'session-1',
      runId: 'run-1',
      sequence: 0,
      timestamp: 100,
      payload: { messageId: 'message-1', role: 'assistant' },
    });
    expect(delta.sequence).toBe(1);
    expect(delta.parentId).toBe('task-1');
    expect(isAgentEventEnvelope(delta)).toBe(true);
    expect(isAgentEvent(delta)).toBe(true);
    expect(factory.getSequence()).toBe(1);
  });

  it('accepts provider sequences while keeping generated sequences monotonic', () => {
    const factory = createAgentEventFactory({ sessionId: 's', runId: 'r' });
    const remote = factory.create('run.started', {}, { sequence: 10 });
    const local = factory.create('run.completed', {});

    expect(remote.sequence).toBe(10);
    expect(local.sequence).toBe(11);
  });

  it('rejects invalid sequences and malformed envelopes', () => {
    const factory = createAgentEventFactory({ sessionId: 's', runId: 'r' });

    expect(() => factory.create('run.started', {}, { sequence: -1 })).toThrow(
      'Agent event sequence must be a non-negative integer.',
    );
    expect(isAgentEventEnvelope({ type: 'run.started' })).toBe(false);
    expect(
      isAgentEvent({
        ...factory.create('message.started', { messageId: 'm', role: 'assistant' }),
        payload: {},
      }),
    ).toBe(false);
    expect(
      isAgentEventEnvelope({
        type: 'unknown.event',
        eventId: 'e',
        sessionId: 's',
        runId: 'r',
        sequence: 0,
        timestamp: 0,
        payload: {},
      }),
    ).toBe(false);
  });
});
