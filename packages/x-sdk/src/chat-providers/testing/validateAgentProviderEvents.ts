import type { AgentEvent } from '../../agent/protocol';
import { isAgentEvent } from '../../agent/protocol';
import { replayAgentEvents } from '../../agent/reducer';
import type { AgentProviderCapabilities } from '../AgentProvider';

export interface AgentProviderContractIssue {
  code:
    | 'duplicate_event_id'
    | 'inconsistent_run'
    | 'invalid_event'
    | 'invalid_lifecycle'
    | 'invalid_sequence'
    | 'missing_run_start'
    | 'missing_run_terminal'
    | 'multiple_run_terminals'
    | 'undeclared_event_type';
  message: string;
  eventId?: string;
}

const terminalRunEvents = new Set<AgentEvent['type']>([
  'run.completed',
  'run.failed',
  'run.cancelled',
]);

export function validateAgentProviderEvents(
  capabilities: AgentProviderCapabilities,
  events: readonly unknown[],
): AgentProviderContractIssue[] {
  const issues: AgentProviderContractIssue[] = [];
  const eventIds = new Set<string>();
  let sessionId: string | undefined;
  let runId: string | undefined;
  let lastSequence: number | undefined;
  let runStarted = 0;
  let runTerminated = 0;
  const validEvents: AgentEvent[] = [];

  events.forEach((event) => {
    if (!isAgentEvent(event)) {
      issues.push({
        code: 'invalid_event',
        eventId:
          event &&
          typeof event === 'object' &&
          'eventId' in event &&
          typeof event.eventId === 'string'
            ? event.eventId
            : undefined,
        message: 'Provider emitted an invalid Agent Event envelope or payload.',
      });
      return;
    }
    validEvents.push(event);
    if (!capabilities.eventTypes.includes(event.type)) {
      issues.push({
        code: 'undeclared_event_type',
        eventId: event.eventId,
        message: `Event type "${event.type}" is not declared by the provider.`,
      });
    }
    if (eventIds.has(event.eventId)) {
      issues.push({
        code: 'duplicate_event_id',
        eventId: event.eventId,
        message: `Event id "${event.eventId}" is duplicated.`,
      });
    }
    eventIds.add(event.eventId);

    if (sessionId === undefined) sessionId = event.sessionId;
    if (runId === undefined) runId = event.runId;
    if (event.sessionId !== sessionId || event.runId !== runId) {
      issues.push({
        code: 'inconsistent_run',
        eventId: event.eventId,
        message: 'A provider run must emit one consistent sessionId and runId.',
      });
    }
    if (lastSequence !== undefined && event.sequence <= lastSequence) {
      issues.push({
        code: 'invalid_sequence',
        eventId: event.eventId,
        message: `Sequence ${event.sequence} must be greater than ${lastSequence}.`,
      });
    }
    lastSequence = Math.max(lastSequence ?? -1, event.sequence);

    if (event.type === 'run.started') runStarted += 1;
    if (terminalRunEvents.has(event.type)) runTerminated += 1;
  });

  if (runStarted === 0) {
    issues.push({ code: 'missing_run_start', message: 'A provider must emit run.started.' });
  } else if (runStarted > 1) {
    issues.push({
      code: 'invalid_lifecycle',
      message: 'A provider must emit run.started exactly once.',
    });
  }
  if (runTerminated === 0) {
    issues.push({
      code: 'missing_run_terminal',
      message: 'A provider must emit one terminal run event.',
    });
  } else if (runTerminated > 1) {
    issues.push({
      code: 'multiple_run_terminals',
      message: 'A provider must emit exactly one terminal run event.',
    });
  }

  const state = replayAgentEvents(validEvents);
  state.issues.forEach((issue) => {
    issues.push({
      code: 'invalid_lifecycle',
      eventId: issue.eventId,
      message: issue.message,
    });
  });

  const activeEntities = [
    ...Object.values(state.messages),
    ...Object.values(state.reasoning),
    ...Object.values(state.toolCalls),
    ...Object.values(state.approvals),
    ...Object.values(state.tasks),
    ...Object.values(state.artifacts),
  ].filter((entity) => !['completed', 'failed', 'cancelled'].includes(entity.status));
  if (runTerminated === 1 && activeEntities.length > 0) {
    issues.push({
      code: 'invalid_lifecycle',
      message: `A terminal run has ${activeEntities.length} non-terminal child entities.`,
    });
  }

  return issues;
}
