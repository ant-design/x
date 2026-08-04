import {
  AGENT_EVENT_PROTOCOL_VERSION,
  agentEventTypes,
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

  it('validates every supported event payload', () => {
    const factory = createAgentEventFactory({ sessionId: 's', runId: 'r' });
    const events = [
      factory.create('session.started', { title: 'Session' }),
      factory.create('run.started', { input: { query: 'hello' } }),
      factory.create('run.completed', { output: 'done', usage: { inputTokens: 1 } }),
      factory.create('run.failed', {
        error: { code: 'offline', message: 'Offline', retryable: true },
      }),
      factory.create('run.cancelled', { reason: 'Stopped' }),
      factory.create('message.started', {
        messageId: 'message-1',
        role: 'assistant',
        content: [
          { type: 'text', text: 'Hello' },
          { type: 'image', url: 'image.png', mediaType: 'image/png' },
          { type: 'file', url: 'file.txt', mediaType: 'text/plain', name: 'file.txt' },
          { type: 'custom.data', data: { value: 1 } },
        ],
      }),
      factory.create('message.delta', { messageId: 'message-1', delta: ' world' }),
      factory.create('message.completed', { messageId: 'message-1', content: 'Hello world' }),
      factory.create('message.failed', {
        messageId: 'message-1',
        error: { message: 'Failed' },
      }),
      factory.create('message.cancelled', { messageId: 'message-1', reason: 'Stopped' }),
      factory.create('reasoning.started', { reasoningId: 'reasoning-1', redacted: false }),
      factory.create('reasoning.delta', { reasoningId: 'reasoning-1', delta: 'Thinking' }),
      factory.create('reasoning.completed', {
        reasoningId: 'reasoning-1',
        content: 'Thought',
        summary: 'Summary',
      }),
      factory.create('reasoning.failed', {
        reasoningId: 'reasoning-1',
        error: { message: 'Failed' },
      }),
      factory.create('reasoning.cancelled', { reasoningId: 'reasoning-1', reason: 'Stopped' }),
      factory.create('tool.requested', {
        toolCallId: 'tool-1',
        name: 'search',
        arguments: '{}',
        index: 0,
      }),
      factory.create('tool.arguments_delta', { toolCallId: 'tool-1', delta: '{}' }),
      factory.create('tool.running', { toolCallId: 'tool-1' }),
      factory.create('tool.completed', { toolCallId: 'tool-1', result: { ok: true } }),
      factory.create('tool.failed', { toolCallId: 'tool-1', error: { message: 'Failed' } }),
      factory.create('tool.cancelled', { toolCallId: 'tool-1', reason: 'Stopped' }),
      factory.create('approval.requested', {
        approvalId: 'approval-1',
        toolCallId: 'tool-1',
        description: 'Allow search',
        risk: 'low',
      }),
      factory.create('approval.resolved', {
        approvalId: 'approval-1',
        decision: 'approved',
      }),
      factory.create('task.created', {
        taskId: 'task-1',
        title: 'Task',
        description: 'Description',
      }),
      factory.create('task.updated', {
        taskId: 'task-1',
        title: 'Updated task',
        description: 'Updated description',
        progress: 0.5,
      }),
      factory.create('task.completed', { taskId: 'task-1', result: 'Done' }),
      factory.create('task.failed', { taskId: 'task-1', error: { message: 'Failed' } }),
      factory.create('task.cancelled', { taskId: 'task-1', reason: 'Stopped' }),
      factory.create('artifact.created', {
        artifactId: 'artifact-1',
        name: 'report.md',
        mediaType: 'text/markdown',
      }),
      factory.create('artifact.updated', {
        artifactId: 'artifact-1',
        content: '# Report',
        version: 1,
      }),
      factory.create('artifact.completed', {
        artifactId: 'artifact-1',
        content: '# Report',
        version: 2,
      }),
      factory.create('artifact.failed', {
        artifactId: 'artifact-1',
        error: { message: 'Failed' },
      }),
    ];

    expect(events).toHaveLength(agentEventTypes.length);
    expect(events.map(({ type }) => type)).toEqual(agentEventTypes);
    expect(events.every(isAgentEvent)).toBe(true);
  });

  it('rejects non-object envelopes and malformed structured content', () => {
    const factory = createAgentEventFactory({ sessionId: 's', runId: 'r' });
    const delta = factory.create('message.delta', { messageId: 'message-1', delta: 'Hello' });

    expect(isAgentEventEnvelope(null)).toBe(false);
    expect(
      isAgentEvent({ ...delta, payload: { messageId: 'message-1', delta: { text: 'Hello' } } }),
    ).toBe(false);
    expect(
      isAgentEvent({ ...delta, payload: { messageId: 'message-1', delta: [{ type: 'text' }] } }),
    ).toBe(false);
  });
});
