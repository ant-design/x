import type {
  AgentApprovalState,
  AgentMessageState,
  AgentReasoningState,
  AgentState,
  AgentToolCallState,
} from '../reducer';
import { getAgentEntityKey } from '../reducer';

export type AgentTimelineEntry =
  | { kind: 'message'; entity: AgentMessageState }
  | { kind: 'reasoning'; entity: AgentReasoningState }
  | { kind: 'tool'; entity: AgentToolCallState }
  | { kind: 'approval'; entity: AgentApprovalState };

export interface SelectAgentTimelineOptions {
  runId: string;
  includeReasoning?: boolean;
}

const timelineCache = new WeakMap<AgentState, Map<string, readonly AgentTimelineEntry[]>>();

export function selectAgentTimeline(
  state: AgentState,
  { runId, includeReasoning = true }: SelectAgentTimelineOptions,
): readonly AgentTimelineEntry[] {
  const cacheKey = `${runId.length}:${runId}:${includeReasoning}`;
  let stateCache = timelineCache.get(state);
  const cached = stateCache?.get(cacheKey);
  if (cached) return cached;

  const entries = state.order.flatMap((reference): AgentTimelineEntry[] => {
    if (reference.runId !== runId) return [];
    const entityKey = getAgentEntityKey(reference.runId, reference.id);

    switch (reference.kind) {
      case 'message': {
        const entity = state.messages[entityKey];
        return entity ? [{ kind: 'message', entity }] : [];
      }
      case 'reasoning': {
        if (!includeReasoning) return [];
        const entity = state.reasoning[entityKey];
        if (!entity) return [];
        return [
          {
            kind: 'reasoning',
            entity: entity.redacted ? { ...entity, content: '' } : entity,
          },
        ];
      }
      case 'tool': {
        const entity = state.toolCalls[entityKey];
        return entity ? [{ kind: 'tool', entity }] : [];
      }
      case 'approval': {
        const entity = state.approvals[entityKey];
        return entity ? [{ kind: 'approval', entity }] : [];
      }
      default:
        return [];
    }
  });
  if (!stateCache) {
    stateCache = new Map();
    timelineCache.set(state, stateCache);
  }
  stateCache.set(cacheKey, entries);
  return entries;
}
