import { createAgentEventFactory } from '../../protocol';
import {
  createInitialAgentState,
  getAgentEntityKey,
  reduceAgentState,
  replayAgentEvents,
} from '..';

describe('reduceAgentState', () => {
  it('reduces model-independent entity lifecycles into serializable state', () => {
    const events = createAgentEventFactory({
      sessionId: 'session-1',
      runId: 'run-1',
      now: () => 10,
    });
    const sequence = [
      events.create('run.started', { input: { prompt: 'hello' } }),
      events.create('message.started', { messageId: 'message-1', role: 'assistant' }),
      events.create('message.delta', { messageId: 'message-1', delta: 'hel' }),
      events.create('message.delta', { messageId: 'message-1', delta: 'lo' }),
      events.create('message.completed', { messageId: 'message-1' }),
      events.create('reasoning.started', { reasoningId: 'reasoning-1' }),
      events.create('reasoning.delta', { reasoningId: 'reasoning-1', delta: 'check' }),
      events.create('reasoning.completed', {
        reasoningId: 'reasoning-1',
        summary: 'checked',
      }),
      events.create('tool.requested', {
        toolCallId: 'tool-1',
        name: 'search',
        arguments: '{"q":',
      }),
      events.create('tool.arguments_delta', { toolCallId: 'tool-1', delta: '"x"}' }),
      events.create('tool.running', { toolCallId: 'tool-1' }),
      events.create('tool.completed', { toolCallId: 'tool-1', result: ['result'] }),
      events.create('approval.requested', {
        approvalId: 'approval-1',
        toolCallId: 'tool-1',
        risk: 'high',
      }),
      events.create('approval.resolved', {
        approvalId: 'approval-1',
        decision: 'approved',
      }),
      events.create('task.created', { taskId: 'task-1', title: 'Analyze' }),
      events.create('task.updated', { taskId: 'task-1', progress: 50 }),
      events.create('task.completed', { taskId: 'task-1', result: 'done' }),
      events.create('artifact.created', {
        artifactId: 'artifact-1',
        name: 'report.md',
        content: 'draft',
      }),
      events.create('artifact.updated', {
        artifactId: 'artifact-1',
        content: 'final',
        version: 2,
      }),
      events.create('artifact.completed', { artifactId: 'artifact-1' }),
      events.create('run.completed', { output: 'ok', usage: { inputTokens: 10 } }),
    ];

    const state = replayAgentEvents(sequence);

    expect(state.issues).toEqual([]);
    expect(state.messages[getAgentEntityKey('run-1', 'message-1')]).toMatchObject({
      content: 'hello',
      status: 'completed',
    });
    expect(state.reasoning[getAgentEntityKey('run-1', 'reasoning-1')]).toMatchObject({
      content: 'check',
      summary: 'checked',
      status: 'completed',
    });
    expect(state.toolCalls[getAgentEntityKey('run-1', 'tool-1')]).toMatchObject({
      arguments: '{"q":"x"}',
      result: ['result'],
      status: 'completed',
    });
    expect(state.approvals[getAgentEntityKey('run-1', 'approval-1')]).toMatchObject({
      decision: 'approved',
      status: 'completed',
    });
    expect(state.tasks[getAgentEntityKey('run-1', 'task-1')]).toMatchObject({
      progress: 50,
      status: 'completed',
    });
    expect(state.artifacts[getAgentEntityKey('run-1', 'artifact-1')]).toMatchObject({
      content: 'final',
      version: 2,
      status: 'completed',
    });
    expect(state.runs['run-1']).toMatchObject({
      status: 'completed',
      output: 'ok',
      usage: { inputTokens: 10 },
    });
    expect(state.order.map(({ kind, id }) => `${kind}:${id}`)).toEqual([
      'message:message-1',
      'reasoning:reasoning-1',
      'tool:tool-1',
      'approval:approval-1',
      'task:task-1',
      'artifact:artifact-1',
    ]);
    expect(() => JSON.stringify(state)).not.toThrow();
  });

  it('is idempotent for duplicate event ids', () => {
    const events = createAgentEventFactory({ sessionId: 's', runId: 'r' });
    const event = events.create('run.started', {});
    const state = reduceAgentState(createInitialAgentState(), event);

    expect(reduceAgentState(state, event)).toBe(state);
  });

  it('scopes duplicate event ids by run', () => {
    const first = createAgentEventFactory({ sessionId: 's', runId: 'first' });
    const second = createAgentEventFactory({ sessionId: 's', runId: 'second' });
    const state = replayAgentEvents([
      first.create('run.started', {}, { eventId: 'shared-event' }),
      second.create('run.started', {}, { eventId: 'shared-event' }),
    ]);

    expect(Object.keys(state.runs)).toEqual(['first', 'second']);
  });

  it('scopes entity ids by run and preserves structured message content', () => {
    const first = createAgentEventFactory({ sessionId: 's', runId: 'first' });
    const second = createAgentEventFactory({ sessionId: 's', runId: 'second' });
    const state = replayAgentEvents([
      first.create('run.started', {}),
      first.create('message.started', { messageId: 'shared', role: 'assistant' }),
      first.create('message.delta', { messageId: 'shared', delta: 'first' }),
      first.create('message.completed', { messageId: 'shared' }),
      first.create('run.completed', {}),
      second.create('run.started', {}),
      second.create('message.started', {
        messageId: 'shared',
        role: 'assistant',
        content: [{ type: 'text', text: 'second' }],
      }),
      second.create('message.delta', {
        messageId: 'shared',
        delta: [{ type: 'image', url: 'https://example.com/image.png' }],
      }),
      second.create('message.completed', { messageId: 'shared' }),
      second.create('run.completed', {}),
    ]);

    expect(state.issues).toEqual([]);
    expect(state.messages[getAgentEntityKey('first', 'shared')].content).toBe('first');
    expect(state.messages[getAgentEntityKey('second', 'shared')].content).toEqual([
      { type: 'text', text: 'second' },
      { type: 'image', url: 'https://example.com/image.png' },
    ]);
  });

  it('records orphan, out-of-order and terminal transition issues without throwing', () => {
    const events = createAgentEventFactory({ sessionId: 's', runId: 'r' });
    const state = replayAgentEvents([
      events.create('message.delta', { messageId: 'missing', delta: 'x' }),
      events.create('run.started', {}),
      events.create('run.completed', {}),
      events.create('message.started', { messageId: 'late', role: 'assistant' }),
      events.create('task.created', { taskId: 'old', title: 'old' }, { sequence: 1 }),
    ]);

    expect(state.issues.map(({ code }) => code)).toEqual([
      'missing_entity',
      'invalid_transition',
      'invalid_sequence',
    ]);
    expect(state.messages[getAgentEntityKey('r', 'late')]).toBeUndefined();
  });

  it('supports failed and cancelled entity terminals', () => {
    const failed = createAgentEventFactory({ sessionId: 's', runId: 'failed' });
    const error = { code: 'offline', message: 'offline', retryable: true };
    const failedState = replayAgentEvents([
      failed.create('run.started', {}),
      failed.create('message.started', { messageId: 'mf', role: 'assistant' }),
      failed.create('message.failed', { messageId: 'mf', error }),
      failed.create('reasoning.started', { reasoningId: 'rf', redacted: true }),
      failed.create('reasoning.failed', { reasoningId: 'rf', error }),
      failed.create('tool.requested', { toolCallId: 'tf', name: 'tool' }),
      failed.create('tool.failed', { toolCallId: 'tf', error }),
      failed.create('task.created', { taskId: 'taskf', title: 'Task' }),
      failed.create('task.failed', { taskId: 'taskf', error }),
      failed.create('artifact.created', { artifactId: 'af', name: 'file' }),
      failed.create('artifact.failed', { artifactId: 'af', error }),
      failed.create('run.failed', { error }),
    ]);

    expect(failedState.messages[getAgentEntityKey('failed', 'mf')]).toMatchObject({
      status: 'failed',
      error,
    });
    expect(failedState.reasoning[getAgentEntityKey('failed', 'rf')]).toMatchObject({
      status: 'failed',
      redacted: true,
      error,
    });
    expect(failedState.toolCalls[getAgentEntityKey('failed', 'tf')]).toMatchObject({
      status: 'failed',
      error,
    });
    expect(failedState.tasks[getAgentEntityKey('failed', 'taskf')]).toMatchObject({
      status: 'failed',
      error,
    });
    expect(failedState.artifacts[getAgentEntityKey('failed', 'af')]).toMatchObject({
      status: 'failed',
      error,
    });
    expect(failedState.runs.failed).toMatchObject({ status: 'failed', error });

    const cancelled = createAgentEventFactory({ sessionId: 's', runId: 'cancelled' });
    const cancelledState = replayAgentEvents([
      cancelled.create('run.started', {}),
      cancelled.create('message.started', { messageId: 'mc', role: 'assistant' }),
      cancelled.create('message.cancelled', { messageId: 'mc', reason: 'stop' }),
      cancelled.create('reasoning.started', { reasoningId: 'rc' }),
      cancelled.create('reasoning.cancelled', { reasoningId: 'rc', reason: 'stop' }),
      cancelled.create('tool.requested', { toolCallId: 'tc', name: 'tool' }),
      cancelled.create('tool.cancelled', { toolCallId: 'tc', reason: 'stop' }),
      cancelled.create('task.created', { taskId: 'taskc', title: 'Task' }),
      cancelled.create('task.cancelled', { taskId: 'taskc', reason: 'stop' }),
      cancelled.create('run.cancelled', { reason: 'stop' }),
    ]);

    expect(cancelledState.messages[getAgentEntityKey('cancelled', 'mc')]).toMatchObject({
      status: 'cancelled',
      reason: 'stop',
    });
    expect(cancelledState.reasoning[getAgentEntityKey('cancelled', 'rc')]).toMatchObject({
      status: 'cancelled',
      reason: 'stop',
    });
    expect(cancelledState.toolCalls[getAgentEntityKey('cancelled', 'tc')]).toMatchObject({
      status: 'cancelled',
      reason: 'stop',
    });
    expect(cancelledState.tasks[getAgentEntityKey('cancelled', 'taskc')]).toMatchObject({
      status: 'cancelled',
      reason: 'stop',
    });
    expect(cancelledState.runs.cancelled).toMatchObject({ status: 'cancelled', reason: 'stop' });
  });

  it('records duplicate and terminal entity transitions', () => {
    const events = createAgentEventFactory({ sessionId: 's', runId: 'r' });
    const error = { message: 'failed' };
    const sequence = [
      events.create('session.started', { title: 'Session' }),
      events.create('session.started', {}),
      events.create('run.started', {}),
      events.create('run.started', {}),
      events.create('message.started', { messageId: 'm', role: 'assistant' }),
      events.create('message.started', { messageId: 'm', role: 'assistant' }),
      events.create('message.completed', { messageId: 'm', content: 'final' }),
      events.create('message.failed', { messageId: 'm', error }),
      events.create('reasoning.started', { reasoningId: 'reason' }),
      events.create('reasoning.started', { reasoningId: 'reason' }),
      events.create('reasoning.completed', { reasoningId: 'reason', content: 'final' }),
      events.create('reasoning.delta', { reasoningId: 'reason', delta: 'late' }),
      events.create('tool.requested', { toolCallId: 'tool', name: 'tool' }),
      events.create('tool.requested', { toolCallId: 'tool', name: 'tool' }),
      events.create('tool.completed', { toolCallId: 'tool' }),
      events.create('tool.running', { toolCallId: 'tool' }),
      events.create('approval.requested', { approvalId: 'approval', data: 'original' }),
      events.create('approval.requested', { approvalId: 'approval' }),
      events.create('approval.resolved', { approvalId: 'approval', decision: 'modified' }),
      events.create('approval.resolved', { approvalId: 'approval', decision: 'approved' }),
      events.create('task.created', { taskId: 'task', title: 'Task' }),
      events.create('task.created', { taskId: 'task', title: 'Task' }),
      events.create('task.completed', { taskId: 'task' }),
      events.create('task.updated', { taskId: 'task', progress: 100 }),
      events.create('artifact.created', { artifactId: 'artifact', name: 'file' }),
      events.create('artifact.created', { artifactId: 'artifact', name: 'file' }),
      events.create('artifact.completed', { artifactId: 'artifact', content: 'final' }),
      events.create('artifact.updated', { artifactId: 'artifact', content: 'late' }),
    ];
    const state = replayAgentEvents(sequence);

    expect(state.issues.filter(({ code }) => code === 'duplicate_entity')).toHaveLength(8);
    expect(state.issues.filter(({ code }) => code === 'invalid_transition')).toHaveLength(6);
    expect(state.messages[getAgentEntityKey('r', 'm')].content).toBe('final');
    expect(state.approvals[getAgentEntityKey('r', 'approval')].data).toBe('original');
  });

  it('records missing runs and entities for every lifecycle family', () => {
    const noRun = createAgentEventFactory({ sessionId: 's', runId: 'missing-run' });
    const withoutRun = replayAgentEvents([
      noRun.create('run.completed', {}),
      noRun.create('message.started', { messageId: 'm', role: 'assistant' }),
      noRun.create('reasoning.started', { reasoningId: 'r' }),
      noRun.create('tool.requested', { toolCallId: 'tool', name: 'tool' }),
      noRun.create('approval.requested', { approvalId: 'approval' }),
      noRun.create('task.created', { taskId: 'task', title: 'Task' }),
      noRun.create('artifact.created', { artifactId: 'artifact', name: 'file' }),
    ]);
    expect(withoutRun.issues.every(({ code }) => code === 'missing_run')).toBe(true);

    const missing = createAgentEventFactory({ sessionId: 's', runId: 'r' });
    const missingEntities = replayAgentEvents([
      missing.create('run.started', {}),
      missing.create('reasoning.delta', { reasoningId: 'missing', delta: 'x' }),
      missing.create('tool.running', { toolCallId: 'missing' }),
      missing.create('approval.resolved', { approvalId: 'missing', decision: 'rejected' }),
      missing.create('task.updated', { taskId: 'missing' }),
      missing.create('artifact.updated', { artifactId: 'missing', content: 'x' }),
    ]);
    expect(missingEntities.issues.every(({ code }) => code === 'missing_entity')).toBe(true);
  });
});
