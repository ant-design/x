import type { AgentEvent } from '../protocol';
import type { AgentProtocolIssue, AgentState } from '../reducer';
import { createInitialAgentState, reduceAgentState } from '../reducer';

export type AgentStoreProtocolMode = 'record' | 'strict';

export interface CreateAgentStoreOptions {
  initialState?: AgentState;
  protocolMode?: AgentStoreProtocolMode;
}

export interface AgentStore {
  getSnapshot(): AgentState;
  dispatch(event: AgentEvent): AgentState;
  batch(events: readonly AgentEvent[]): AgentState;
  reset(state?: AgentState): AgentState;
  subscribe(listener: () => void): () => void;
  destroy(): void;
}

export class AgentProtocolError extends Error {
  issue: AgentProtocolIssue;

  constructor(issue: AgentProtocolIssue) {
    super(issue.message);
    this.name = 'AgentProtocolError';
    this.issue = issue;
  }
}

export function createAgentStore(options: CreateAgentStoreOptions = {}): AgentStore {
  const listeners = new Set<() => void>();
  const protocolMode = options.protocolMode ?? 'record';
  let state = options.initialState ?? createInitialAgentState();
  let destroyed = false;

  const ensureActive = () => {
    if (destroyed) {
      throw new Error('AgentStore has been destroyed.');
    }
  };

  const emit = () => {
    listeners.forEach((listener) => {
      listener();
    });
  };

  const applyTo = (currentState: AgentState, event: AgentEvent) => {
    const nextState = reduceAgentState(currentState, event);
    if (protocolMode === 'strict' && nextState.issues.length > currentState.issues.length) {
      throw new AgentProtocolError(nextState.issues[nextState.issues.length - 1]);
    }
    return nextState;
  };

  return {
    getSnapshot() {
      return state;
    },
    dispatch(event) {
      ensureActive();
      const nextState = applyTo(state, event);
      if (nextState !== state) {
        state = nextState;
        emit();
      }
      return state;
    },
    batch(events) {
      ensureActive();
      let nextState = state;
      events.forEach((event) => {
        nextState = applyTo(nextState, event);
      });
      if (nextState !== state) {
        state = nextState;
        emit();
      }
      return state;
    },
    reset(nextState = createInitialAgentState()) {
      ensureActive();
      state = nextState;
      emit();
      return state;
    },
    subscribe(listener) {
      ensureActive();
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy() {
      destroyed = true;
      listeners.clear();
    },
  };
}
