import { useEvent } from '@rc-component/util';
import { useEffect, useState, useSyncExternalStore } from 'react';
import type {
  AgentCommand,
  AgentCommandDecision,
  AgentCommandFactory,
  AgentEvent,
  AgentMessageState,
  AgentState,
  AgentStore,
} from '../agent';
import {
  AgentProtocolError,
  createAgentCommandFactory,
  createAgentStore,
  getAgentActionKey,
  getAgentEntityKey,
} from '../agent';
import type { AgentProvider } from '../chat-providers';
import { AgentCommandRunnerError, runAgentCommand, runAgentProvider } from '../chat-providers';
import type { MessageInfo, MessageStatus } from '.';
import type { AgentCommandError, AgentCommandStore } from './agentCommandStore';
import { createAgentCommandStore } from './agentCommandStore';
import type { ConversationKey } from './store';

export interface AgentActionResult {
  commandId: string;
  idempotencyKey: string;
}

export interface ResolveApprovalInput {
  runId: string;
  approvalId: string;
  decision: AgentCommandDecision;
  data?: unknown;
  expectedVersion?: string | number;
}

export interface AgentActions {
  resolveApproval(input: ResolveApprovalInput): Promise<AgentActionResult>;
  retryTool(input: { runId: string; toolCallId: string }): Promise<AgentActionResult>;
  cancelRun(input: { runId: string; reason?: string }): Promise<AgentActionResult>;
}

interface AgentSession {
  id: string;
  store: AgentStore;
  commandStore: AgentCommandStore;
  commandFactories: Map<string, AgentCommandFactory>;
  commandTails: Map<string, Promise<void>>;
  commandControllers: Map<string, AbortController>;
  runControllers: Map<string, AbortController>;
  latestRunId?: string;
}

const agentSessions = new Map<ConversationKey, AgentSession>();
let nextSessionId = 0;
let nextRunId = 0;

const getAgentSession = (conversationKey: ConversationKey) => {
  let session = agentSessions.get(conversationKey);
  if (!session) {
    nextSessionId += 1;
    session = {
      id:
        typeof conversationKey === 'symbol' ? `session_${nextSessionId}` : String(conversationKey),
      store: createAgentStore(),
      commandStore: createAgentCommandStore(),
      commandFactories: new Map(),
      commandTails: new Map(),
      commandControllers: new Map(),
      runControllers: new Map(),
    };
    agentSessions.set(conversationKey, session);
  }
  return session;
};

const toMessageStatus = (message: AgentMessageState): MessageStatus => {
  if (message.status === 'failed') return 'error';
  if (message.status === 'cancelled') return 'abort';
  if (message.role === 'user') return 'local';
  if (message.status === 'completed') return 'success';
  return 'updating';
};

export const projectAgentMessages = (state: AgentState): MessageInfo<AgentMessageState>[] =>
  state.order.flatMap((reference) => {
    if (reference.kind !== 'message') return [];
    const message = state.messages[getAgentEntityKey(reference.runId, reference.id)];
    if (!message) return [];
    return [
      {
        id: getAgentEntityKey(reference.runId, reference.id),
        message,
        status: toMessageStatus(message),
      },
    ];
  });

const assertRunningRun = (state: AgentState, sessionId: string, runId: string) => {
  const run = state.runs[runId];
  if (!run || run.sessionId !== sessionId) {
    throw new AgentCommandRunnerError(
      'invalid_command',
      `Run "${runId}" does not exist in the active session.`,
    );
  }
  if (run.status !== 'running') {
    throw new AgentCommandRunnerError(
      'invalid_command',
      `Run "${runId}" is already ${run.status}.`,
    );
  }
  return run;
};

const assertCommandCapability = (
  provider: AgentProvider<any, any, any, any>,
  type: AgentCommand['type'],
) => {
  if (!provider.capabilities.commands?.includes(type) || !provider.executeCommand) {
    throw new AgentCommandRunnerError(
      'unsupported_capability',
      `Provider "${provider.id}" does not support command "${type}".`,
    );
  }
};

const assertActionAvailable = (
  session: AgentSession,
  options: { runId: string; type: AgentCommand['type']; entityId?: string },
) => {
  const snapshot = session.commandStore.getSnapshot();
  const actionKey = getAgentActionKey(options);
  const latestCommandId = snapshot.latestCommandByAction[actionKey];
  const latestCommand = latestCommandId ? snapshot.commandStates[latestCommandId] : undefined;
  if (
    latestCommand?.status === 'submitting' ||
    (options.type === 'run.cancel' && latestCommand?.status === 'succeeded')
  ) {
    throw new Error(`Command action "${actionKey}" has already been submitted.`);
  }

  if (options.type !== 'run.cancel') {
    const cancelKey = getAgentActionKey({ runId: options.runId, type: 'run.cancel' });
    const cancelCommandId = snapshot.latestCommandByAction[cancelKey];
    const cancelCommand = cancelCommandId ? snapshot.commandStates[cancelCommandId] : undefined;
    if (cancelCommand && cancelCommand.status !== 'failed') {
      throw new Error(`Run "${options.runId}" cancellation has already been submitted.`);
    }
  }
};

const isAbortError = (error: unknown) =>
  error instanceof DOMException
    ? error.name === 'AbortError'
    : error instanceof Error && error.name === 'AbortError';

const toCommandError = (error: unknown): AgentCommandError => {
  if (error instanceof AgentCommandRunnerError) {
    return {
      code: error.code,
      message: error.message,
      retryable: false,
      cause: error,
    };
  }
  if (error instanceof AgentProtocolError) {
    return {
      code: 'protocol_error',
      message: error.message,
      retryable: false,
      cause: error,
    };
  }
  if (isAbortError(error)) {
    return {
      code: 'interrupted',
      message: error instanceof Error ? error.message : 'Agent command was interrupted.',
      retryable: true,
      cause: error,
    };
  }
  const retryable =
    error &&
    typeof error === 'object' &&
    'retryable' in error &&
    typeof error.retryable === 'boolean'
      ? error.retryable
      : false;
  return {
    code: 'provider_error',
    message: error instanceof Error ? error.message : String(error),
    retryable,
    cause: error,
  };
};

const getCommandFactory = (session: AgentSession, runId: string) => {
  let factory = session.commandFactories.get(runId);
  if (!factory) {
    factory = createAgentCommandFactory({ sessionId: session.id, runId });
    session.commandFactories.set(runId, factory);
  }
  return factory;
};

export function useAgentChatRuntime(
  provider: AgentProvider<any, any, any, any> | undefined,
  conversationKey: ConversationKey,
) {
  const [session, setSession] = useState(() => getAgentSession(conversationKey));

  useEffect(() => {
    setSession(getAgentSession(conversationKey));
  }, [conversationKey]);

  useEffect(
    () => () => {
      session.runControllers.forEach((controller) => {
        controller.abort();
      });
      session.commandControllers.forEach((controller) => {
        controller.abort();
      });
    },
    [session],
  );

  const agentState = useSyncExternalStore(
    session.store.subscribe,
    session.store.getSnapshot,
    session.store.getSnapshot,
  );
  const commandSnapshot = useSyncExternalStore(
    session.commandStore.subscribe,
    session.commandStore.getSnapshot,
    session.commandStore.getSnapshot,
  );

  const dispatchEvent = (event: AgentEvent, sourceCommandId?: string) => {
    const state = session.store.dispatch(event);
    if (
      event.type === 'run.completed' ||
      event.type === 'run.failed' ||
      event.type === 'run.cancelled'
    ) {
      session.runControllers.get(event.runId)?.abort();
      const commandStates = session.commandStore.getSnapshot().commandStates;
      session.commandControllers.forEach((controller, commandId) => {
        if (
          commandId !== sourceCommandId &&
          commandStates[commandId]?.command.runId === event.runId
        ) {
          controller.abort();
        }
      });
      session.commandStore.clearRun(event.runId, true);
    }
    return state;
  };

  const dispatchCommandEvent = (event: AgentEvent, commandId: string) => {
    const before = session.store.getSnapshot();
    const lastSequence = before.lastSequenceByRun[event.runId];
    if (lastSequence !== undefined && event.sequence <= lastSequence) {
      throw new AgentCommandRunnerError(
        'protocol_error',
        `Command event sequence ${event.sequence} must be greater than ${lastSequence}.`,
      );
    }
    const next = dispatchEvent(event, commandId);
    if (next.issues.length > before.issues.length) {
      throw new AgentProtocolError(next.issues[next.issues.length - 1]);
    }
  };

  const onRequest = useEvent((input: unknown) => {
    if (!provider) throw new Error('provider is required');

    const controller = new AbortController();
    nextRunId += 1;
    const runId = `run_${nextRunId}`;
    session.latestRunId = runId;
    session.runControllers.set(runId, controller);

    return runAgentProvider({
      provider,
      input,
      run: {
        sessionId: session.id,
        runId,
        signal: controller.signal,
      },
      onEvent: dispatchEvent,
    }).finally(() => {
      if (session.runControllers.get(runId) === controller) {
        session.runControllers.delete(runId);
      }
    });
  });

  const executeCommand = useEvent(async (command: AgentCommand): Promise<AgentActionResult> => {
    if (!provider) throw new Error('provider is required');
    session.commandStore.start(command);
    const controller = new AbortController();
    session.commandControllers.set(command.commandId, controller);

    const previous = session.commandTails.get(command.runId) ?? Promise.resolve();
    const execution = previous
      .catch(() => undefined)
      .then(() => {
        assertRunningRun(session.store.getSnapshot(), session.id, command.runId);
        assertCommandCapability(provider, command.type);
        const initialSequence = session.store.getSnapshot().lastSequenceByRun[command.runId] ?? -1;
        return runAgentCommand({
          provider,
          command,
          signal: controller.signal,
          initialSequence,
          onEvent: (event) => dispatchCommandEvent(event, command.commandId),
        });
      });
    session.commandTails.set(command.runId, execution);

    try {
      await execution;
      session.commandStore.succeed(command.commandId);
      return {
        commandId: command.commandId,
        idempotencyKey: command.idempotencyKey,
      };
    } catch (error) {
      session.commandStore.fail(command.commandId, toCommandError(error));
      throw error;
    } finally {
      if (session.commandControllers.get(command.commandId) === controller) {
        session.commandControllers.delete(command.commandId);
      }
      if (session.commandTails.get(command.runId) === execution) {
        session.commandTails.delete(command.runId);
      }
      if (session.store.getSnapshot().runs[command.runId]?.status !== 'running') {
        session.commandStore.clearRun(command.runId);
      }
    }
  });

  const resolveApproval = useEvent((input: ResolveApprovalInput) => {
    if (!provider) throw new Error('provider is required');
    const state = session.store.getSnapshot();
    assertRunningRun(state, session.id, input.runId);
    assertCommandCapability(provider, 'approval.resolve');
    assertActionAvailable(session, {
      runId: input.runId,
      type: 'approval.resolve',
      entityId: input.approvalId,
    });
    const approval = state.approvals[getAgentEntityKey(input.runId, input.approvalId)];
    if (approval?.status !== 'waiting') {
      throw new Error(`Approval "${input.approvalId}" is not waiting in run "${input.runId}".`);
    }
    if (input.decision === 'modified' && approval.editable === false) {
      throw new Error(`Approval "${input.approvalId}" is not editable.`);
    }
    if (input.expectedVersion !== undefined && input.expectedVersion !== approval.version) {
      throw new Error(`Approval "${input.approvalId}" version does not match.`);
    }
    if (approval.expiresAt !== undefined && approval.expiresAt <= Date.now()) {
      throw new Error(`Approval "${input.approvalId}" has expired.`);
    }
    const command = getCommandFactory(session, input.runId).create('approval.resolve', {
      approvalId: input.approvalId,
      decision: input.decision,
      data: input.data,
      expectedVersion: input.expectedVersion,
    });
    return executeCommand(command);
  });

  const retryTool = useEvent((input: { runId: string; toolCallId: string }) => {
    if (!provider) throw new Error('provider is required');
    const state = session.store.getSnapshot();
    assertRunningRun(state, session.id, input.runId);
    assertCommandCapability(provider, 'tool.retry');
    assertActionAvailable(session, {
      runId: input.runId,
      type: 'tool.retry',
      entityId: input.toolCallId,
    });
    const toolCall = state.toolCalls[getAgentEntityKey(input.runId, input.toolCallId)];
    if (toolCall?.status !== 'failed') {
      throw new Error(`Tool call "${input.toolCallId}" is not failed in run "${input.runId}".`);
    }
    if (toolCall.error?.retryable !== true) {
      throw new Error(`Tool call "${input.toolCallId}" is not retryable.`);
    }
    const command = getCommandFactory(session, input.runId).create('tool.retry', {
      toolCallId: input.toolCallId,
    });
    return executeCommand(command);
  });

  const cancelRun = useEvent((input: { runId: string; reason?: string }) => {
    if (!provider) throw new Error('provider is required');
    assertRunningRun(session.store.getSnapshot(), session.id, input.runId);
    assertCommandCapability(provider, 'run.cancel');
    assertActionAvailable(session, { runId: input.runId, type: 'run.cancel' });
    const command = getCommandFactory(session, input.runId).create('run.cancel', {
      reason: input.reason,
    });
    return executeCommand(command);
  });

  const agentActions: AgentActions = {
    resolveApproval,
    retryTool,
    cancelRun,
  };

  return {
    agentState,
    messages: projectAgentMessages(agentState),
    agentActions,
    commandStates: commandSnapshot.commandStates,
    latestCommandByAction: commandSnapshot.latestCommandByAction,
    onRequest,
    abort: () => {
      const runId = session.latestRunId;
      if (runId) session.runControllers.get(runId)?.abort();
    },
    isRequesting: Object.values(agentState.runs).some(({ status }) => status === 'running'),
  } as const;
}
