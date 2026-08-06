import type { AgentState } from '../reducer';
import { getAgentEntityKey } from '../reducer';

const runningRunsCache = new WeakMap<
  AgentState,
  Map<string, ReturnType<typeof computeRunningRuns>>
>();

const computeRunningRuns = (state: AgentState, sessionId: string) =>
  Object.values(state.runs).filter(
    (run) => run.sessionId === sessionId && run.status === 'running',
  );

export function selectRun(state: AgentState, runId: string) {
  return state.runs[runId];
}

export function selectToolCall(state: AgentState, options: { runId: string; toolCallId: string }) {
  return state.toolCalls[getAgentEntityKey(options.runId, options.toolCallId)];
}

export function selectApproval(state: AgentState, options: { runId: string; approvalId: string }) {
  return state.approvals[getAgentEntityKey(options.runId, options.approvalId)];
}

export function selectRunningRuns(state: AgentState, sessionId: string) {
  let stateCache = runningRunsCache.get(state);
  if (!stateCache) {
    stateCache = new Map();
    runningRunsCache.set(state, stateCache);
  }
  let runs = stateCache.get(sessionId);
  if (!runs) {
    runs = computeRunningRuns(state, sessionId);
    stateCache.set(sessionId, runs);
  }
  return runs;
}
