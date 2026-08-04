import type { AgentEvent } from '../protocol';
import { reduceAgentState } from './reduceAgentState';
import type { AgentState } from './state';
import { createInitialAgentState } from './state';

export function replayAgentEvents(
  events: readonly AgentEvent[],
  initialState: AgentState = createInitialAgentState(),
): AgentState {
  return events.reduce(reduceAgentState, initialState);
}
