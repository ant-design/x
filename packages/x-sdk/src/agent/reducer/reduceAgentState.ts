import type { AgentEvent, AgentMessageContent } from '../protocol';
import type { AgentEntityKind, AgentEntityStatus, AgentProtocolIssue, AgentState } from './state';
import { getAgentEntityKey, getAgentEventKey } from './state';

const terminalStatuses: readonly AgentEntityStatus[] = ['completed', 'failed', 'cancelled'];

function isTerminal(status: AgentEntityStatus): boolean {
  return terminalStatuses.includes(status);
}

function accept(state: AgentState, event: AgentEvent, patch: Partial<AgentState>): AgentState {
  return {
    ...state,
    ...patch,
    processedEventIds: {
      ...state.processedEventIds,
      [getAgentEventKey(event.runId, event.eventId)]: true,
    },
    lastSequenceByRun: {
      ...state.lastSequenceByRun,
      [event.runId]: event.sequence,
    },
  };
}

function reject(
  state: AgentState,
  event: AgentEvent,
  code: AgentProtocolIssue['code'],
  message: string,
): AgentState {
  return {
    ...state,
    processedEventIds: {
      ...state.processedEventIds,
      [getAgentEventKey(event.runId, event.eventId)]: true,
    },
    issues: [...state.issues, { code, eventId: event.eventId, runId: event.runId, message }],
  };
}

function appendOrder(state: AgentState, kind: AgentEntityKind, id: string, runId: string) {
  return [...state.order, { kind, id, runId }];
}

function appendMessageContent(
  content: AgentMessageContent,
  delta: AgentMessageContent,
): AgentMessageContent {
  if (typeof content === 'string' && typeof delta === 'string') return content + delta;

  const toParts = (value: AgentMessageContent) =>
    typeof value === 'string' ? ([{ type: 'text', text: value }] as const) : value;
  return [...toParts(content), ...toParts(delta)];
}

function requireRun(state: AgentState, event: AgentEvent): AgentState | undefined {
  const run = state.runs[event.runId];
  if (!run) {
    return reject(
      state,
      event,
      'missing_run',
      `Run "${event.runId}" must be started before "${event.type}".`,
    );
  }
  if (run.sessionId !== event.sessionId) {
    return reject(
      state,
      event,
      'invalid_transition',
      `Run "${event.runId}" belongs to session "${run.sessionId}", not "${event.sessionId}".`,
    );
  }
  return undefined;
}

export function reduceAgentState(state: AgentState, event: AgentEvent): AgentState {
  if (state.processedEventIds[getAgentEventKey(event.runId, event.eventId)]) {
    return state;
  }

  const lastSequence = state.lastSequenceByRun[event.runId];
  if (lastSequence !== undefined && event.sequence <= lastSequence) {
    return reject(
      state,
      event,
      'invalid_sequence',
      `Sequence ${event.sequence} must be greater than ${lastSequence} for run "${event.runId}".`,
    );
  }

  const currentRun = state.runs[event.runId];
  if (currentRun && currentRun.sessionId !== event.sessionId && event.type !== 'session.started') {
    return reject(
      state,
      event,
      'invalid_transition',
      `Run "${event.runId}" belongs to session "${currentRun.sessionId}", not "${event.sessionId}".`,
    );
  }
  if (
    currentRun &&
    currentRun.status !== 'running' &&
    event.type !== 'session.started' &&
    event.type !== 'run.started'
  ) {
    return reject(
      state,
      event,
      'invalid_transition',
      `Run "${event.runId}" is already ${currentRun.status}.`,
    );
  }

  switch (event.type) {
    case 'session.started': {
      if (state.sessions[event.sessionId]) {
        return reject(
          state,
          event,
          'duplicate_entity',
          `Session "${event.sessionId}" already exists.`,
        );
      }
      return accept(state, event, {
        sessions: {
          ...state.sessions,
          [event.sessionId]: {
            id: event.sessionId,
            title: event.payload.title,
            createdAt: event.timestamp,
          },
        },
      });
    }

    case 'run.started': {
      if (state.runs[event.runId]) {
        return reject(state, event, 'duplicate_entity', `Run "${event.runId}" already exists.`);
      }
      return accept(state, event, {
        runs: {
          ...state.runs,
          [event.runId]: {
            id: event.runId,
            sessionId: event.sessionId,
            status: 'running',
            input: event.payload.input,
            createdAt: event.timestamp,
            updatedAt: event.timestamp,
          },
        },
      });
    }

    case 'run.completed':
    case 'run.failed':
    case 'run.cancelled': {
      const missingRun = requireRun(state, event);
      if (missingRun) return missingRun;
      const run = state.runs[event.runId];
      const status = event.type.slice(4) as 'completed' | 'failed' | 'cancelled';
      return accept(state, event, {
        runs: {
          ...state.runs,
          [event.runId]: {
            ...run,
            status,
            output: event.type === 'run.completed' ? event.payload.output : run.output,
            usage: event.type === 'run.completed' ? event.payload.usage : run.usage,
            error: event.type === 'run.failed' ? event.payload.error : run.error,
            reason: event.type === 'run.cancelled' ? event.payload.reason : run.reason,
            updatedAt: event.timestamp,
          },
        },
      });
    }

    case 'message.started': {
      const missingRun = requireRun(state, event);
      if (missingRun) return missingRun;
      const { messageId, role, content = '' } = event.payload;
      const entityKey = getAgentEntityKey(event.runId, messageId);
      if (state.messages[entityKey]) {
        return reject(state, event, 'duplicate_entity', `Message "${messageId}" already exists.`);
      }
      return accept(state, event, {
        messages: {
          ...state.messages,
          [entityKey]: {
            id: messageId,
            runId: event.runId,
            parentId: event.parentId,
            role,
            content,
            status: 'streaming',
            createdAt: event.timestamp,
            updatedAt: event.timestamp,
            meta: event.meta,
          },
        },
        order: appendOrder(state, 'message', messageId, event.runId),
      });
    }

    case 'message.delta':
    case 'message.completed':
    case 'message.failed':
    case 'message.cancelled': {
      const { messageId } = event.payload;
      const entityKey = getAgentEntityKey(event.runId, messageId);
      const message = state.messages[entityKey];
      if (!message) {
        return reject(state, event, 'missing_entity', `Message "${messageId}" does not exist.`);
      }
      if (isTerminal(message.status)) {
        return reject(
          state,
          event,
          'invalid_transition',
          `Message "${messageId}" is already ${message.status}.`,
        );
      }

      let content = message.content;
      let status = message.status;
      let error = message.error;
      let reason = message.reason;
      if (event.type === 'message.delta')
        content = appendMessageContent(content, event.payload.delta);
      if (event.type === 'message.completed') {
        content = event.payload.content ?? content;
        status = 'completed';
      }
      if (event.type === 'message.failed') {
        error = event.payload.error;
        status = 'failed';
      }
      if (event.type === 'message.cancelled') {
        reason = event.payload.reason;
        status = 'cancelled';
      }
      return accept(state, event, {
        messages: {
          ...state.messages,
          [entityKey]: { ...message, content, status, error, reason, updatedAt: event.timestamp },
        },
      });
    }

    case 'reasoning.started': {
      const missingRun = requireRun(state, event);
      if (missingRun) return missingRun;
      const { reasoningId, redacted = false } = event.payload;
      const entityKey = getAgentEntityKey(event.runId, reasoningId);
      if (state.reasoning[entityKey]) {
        return reject(
          state,
          event,
          'duplicate_entity',
          `Reasoning "${reasoningId}" already exists.`,
        );
      }
      return accept(state, event, {
        reasoning: {
          ...state.reasoning,
          [entityKey]: {
            id: reasoningId,
            runId: event.runId,
            parentId: event.parentId,
            content: '',
            redacted,
            status: 'streaming',
            createdAt: event.timestamp,
            updatedAt: event.timestamp,
            meta: event.meta,
          },
        },
        order: appendOrder(state, 'reasoning', reasoningId, event.runId),
      });
    }

    case 'reasoning.delta':
    case 'reasoning.completed':
    case 'reasoning.failed':
    case 'reasoning.cancelled': {
      const { reasoningId } = event.payload;
      const entityKey = getAgentEntityKey(event.runId, reasoningId);
      const reasoning = state.reasoning[entityKey];
      if (!reasoning) {
        return reject(state, event, 'missing_entity', `Reasoning "${reasoningId}" does not exist.`);
      }
      if (isTerminal(reasoning.status)) {
        return reject(
          state,
          event,
          'invalid_transition',
          `Reasoning "${reasoningId}" is already ${reasoning.status}.`,
        );
      }

      let content = reasoning.content;
      let summary = reasoning.summary;
      let status = reasoning.status;
      let error = reasoning.error;
      let reason = reasoning.reason;
      if (event.type === 'reasoning.delta') content += event.payload.delta;
      if (event.type === 'reasoning.completed') {
        content = event.payload.content ?? content;
        summary = event.payload.summary;
        status = 'completed';
      }
      if (event.type === 'reasoning.failed') {
        error = event.payload.error;
        status = 'failed';
      }
      if (event.type === 'reasoning.cancelled') {
        reason = event.payload.reason;
        status = 'cancelled';
      }
      return accept(state, event, {
        reasoning: {
          ...state.reasoning,
          [entityKey]: {
            ...reasoning,
            content,
            summary,
            status,
            error,
            reason,
            updatedAt: event.timestamp,
          },
        },
      });
    }

    case 'tool.requested': {
      const missingRun = requireRun(state, event);
      if (missingRun) return missingRun;
      const { toolCallId, name, index, arguments: args = '' } = event.payload;
      const entityKey = getAgentEntityKey(event.runId, toolCallId);
      if (state.toolCalls[entityKey]) {
        return reject(
          state,
          event,
          'duplicate_entity',
          `Tool call "${toolCallId}" already exists.`,
        );
      }
      return accept(state, event, {
        toolCalls: {
          ...state.toolCalls,
          [entityKey]: {
            id: toolCallId,
            runId: event.runId,
            parentId: event.parentId,
            name,
            arguments: args,
            index,
            status: 'pending',
            createdAt: event.timestamp,
            updatedAt: event.timestamp,
            meta: event.meta,
          },
        },
        order: appendOrder(state, 'tool', toolCallId, event.runId),
      });
    }

    case 'tool.arguments_delta':
    case 'tool.running':
    case 'tool.completed':
    case 'tool.failed':
    case 'tool.cancelled': {
      const { toolCallId } = event.payload;
      const entityKey = getAgentEntityKey(event.runId, toolCallId);
      const tool = state.toolCalls[entityKey];
      if (!tool) {
        return reject(state, event, 'missing_entity', `Tool call "${toolCallId}" does not exist.`);
      }
      if (isTerminal(tool.status)) {
        return reject(
          state,
          event,
          'invalid_transition',
          `Tool call "${toolCallId}" is already ${tool.status}.`,
        );
      }

      let args = tool.arguments;
      let result = tool.result;
      let status = tool.status;
      let error = tool.error;
      let reason = tool.reason;
      if (event.type === 'tool.arguments_delta') args += event.payload.delta;
      if (event.type === 'tool.running') status = 'running';
      if (event.type === 'tool.completed') {
        result = event.payload.result;
        status = 'completed';
      }
      if (event.type === 'tool.failed') {
        error = event.payload.error;
        status = 'failed';
      }
      if (event.type === 'tool.cancelled') {
        reason = event.payload.reason;
        status = 'cancelled';
      }
      return accept(state, event, {
        toolCalls: {
          ...state.toolCalls,
          [entityKey]: {
            ...tool,
            arguments: args,
            result,
            status,
            error,
            reason,
            updatedAt: event.timestamp,
          },
        },
      });
    }

    case 'approval.requested': {
      const missingRun = requireRun(state, event);
      if (missingRun) return missingRun;
      const { approvalId, toolCallId, description, risk, data } = event.payload;
      const entityKey = getAgentEntityKey(event.runId, approvalId);
      if (state.approvals[entityKey]) {
        return reject(state, event, 'duplicate_entity', `Approval "${approvalId}" already exists.`);
      }
      return accept(state, event, {
        approvals: {
          ...state.approvals,
          [entityKey]: {
            id: approvalId,
            runId: event.runId,
            parentId: event.parentId,
            toolCallId,
            description,
            risk,
            data,
            status: 'waiting',
            createdAt: event.timestamp,
            updatedAt: event.timestamp,
            meta: event.meta,
          },
        },
        order: appendOrder(state, 'approval', approvalId, event.runId),
      });
    }

    case 'approval.resolved': {
      const { approvalId, decision, data } = event.payload;
      const entityKey = getAgentEntityKey(event.runId, approvalId);
      const approval = state.approvals[entityKey];
      if (!approval) {
        return reject(state, event, 'missing_entity', `Approval "${approvalId}" does not exist.`);
      }
      if (isTerminal(approval.status)) {
        return reject(
          state,
          event,
          'invalid_transition',
          `Approval "${approvalId}" is already resolved.`,
        );
      }
      return accept(state, event, {
        approvals: {
          ...state.approvals,
          [entityKey]: {
            ...approval,
            decision,
            data: data ?? approval.data,
            status: 'completed',
            updatedAt: event.timestamp,
          },
        },
      });
    }

    case 'task.created': {
      const missingRun = requireRun(state, event);
      if (missingRun) return missingRun;
      const { taskId, title, description } = event.payload;
      const entityKey = getAgentEntityKey(event.runId, taskId);
      if (state.tasks[entityKey]) {
        return reject(state, event, 'duplicate_entity', `Task "${taskId}" already exists.`);
      }
      return accept(state, event, {
        tasks: {
          ...state.tasks,
          [entityKey]: {
            id: taskId,
            runId: event.runId,
            parentId: event.parentId,
            title,
            description,
            status: 'pending',
            createdAt: event.timestamp,
            updatedAt: event.timestamp,
            meta: event.meta,
          },
        },
        order: appendOrder(state, 'task', taskId, event.runId),
      });
    }

    case 'task.updated':
    case 'task.completed':
    case 'task.failed':
    case 'task.cancelled': {
      const { taskId } = event.payload;
      const entityKey = getAgentEntityKey(event.runId, taskId);
      const task = state.tasks[entityKey];
      if (!task) {
        return reject(state, event, 'missing_entity', `Task "${taskId}" does not exist.`);
      }
      if (isTerminal(task.status)) {
        return reject(
          state,
          event,
          'invalid_transition',
          `Task "${taskId}" is already ${task.status}.`,
        );
      }

      let nextTask = { ...task, updatedAt: event.timestamp };
      if (event.type === 'task.updated') {
        nextTask = {
          ...nextTask,
          title: event.payload.title ?? task.title,
          description: event.payload.description ?? task.description,
          progress: event.payload.progress ?? task.progress,
          status: 'running',
        };
      }
      if (event.type === 'task.completed') {
        nextTask = { ...nextTask, result: event.payload.result, status: 'completed' };
      }
      if (event.type === 'task.failed') {
        nextTask = { ...nextTask, error: event.payload.error, status: 'failed' };
      }
      if (event.type === 'task.cancelled') {
        nextTask = { ...nextTask, reason: event.payload.reason, status: 'cancelled' };
      }
      return accept(state, event, {
        tasks: { ...state.tasks, [entityKey]: nextTask },
      });
    }

    case 'artifact.created': {
      const missingRun = requireRun(state, event);
      if (missingRun) return missingRun;
      const { artifactId, name, mediaType, content } = event.payload;
      const entityKey = getAgentEntityKey(event.runId, artifactId);
      if (state.artifacts[entityKey]) {
        return reject(state, event, 'duplicate_entity', `Artifact "${artifactId}" already exists.`);
      }
      return accept(state, event, {
        artifacts: {
          ...state.artifacts,
          [entityKey]: {
            id: artifactId,
            runId: event.runId,
            parentId: event.parentId,
            name,
            mediaType,
            content,
            status: 'streaming',
            createdAt: event.timestamp,
            updatedAt: event.timestamp,
            meta: event.meta,
          },
        },
        order: appendOrder(state, 'artifact', artifactId, event.runId),
      });
    }

    case 'artifact.updated':
    case 'artifact.completed':
    case 'artifact.failed': {
      const { artifactId } = event.payload;
      const entityKey = getAgentEntityKey(event.runId, artifactId);
      const artifact = state.artifacts[entityKey];
      if (!artifact) {
        return reject(state, event, 'missing_entity', `Artifact "${artifactId}" does not exist.`);
      }
      if (isTerminal(artifact.status)) {
        return reject(
          state,
          event,
          'invalid_transition',
          `Artifact "${artifactId}" is already ${artifact.status}.`,
        );
      }

      let nextArtifact = { ...artifact, updatedAt: event.timestamp };
      if (event.type === 'artifact.updated') {
        nextArtifact = {
          ...nextArtifact,
          content: event.payload.content,
          version: event.payload.version ?? artifact.version,
        };
      }
      if (event.type === 'artifact.completed') {
        nextArtifact = {
          ...nextArtifact,
          content: event.payload.content ?? artifact.content,
          version: event.payload.version ?? artifact.version,
          status: 'completed',
        };
      }
      if (event.type === 'artifact.failed') {
        nextArtifact = { ...nextArtifact, error: event.payload.error, status: 'failed' };
      }
      return accept(state, event, {
        artifacts: { ...state.artifacts, [entityKey]: nextArtifact },
      });
    }
  }
}
