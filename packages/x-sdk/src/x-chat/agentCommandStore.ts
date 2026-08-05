import type { AgentCommand } from '../agent';
import { getAgentCommandActionKey, getAgentCommandKey } from '../agent';

export type AgentCommandStatus = 'submitting' | 'succeeded' | 'failed';

export interface AgentCommandError {
  code:
    | 'unsupported_capability'
    | 'invalid_command'
    | 'provider_error'
    | 'protocol_error'
    | 'interrupted';
  message: string;
  retryable: boolean;
  cause?: unknown;
}

export interface AgentCommandState {
  command: AgentCommand;
  key: string;
  status: AgentCommandStatus;
  error?: AgentCommandError;
  createdAt: number;
  updatedAt: number;
}

export interface AgentCommandStoreSnapshot {
  commandStates: Readonly<Record<string, AgentCommandState>>;
  latestCommandByAction: Readonly<Record<string, string>>;
}

export interface AgentCommandStore {
  getSnapshot(): AgentCommandStoreSnapshot;
  start(command: AgentCommand): AgentCommandState;
  succeed(commandId: string, updatedAt?: number): void;
  fail(commandId: string, error: AgentCommandError, updatedAt?: number): void;
  clearRun(runId: string, keepSubmitting?: boolean): void;
  subscribe(listener: () => void): () => void;
}

const initialSnapshot: AgentCommandStoreSnapshot = {
  commandStates: {},
  latestCommandByAction: {},
};

export function createAgentCommandStore(): AgentCommandStore {
  let snapshot = initialSnapshot;
  const listeners = new Set<() => void>();
  const emit = () => {
    listeners.forEach((listener) => {
      listener();
    });
  };

  const update = (commandId: string, updater: (state: AgentCommandState) => AgentCommandState) => {
    const current = snapshot.commandStates[commandId];
    if (!current) return;
    snapshot = {
      ...snapshot,
      commandStates: {
        ...snapshot.commandStates,
        [commandId]: updater(current),
      },
    };
    emit();
  };

  return {
    getSnapshot() {
      return snapshot;
    },
    start(command) {
      const key = getAgentCommandKey(command);
      const state: AgentCommandState = {
        command,
        key,
        status: 'submitting',
        createdAt: command.timestamp,
        updatedAt: command.timestamp,
      };
      snapshot = {
        commandStates: {
          ...snapshot.commandStates,
          [key]: state,
        },
        latestCommandByAction: {
          ...snapshot.latestCommandByAction,
          [getAgentCommandActionKey(command)]: key,
        },
      };
      emit();
      return state;
    },
    succeed(commandId, updatedAt = Date.now()) {
      update(commandId, (state) => ({ ...state, status: 'succeeded', updatedAt }));
    },
    fail(commandId, error, updatedAt = Date.now()) {
      update(commandId, (state) => ({ ...state, status: 'failed', error, updatedAt }));
    },
    clearRun(runId, keepSubmitting = false) {
      const commandStates = Object.fromEntries(
        Object.entries(snapshot.commandStates).filter(
          ([, state]) =>
            state.command.runId !== runId || (keepSubmitting && state.status === 'submitting'),
        ),
      );
      if (Object.keys(commandStates).length === Object.keys(snapshot.commandStates).length) return;

      const retainedCommandIds = new Set(Object.keys(commandStates));
      snapshot = {
        commandStates,
        latestCommandByAction: Object.fromEntries(
          Object.entries(snapshot.latestCommandByAction).filter(([, commandId]) =>
            retainedCommandIds.has(commandId),
          ),
        ),
      };
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
