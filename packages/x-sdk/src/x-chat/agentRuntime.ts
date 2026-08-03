import { useEvent } from '@rc-component/util';
import { useEffect, useState, useSyncExternalStore } from 'react';
import type { AgentMessageState, AgentState, AgentStore } from '../agent';
import { createAgentStore, getAgentEntityKey } from '../agent';
import type { AgentProvider } from '../chat-providers';
import { runAgentProvider } from '../chat-providers';
import type { MessageInfo, MessageStatus } from '.';
import type { ConversationKey } from './store';

interface AgentSession {
  id: string;
  store: AgentStore;
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

export function useAgentChatRuntime(
  provider: AgentProvider<any, any, any, any> | undefined,
  conversationKey: ConversationKey,
) {
  const [session, setSession] = useState(() => getAgentSession(conversationKey));
  const [controller, setController] = useState<AbortController>();

  useEffect(() => {
    setSession(getAgentSession(conversationKey));
  }, [conversationKey]);

  useEffect(() => () => controller?.abort(), [conversationKey, controller]);

  const agentState = useSyncExternalStore(
    session.store.subscribe,
    session.store.getSnapshot,
    session.store.getSnapshot,
  );

  const onRequest = useEvent((input: unknown) => {
    if (!provider) throw new Error('provider is required');

    const nextController = new AbortController();
    setController(nextController);
    nextRunId += 1;
    const runId = `run_${nextRunId}`;

    return runAgentProvider({
      provider,
      input,
      run: {
        sessionId: session.id,
        runId,
        signal: nextController.signal,
      },
      onEvent: session.store.dispatch,
    });
  });

  return {
    agentState,
    messages: projectAgentMessages(agentState),
    onRequest,
    abort: () => controller?.abort(),
    isRequesting: Object.values(agentState.runs).some(({ status }) => status === 'running'),
  } as const;
}
