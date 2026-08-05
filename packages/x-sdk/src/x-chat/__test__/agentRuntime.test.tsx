import React from 'react';
import { act, render, renderHook } from '../../../tests/utils';
import type {
  AgentCommand,
  AgentCommandType,
  AgentEvent,
  AgentEventFactory,
  AgentState,
} from '../../agent';
import {
  AGENT_EVENT_PROTOCOL,
  AGENT_EVENT_PROTOCOL_VERSION,
  createAgentEventFactory,
  createInitialAgentState,
  getAgentEntityKey,
} from '../../agent';
import type { AgentCommandOptions, AgentProvider } from '../../chat-providers';
import { projectAgentMessages, useAgentChatRuntime } from '../agentRuntime';
import useXChat from '../index';

interface FixtureContext {
  events: AgentEventFactory;
}

interface ProviderOptions {
  commands?: readonly AgentCommandType[];
  start?: (input: string, context: FixtureContext) => readonly AgentEvent[];
  executeCommand?: (
    command: AgentCommand,
    options: AgentCommandOptions,
  ) => AsyncIterable<AgentEvent>;
}

const eventTypes = [
  'run.started',
  'run.cancelled',
  'message.started',
  'message.completed',
  'approval.requested',
  'approval.resolved',
  'tool.requested',
  'tool.running',
  'tool.completed',
  'tool.failed',
  'task.created',
  'task.cancelled',
] as const;

function createProvider(
  options: ProviderOptions = {},
): AgentProvider<string, string, never, FixtureContext> {
  const provider: AgentProvider<string, string, never, FixtureContext> = {
    id: 'interaction-provider',
    protocol: { name: AGENT_EVENT_PROTOCOL, version: AGENT_EVENT_PROTOCOL_VERSION },
    capabilities: {
      eventTypes,
      transports: ['test.pending'],
      commands: options.commands ?? ['approval.resolve', 'tool.retry', 'run.cancel'],
    },
    transport: {
      kind: 'test.pending',
      open() {
        return {
          [Symbol.asyncIterator]() {
            return { next: () => new Promise<IteratorResult<never>>(() => {}) };
          },
        };
      },
    },
    createContext({ events }) {
      return { events };
    },
    start(input, context) {
      return options.start?.(input, context) ?? [context.events.create('run.started', { input })];
    },
    prepareRequest(input) {
      return input;
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
  };
  if (options.executeCommand) provider.executeCommand = options.executeCommand;
  return provider;
}

const createCommandEvents = (command: AgentCommand, options: AgentCommandOptions) =>
  createAgentEventFactory({
    sessionId: command.sessionId,
    runId: command.runId,
    initialSequence: options.initialSequence,
    now: () => 10,
  });

async function flush() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

async function startRun(result: React.RefObject<any>, input = 'start') {
  act(() => result.current.onRequest(input));
  await flush();
  const runIds = Object.keys(result.current.agentState.runs);
  return runIds[runIds.length - 1];
}

const getLatestCommand = (result: React.RefObject<any>) => {
  const commands = Object.values(result.current.commandStates);
  return commands[commands.length - 1];
};

describe('useAgentChatRuntime', () => {
  it('resolves approvals, retries tools and cancels a running task', async () => {
    const provider = createProvider({
      start(input, { events }) {
        return [
          events.create('run.started', { input }),
          events.create('approval.requested', {
            approvalId: 'approval-1',
            editable: true,
            version: 1,
          }),
          events.create('tool.requested', { toolCallId: 'tool-1', name: 'search' }),
          events.create('tool.failed', {
            toolCallId: 'tool-1',
            error: { message: 'timeout', retryable: true },
          }),
          events.create('task.created', { taskId: 'task-1', title: 'Long task' }),
        ];
      },
      async *executeCommand(command, commandOptions) {
        const events = createCommandEvents(command, commandOptions);
        if (command.type === 'approval.resolve') {
          yield events.create('approval.resolved', {
            approvalId: command.payload.approvalId,
            decision: command.payload.decision,
            data: command.payload.data,
          });
        } else if (command.type === 'tool.retry') {
          yield events.create('tool.requested', {
            toolCallId: 'tool-2',
            name: 'search',
            attempt: 2,
            retryOf: command.payload.toolCallId,
          });
          yield events.create('tool.running', { toolCallId: 'tool-2' });
          yield events.create('tool.completed', { toolCallId: 'tool-2', result: 'ok' });
        } else {
          yield events.create('task.cancelled', {
            taskId: 'task-1',
            reason: command.payload.reason,
          });
          yield events.create('run.cancelled', { reason: command.payload.reason });
        }
      },
    });
    const conversationKey = 'agent-runtime-success';
    const { result } = renderHook(() => useXChat({ provider, conversationKey }));
    const runId = await startRun(result);

    let approvalResult: any;
    await act(async () => {
      approvalResult = await result.current!.agentActions.resolveApproval({
        runId,
        approvalId: 'approval-1',
        decision: 'approved',
        data: { approvedBy: 'user' },
        expectedVersion: 1,
      });
    });
    expect(approvalResult).toEqual({
      commandId: expect.any(String),
      idempotencyKey: expect.any(String),
    });
    expect(
      result.current!.agentState.approvals[getAgentEntityKey(runId, 'approval-1')],
    ).toMatchObject({ status: 'completed', decision: 'approved', data: { approvedBy: 'user' } });
    expect(Object.values(result.current!.commandStates)[0]).toMatchObject({ status: 'succeeded' });

    await act(async () => {
      await result.current!.agentActions.retryTool({ runId, toolCallId: 'tool-1' });
    });
    expect(result.current!.agentState.toolCalls[getAgentEntityKey(runId, 'tool-2')]).toMatchObject({
      status: 'completed',
      attempt: 2,
      retryOf: 'tool-1',
      result: 'ok',
    });
    expect(Object.values(result.current!.commandStates)).toHaveLength(2);

    await act(async () => {
      await result.current!.agentActions.cancelRun({ runId, reason: 'user cancelled' });
    });
    expect(result.current!.agentState.runs[runId]).toMatchObject({
      status: 'cancelled',
      reason: 'user cancelled',
    });
    expect(result.current!.agentState.tasks[getAgentEntityKey(runId, 'task-1')]).toMatchObject({
      status: 'cancelled',
    });
    expect(result.current!.commandStates).toEqual({});
    expect(result.current!.isRequesting).toBe(false);
  });

  it('validates entity state before creating commands', async () => {
    const provider = createProvider({
      start(input, { events }) {
        return [
          events.create('run.started', { input }),
          events.create('approval.requested', {
            approvalId: 'approval-1',
            editable: false,
            expiresAt: 1,
            version: 1,
          }),
          events.create('tool.requested', { toolCallId: 'pending-tool', name: 'pending' }),
          events.create('tool.requested', { toolCallId: 'fixed-tool', name: 'fixed' }),
          events.create('tool.failed', {
            toolCallId: 'fixed-tool',
            error: { message: 'fixed', retryable: false },
          }),
        ];
      },
      async *executeCommand() {},
    });
    const conversationKey = 'agent-runtime-validation';
    const { result } = renderHook(() => useXChat({ provider, conversationKey }));
    const runId = await startRun(result);
    const actions = result.current!.agentActions;

    expect(() =>
      actions.resolveApproval({
        runId,
        approvalId: 'missing',
        decision: 'approved',
      }),
    ).toThrow('is not waiting');
    expect(() =>
      actions.resolveApproval({
        runId,
        approvalId: 'approval-1',
        decision: 'modified',
      }),
    ).toThrow('is not editable');
    expect(() =>
      actions.resolveApproval({
        runId,
        approvalId: 'approval-1',
        decision: 'approved',
        expectedVersion: 2,
      }),
    ).toThrow('version does not match');
    expect(() =>
      actions.resolveApproval({
        runId,
        approvalId: 'approval-1',
        decision: 'approved',
        expectedVersion: 1,
      }),
    ).toThrow('has expired');
    expect(() => actions.retryTool({ runId, toolCallId: 'missing' })).toThrow('is not failed');
    expect(() => actions.retryTool({ runId, toolCallId: 'pending-tool' })).toThrow('is not failed');
    expect(() => actions.retryTool({ runId, toolCallId: 'fixed-tool' })).toThrow(
      'is not retryable',
    );
    expect(() => actions.cancelRun({ runId: 'missing' })).toThrow(
      'does not exist in the active session',
    );
  });

  it('rejects unsupported and duplicate actions', async () => {
    const unsupported = createProvider({ commands: [], async *executeCommand() {} });
    const unsupportedKey = 'agent-runtime-unsupported';
    const unsupportedResult = renderHook(() =>
      useXChat({ provider: unsupported, conversationKey: unsupportedKey }),
    ).result;
    const unsupportedRun = await startRun(unsupportedResult);
    expect(() =>
      unsupportedResult.current!.agentActions.cancelRun({ runId: unsupportedRun }),
    ).toThrow('does not support command "run.cancel"');

    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const pending = createProvider({
      start(input, { events }) {
        return [
          events.create('run.started', { input }),
          events.create('approval.requested', { approvalId: 'approval-1' }),
          events.create('tool.requested', { toolCallId: 'tool-1', name: 'search' }),
          events.create('tool.failed', {
            toolCallId: 'tool-1',
            error: { message: 'timeout', retryable: true },
          }),
        ];
      },
      async *executeCommand(command, commandOptions) {
        await gate;
        const events = createCommandEvents(command, commandOptions);
        if (command.type === 'run.cancel') return;
        yield events.create('approval.resolved', {
          approvalId: 'approval-1',
          decision: 'approved',
        });
      },
    });
    const pendingKey = 'agent-runtime-pending';
    const pendingResult = renderHook(() =>
      useXChat({ provider: pending, conversationKey: pendingKey }),
    ).result;
    const pendingRun = await startRun(pendingResult);
    let first!: Promise<any>;
    act(() => {
      first = pendingResult.current!.agentActions.resolveApproval({
        runId: pendingRun,
        approvalId: 'approval-1',
        decision: 'approved',
      });
    });
    expect(() =>
      pendingResult.current!.agentActions.resolveApproval({
        runId: pendingRun,
        approvalId: 'approval-1',
        decision: 'approved',
      }),
    ).toThrow('has already been submitted');
    release();
    await act(async () => first);

    await act(async () => {
      await pendingResult.current!.agentActions.cancelRun({ runId: pendingRun });
    });
    expect(() => pendingResult.current!.agentActions.cancelRun({ runId: pendingRun })).toThrow(
      'has already been submitted',
    );
    expect(() =>
      pendingResult.current!.agentActions.retryTool({ runId: pendingRun, toolCallId: 'tool-1' }),
    ).toThrow('cancellation has already been submitted');
  });

  it('records provider, runner and protocol failures on command state', async () => {
    let mode: 'provider' | 'runner' | 'protocol' = 'provider';
    const provider = createProvider({
      start(input, { events }) {
        return [
          events.create('run.started', { input }),
          events.create('approval.requested', { approvalId: 'approval-1' }),
          events.create('tool.requested', { toolCallId: 'tool-1', name: 'search' }),
          events.create('tool.failed', {
            toolCallId: 'tool-1',
            error: { message: 'timeout', retryable: true },
          }),
        ];
      },
      async *executeCommand(command, commandOptions) {
        if (mode === 'provider') throw { message: 'offline', retryable: true };
        const events = createCommandEvents(command, commandOptions);
        if (mode === 'runner') {
          yield events.create(
            'approval.resolved',
            { approvalId: 'approval-1', decision: 'approved' },
            { sequence: commandOptions.initialSequence },
          );
          return;
        }
        yield events.create('approval.resolved', {
          approvalId: 'missing-approval',
          decision: 'approved',
        });
      },
    });
    const conversationKey = 'agent-runtime-errors';
    const { result } = renderHook(() => useXChat({ provider, conversationKey }));
    const runId = await startRun(result);

    let caught: unknown;
    await act(async () => {
      try {
        await result.current!.agentActions.resolveApproval({
          runId,
          approvalId: 'approval-1',
          decision: 'approved',
        });
      } catch (error) {
        caught = error;
      }
    });
    expect(caught).toEqual({ message: 'offline', retryable: true });
    expect(getLatestCommand(result)).toMatchObject({
      status: 'failed',
      error: { code: 'provider_error', retryable: true },
    });

    mode = 'runner';
    await act(async () => {
      try {
        await result.current!.agentActions.retryTool({ runId, toolCallId: 'tool-1' });
      } catch (error) {
        caught = error;
      }
    });
    expect(caught).toMatchObject({ code: 'protocol_error' });
    expect(getLatestCommand(result)).toMatchObject({
      error: { code: 'protocol_error', retryable: false },
    });

    mode = 'protocol';
    await act(async () => {
      try {
        await result.current!.agentActions.retryTool({ runId, toolCallId: 'tool-1' });
      } catch (error) {
        caught = error;
      }
    });
    expect(caught).toMatchObject({ name: 'AgentProtocolError' });
    expect(getLatestCommand(result)).toMatchObject({
      error: { code: 'protocol_error', retryable: false },
    });
  });

  it('continues queued commands after an earlier command fails', async () => {
    const provider = createProvider({
      start(input, { events }) {
        return [
          events.create('run.started', { input }),
          events.create('approval.requested', { approvalId: 'approval-1' }),
          events.create('tool.requested', { toolCallId: 'tool-1', name: 'search' }),
          events.create('tool.failed', {
            toolCallId: 'tool-1',
            error: { message: 'timeout', retryable: true },
          }),
        ];
      },
      async *executeCommand(command, commandOptions) {
        if (command.type === 'approval.resolve') throw new Error('approval failed');
        const events = createCommandEvents(command, commandOptions);
        yield events.create('tool.requested', {
          toolCallId: 'tool-2',
          name: 'search',
          attempt: 2,
          retryOf: 'tool-1',
        });
        yield events.create('tool.completed', { toolCallId: 'tool-2', result: 'ok' });
      },
    });
    const conversationKey = 'agent-runtime-queue-after-error';
    const { result } = renderHook(() => useXChat({ provider, conversationKey }));
    const runId = await startRun(result);
    let approval!: Promise<any>;
    let retry!: Promise<any>;

    act(() => {
      approval = result.current!.agentActions.resolveApproval({
        runId,
        approvalId: 'approval-1',
        decision: 'approved',
      });
      retry = result.current!.agentActions.retryTool({ runId, toolCallId: 'tool-1' });
    });
    let settled!: PromiseSettledResult<any>[];
    await act(async () => {
      settled = await Promise.allSettled([approval, retry]);
    });

    expect(settled.map(({ status }) => status)).toEqual(['rejected', 'fulfilled']);
    expect(result.current!.agentState.toolCalls[getAgentEntityKey(runId, 'tool-2')]).toMatchObject({
      status: 'completed',
    });
  });

  it('aborts other queued commands when a command terminates the run', async () => {
    const provider = createProvider({
      start(input, { events }) {
        return [
          events.create('run.started', { input }),
          events.create('approval.requested', { approvalId: 'approval-1' }),
          events.create('tool.requested', { toolCallId: 'tool-1', name: 'search' }),
          events.create('tool.failed', {
            toolCallId: 'tool-1',
            error: { message: 'timeout', retryable: true },
          }),
        ];
      },
      async *executeCommand(command, commandOptions) {
        const events = createCommandEvents(command, commandOptions);
        yield events.create('run.cancelled', { reason: 'runtime stopped' });
      },
    });
    const conversationKey = 'agent-runtime-terminal-queue';
    const { result } = renderHook(() => useXChat({ provider, conversationKey }));
    const runId = await startRun(result);
    let approval!: Promise<any>;
    let retry!: Promise<any>;

    act(() => {
      approval = result.current!.agentActions.resolveApproval({
        runId,
        approvalId: 'approval-1',
        decision: 'approved',
      });
      retry = result.current!.agentActions.retryTool({ runId, toolCallId: 'tool-1' });
    });
    let settled!: PromiseSettledResult<any>[];
    await act(async () => {
      settled = await Promise.allSettled([approval, retry]);
    });

    expect(settled[0].status).toBe('fulfilled');
    expect(settled[1]).toMatchObject({
      status: 'rejected',
      reason: { code: 'invalid_command', message: expect.stringContaining('already cancelled') },
    });
  });

  it('rejects command events overtaken by the active run stream', async () => {
    let releaseTransport!: () => void;
    const transportGate = new Promise<void>((resolve) => {
      releaseTransport = resolve;
    });
    let releaseCommand!: () => void;
    const commandGate = new Promise<void>((resolve) => {
      releaseCommand = resolve;
    });
    const provider = createProvider({
      start(input, { events }) {
        return [
          events.create('run.started', { input }),
          events.create('approval.requested', { approvalId: 'approval-1' }),
        ];
      },
      async *executeCommand(command, commandOptions) {
        const events = createCommandEvents(command, commandOptions);
        await commandGate;
        yield events.create('approval.resolved', {
          approvalId: 'approval-1',
          decision: 'approved',
        });
      },
    });
    provider.transport.open = () => {
      let emitted = false;
      return {
        [Symbol.asyncIterator]() {
          return {
            async next() {
              if (emitted) return new Promise<IteratorResult<never>>(() => {});
              emitted = true;
              await transportGate;
              return { done: false, value: undefined as never };
            },
          };
        },
      };
    };
    provider.transformChunk = (_chunk, context) => [
      context.events.create('task.created', { taskId: 'task-1', title: 'Concurrent task' }),
    ];
    const conversationKey = 'agent-runtime-sequence-race';
    const { result } = renderHook(() => useXChat({ provider, conversationKey }));
    const runId = await startRun(result);
    let action!: Promise<any>;
    act(() => {
      action = result.current!.agentActions.resolveApproval({
        runId,
        approvalId: 'approval-1',
        decision: 'approved',
      });
    });
    releaseTransport();
    await flush();
    releaseCommand();

    let caught: unknown;
    await act(async () => {
      try {
        await action;
      } catch (error) {
        caught = error;
      }
    });
    expect(caught).toMatchObject({
      code: 'protocol_error',
      message: expect.stringContaining('must be greater than'),
    });
  });

  it('interrupts active commands when the hook unmounts', async () => {
    const provider = createProvider({
      start(input, { events }) {
        return [
          events.create('run.started', { input }),
          events.create('approval.requested', { approvalId: 'approval-1' }),
        ];
      },
      async *executeCommand(_command, { signal }) {
        yield await new Promise<AgentEvent>((_resolve, reject) => {
          const abort = () => reject(new DOMException('Unmounted', 'AbortError'));
          if (signal.aborted) abort();
          else signal.addEventListener('abort', abort, { once: true });
        });
      },
    });
    const conversationKey = 'agent-runtime-unmount';
    let current: any;
    const Demo = () => {
      current = useXChat({ provider, conversationKey });
      return null;
    };
    const view = render(<Demo />);
    act(() => current.onRequest('start'));
    await flush();
    const runId = Object.keys(current.agentState.runs)[0];
    let action!: Promise<any>;
    act(() => {
      action = current.agentActions.resolveApproval({
        runId,
        approvalId: 'approval-1',
        decision: 'approved',
      });
    });
    const settled = action.catch((error) => error);
    view.unmount();

    await expect(settled).resolves.toMatchObject({ name: 'AbortError' });
  });

  it('guards runtime methods when no AgentProvider is configured', () => {
    const key = Symbol('no-provider');
    const { result } = renderHook(() => useAgentChatRuntime(undefined, key));
    expect(() => result.current!.onRequest('hello')).toThrow('provider is required');
    expect(() =>
      result.current!.agentActions.resolveApproval({
        runId: 'run-1',
        approvalId: 'approval-1',
        decision: 'approved',
      }),
    ).toThrow('provider is required');
    expect(() =>
      result.current!.agentActions.retryTool({ runId: 'run-1', toolCallId: 'tool-1' }),
    ).toThrow('provider is required');
    expect(() => result.current!.agentActions.cancelRun({ runId: 'run-1' })).toThrow(
      'provider is required',
    );
    expect(result.current!.abort()).toBeUndefined();
  });

  it('projects agent messages to legacy message statuses', () => {
    const base = createInitialAgentState();
    const statuses = [
      ['user', 'streaming', 'local'],
      ['assistant-completed', 'completed', 'success'],
      ['assistant-failed', 'failed', 'error'],
      ['assistant-cancelled', 'cancelled', 'abort'],
      ['assistant-streaming', 'streaming', 'updating'],
    ] as const;
    const state: AgentState = {
      ...base,
      messages: Object.fromEntries(
        statuses.map(([id, status]) => [
          getAgentEntityKey('run-1', id),
          {
            id,
            runId: 'run-1',
            role: id === 'user' ? 'user' : 'assistant',
            content: id,
            status,
            createdAt: 1,
            updatedAt: 1,
          },
        ]),
      ),
      order: [
        { kind: 'task', runId: 'run-1', id: 'task-1' },
        ...statuses.map(([id]) => ({ kind: 'message' as const, runId: 'run-1', id })),
        { kind: 'message', runId: 'run-1', id: 'missing' },
      ],
    };
    expect(projectAgentMessages(state).map(({ status }) => status)).toEqual(
      statuses.map(([, , status]) => status),
    );
  });
});
