import { createAgentCommandFactory, getAgentCommandActionKey } from '../../agent';
import { createAgentCommandStore } from '../agentCommandStore';

describe('createAgentCommandStore', () => {
  const factory = createAgentCommandFactory({
    sessionId: 'session-1',
    runId: 'run-1',
    now: () => 10,
  });

  it('tracks command lifecycle and notifies subscribers', () => {
    const store = createAgentCommandStore();
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    const command = factory.create('tool.retry', { toolCallId: 'tool-1' });

    expect(store.start(command)).toMatchObject({
      command,
      key: command.commandId,
      status: 'submitting',
      createdAt: 10,
      updatedAt: 10,
    });
    expect(store.getSnapshot().latestCommandByAction[getAgentCommandActionKey(command)]).toBe(
      command.commandId,
    );

    store.succeed(command.commandId, 20);
    expect(store.getSnapshot().commandStates[command.commandId]).toMatchObject({
      status: 'succeeded',
      updatedAt: 20,
    });

    const error = { code: 'provider_error' as const, message: 'failed', retryable: true };
    store.fail(command.commandId, error, 30);
    expect(store.getSnapshot().commandStates[command.commandId]).toMatchObject({
      status: 'failed',
      error,
      updatedAt: 30,
    });
    expect(listener).toHaveBeenCalledTimes(3);

    unsubscribe();
    store.succeed(command.commandId, 40);
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('ignores unknown commands and uses the current time by default', () => {
    const store = createAgentCommandStore();
    const listener = jest.fn();
    store.subscribe(listener);
    const now = jest.spyOn(Date, 'now').mockReturnValue(50);
    const command = factory.create('run.cancel', {});

    store.succeed('missing');
    store.fail('missing', { code: 'provider_error', message: 'missing', retryable: false });
    expect(listener).not.toHaveBeenCalled();

    store.start(command);
    store.succeed(command.commandId);
    expect(store.getSnapshot().commandStates[command.commandId].updatedAt).toBe(50);
    now.mockRestore();
  });

  it('clears one run while optionally retaining submitting commands', () => {
    const store = createAgentCommandStore();
    const otherFactory = createAgentCommandFactory({
      sessionId: 'session-1',
      runId: 'run-2',
      now: () => 10,
    });
    const submitting = factory.create('approval.resolve', {
      approvalId: 'approval-1',
      decision: 'approved',
    });
    const completed = factory.create('tool.retry', { toolCallId: 'tool-1' });
    const otherRun = otherFactory.create('run.cancel', {});
    const listener = jest.fn();
    store.subscribe(listener);

    store.start(submitting);
    store.start(completed);
    store.succeed(completed.commandId, 20);
    store.start(otherRun);
    store.clearRun('run-1', true);

    expect(Object.keys(store.getSnapshot().commandStates)).toEqual([
      submitting.commandId,
      otherRun.commandId,
    ]);
    expect(store.getSnapshot().latestCommandByAction).toEqual({
      [getAgentCommandActionKey(submitting)]: submitting.commandId,
      [getAgentCommandActionKey(otherRun)]: otherRun.commandId,
    });

    const calls = listener.mock.calls.length;
    store.clearRun('missing');
    expect(listener).toHaveBeenCalledTimes(calls);
    store.clearRun('run-1');
    expect(Object.values(store.getSnapshot().commandStates)).toHaveLength(1);
  });
});
