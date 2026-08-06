import {
  AGENT_COMMAND_PROTOCOL,
  AGENT_COMMAND_PROTOCOL_VERSION,
  agentCommandTypes,
  createAgentCommandFactory,
  getAgentActionKey,
  getAgentCommandActionKey,
  getAgentCommandKey,
  isAgentCommand,
  isAgentCommandEnvelope,
} from '..';

describe('agent commands', () => {
  const factory = createAgentCommandFactory({
    sessionId: 'session-1',
    runId: 'run-1',
    now: () => 100,
    createCommandId: (type) => `command:${type}`,
    createIdempotencyKey: (commandId, type) => `${type}:${commandId}:key`,
  });

  it('creates commands with defaults and explicit envelope options', () => {
    const retry = factory.create('tool.retry', { toolCallId: 'tool-1' });
    expect(retry).toEqual({
      commandProtocol: AGENT_COMMAND_PROTOCOL,
      commandProtocolVersion: AGENT_COMMAND_PROTOCOL_VERSION,
      type: 'tool.retry',
      commandId: 'command:tool.retry',
      idempotencyKey: 'tool.retry:command:tool.retry:key',
      sessionId: 'session-1',
      runId: 'run-1',
      timestamp: 100,
      payload: { toolCallId: 'tool-1' },
    });

    const cancel = factory.create(
      'run.cancel',
      { reason: 'stop' },
      {
        commandId: 'custom-command',
        idempotencyKey: 'custom-key',
        timestamp: 200,
        meta: { source: 'test' },
      },
    );
    expect(cancel).toMatchObject({
      commandId: 'custom-command',
      idempotencyKey: 'custom-key',
      timestamp: 200,
      meta: { source: 'test' },
    });

    const defaultFactory = createAgentCommandFactory({ sessionId: 's', runId: 'r' });
    expect(defaultFactory.create('run.cancel', {}).commandId).toContain('r:command:');
  });

  it('validates every command payload and rejects malformed envelopes', () => {
    const approval = factory.create('approval.resolve', {
      approvalId: 'approval-1',
      decision: 'approved',
      expectedVersion: 1,
    });
    const modified = factory.create('approval.resolve', {
      approvalId: 'approval-1',
      decision: 'modified',
      expectedVersion: 'v2',
    });
    const retry = factory.create('tool.retry', { toolCallId: 'tool-1' });
    const cancel = factory.create('run.cancel', { reason: 'done' });

    expect(agentCommandTypes).toEqual(['approval.resolve', 'tool.retry', 'run.cancel']);
    expect([approval, modified, retry, cancel].every(isAgentCommand)).toBe(true);
    expect(isAgentCommandEnvelope({ ...approval, meta: { trace: true } })).toBe(true);

    const invalidEnvelopes = [
      null,
      [],
      { ...approval, commandProtocol: 'other' },
      { ...approval, commandProtocolVersion: '9' },
      { ...approval, type: 'unknown' },
      { ...approval, commandId: '' },
      { ...approval, idempotencyKey: '' },
      { ...approval, sessionId: '' },
      { ...approval, runId: '' },
      { ...approval, timestamp: Number.NaN },
      { ...approval, payload: [] },
      { ...approval, meta: [] },
    ];
    invalidEnvelopes.forEach((command) => {
      expect(isAgentCommandEnvelope(command)).toBe(false);
    });

    expect(isAgentCommand({ ...approval, payload: { ...approval.payload, approvalId: '' } })).toBe(
      false,
    );
    expect(
      isAgentCommand({ ...approval, payload: { ...approval.payload, decision: 'expired' } }),
    ).toBe(false);
    expect(
      isAgentCommand({ ...approval, payload: { ...approval.payload, expectedVersion: Infinity } }),
    ).toBe(false);
    expect(isAgentCommand({ ...retry, payload: { toolCallId: '' } })).toBe(false);
    expect(isAgentCommand({ ...cancel, payload: { reason: 1 } })).toBe(false);
    expect(isAgentCommand(factory.create('run.cancel', {}))).toBe(true);
  });

  it('creates collision-safe command and action keys', () => {
    const approval = factory.create('approval.resolve', {
      approvalId: 'approval-1',
      decision: 'rejected',
    });
    const retry = factory.create('tool.retry', { toolCallId: 'tool-1' });
    const cancel = factory.create('run.cancel', {});

    expect(getAgentCommandKey(approval)).toBe(approval.commandId);
    expect(getAgentActionKey({ runId: 'run-1', type: 'run.cancel' })).toBe('5:run-1:run.cancel:');
    expect(getAgentCommandActionKey(approval)).toBe('5:run-1:approval.resolve:approval-1');
    expect(getAgentCommandActionKey(retry)).toBe('5:run-1:tool.retry:tool-1');
    expect(getAgentCommandActionKey(cancel)).toBe('5:run-1:run.cancel:');
  });
});
