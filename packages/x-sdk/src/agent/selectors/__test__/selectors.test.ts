import { createAgentEventFactory } from '../../protocol';
import { createInitialAgentState, getAgentEntityKey, reduceAgentState } from '../../reducer';
import {
  selectAgentTimeline,
  selectApproval,
  selectRun,
  selectRunningRuns,
  selectToolCall,
} from '..';

describe('agent selectors', () => {
  function createState() {
    const first = createAgentEventFactory({ sessionId: 'session-1', runId: 'run-1', now: () => 1 });
    const second = createAgentEventFactory({
      sessionId: 'session-1',
      runId: 'run-2',
      now: () => 2,
    });
    const events = [
      first.create('run.started', {}),
      first.create('message.started', { messageId: 'message-1', role: 'assistant', content: 'Hi' }),
      first.create('reasoning.started', { reasoningId: 'reasoning-1', redacted: true }),
      first.create('reasoning.delta', { reasoningId: 'reasoning-1', delta: 'secret' }),
      first.create('tool.requested', { toolCallId: 'tool-1', name: 'search' }),
      first.create('approval.requested', { approvalId: 'approval-1', description: 'Approve' }),
      second.create('run.started', {}),
      second.create('message.started', { messageId: 'message-2', role: 'user', content: 'Other' }),
    ];
    return events.reduce(reduceAgentState, createInitialAgentState());
  }

  it('selects entities and memoizes running runs by session', () => {
    const state = createState();
    expect(selectRun(state, 'run-1')).toMatchObject({ id: 'run-1', status: 'running' });
    expect(selectRun(state, 'missing')).toBeUndefined();
    expect(selectToolCall(state, { runId: 'run-1', toolCallId: 'tool-1' })).toMatchObject({
      name: 'search',
    });
    expect(selectApproval(state, { runId: 'run-1', approvalId: 'approval-1' })).toMatchObject({
      status: 'waiting',
    });

    const first = selectRunningRuns(state, 'session-1');
    expect(first.map(({ id }) => id)).toEqual(['run-1', 'run-2']);
    expect(selectRunningRuns(state, 'session-1')).toBe(first);
    expect(selectRunningRuns(state, 'other')).toEqual([]);
  });

  it('builds a stable timeline, filters runs and redacts reasoning content', () => {
    const state = createState();
    const timeline = selectAgentTimeline(state, { runId: 'run-1' });

    expect(timeline.map(({ kind }) => kind)).toEqual(['message', 'reasoning', 'tool', 'approval']);
    expect(timeline[1]).toMatchObject({
      kind: 'reasoning',
      entity: { content: '', redacted: true },
    });
    expect(selectAgentTimeline(state, { runId: 'run-1' })).toBe(timeline);
    expect(
      selectAgentTimeline(state, { runId: 'run-1', includeReasoning: false }).map(
        ({ kind }) => kind,
      ),
    ).toEqual(['message', 'tool', 'approval']);
    expect(selectAgentTimeline(state, { runId: 'run-2' }).map(({ kind }) => kind)).toEqual([
      'message',
    ]);
  });

  it('ignores stale and unsupported order references', () => {
    const state = createState();
    const withStaleOrder = {
      ...state,
      order: [
        ...state.order,
        { kind: 'message' as const, runId: 'run-1', id: 'missing-message' },
        { kind: 'reasoning' as const, runId: 'run-1', id: 'missing-reasoning' },
        { kind: 'tool' as const, runId: 'run-1', id: 'missing-tool' },
        { kind: 'approval' as const, runId: 'run-1', id: 'missing-approval' },
        { kind: 'task' as const, runId: 'run-1', id: 'missing-task' },
      ],
    };
    expect(selectAgentTimeline(withStaleOrder, { runId: 'run-1' })).toHaveLength(4);
    expect(withStaleOrder.messages[getAgentEntityKey('run-1', 'missing-message')]).toBeUndefined();
  });
});
