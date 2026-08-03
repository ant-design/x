import type { AgentEventMeta, AgentEventOf, AgentEventPayloadMap, AgentEventType } from './events';
import { AGENT_EVENT_PROTOCOL_VERSION } from './events';

export interface AgentEventFactoryOptions {
  sessionId: string;
  runId: string;
  initialSequence?: number;
  now?: () => number;
  createEventId?: (sequence: number, type: AgentEventType) => string;
}

export interface CreateAgentEventOptions {
  eventId?: string;
  sequence?: number;
  timestamp?: number;
  parentId?: string;
  meta?: AgentEventMeta;
}

export interface AgentEventFactory {
  create<Type extends AgentEventType>(
    type: Type,
    payload: AgentEventPayloadMap[Type],
    options?: CreateAgentEventOptions,
  ): AgentEventOf<Type>;
  getSequence(): number;
}

export function createAgentEventFactory(options: AgentEventFactoryOptions): AgentEventFactory {
  let sequence = options.initialSequence ?? -1;
  const now = options.now ?? Date.now;
  const createEventId =
    options.createEventId ??
    ((nextSequence: number, type: AgentEventType) => `${options.runId}:${nextSequence}:${type}`);

  return {
    create(type, payload, eventOptions = {}) {
      const nextSequence = eventOptions.sequence ?? sequence + 1;
      if (!Number.isInteger(nextSequence) || nextSequence < 0) {
        throw new Error('Agent event sequence must be a non-negative integer.');
      }
      sequence = Math.max(sequence, nextSequence);

      const event = {
        protocolVersion: AGENT_EVENT_PROTOCOL_VERSION,
        type,
        eventId: eventOptions.eventId ?? createEventId(nextSequence, type),
        sessionId: options.sessionId,
        runId: options.runId,
        sequence: nextSequence,
        timestamp: eventOptions.timestamp ?? now(),
        payload,
      } as AgentEventOf<typeof type>;
      if (eventOptions.parentId !== undefined) event.parentId = eventOptions.parentId;
      if (eventOptions.meta !== undefined) event.meta = eventOptions.meta;
      return event;
    },
    getSequence() {
      return sequence;
    },
  };
}
