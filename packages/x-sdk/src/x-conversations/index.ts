import { useEffect, useState, useSyncExternalStore } from 'react';
import { AnyObject } from '../_util/type';
import { ConversationStore } from './store';

export interface ConversationData extends AnyObject {
  key: string;
}

interface XConversationConfig {
  defaultConversations?: ConversationData[];
  defaultActiveConversationKey?: string;
}

export default function useXConversations(config: XConversationConfig) {
  const [store] = useState(() => {
    const store = new ConversationStore(
      config?.defaultConversations || [],
      config?.defaultActiveConversationKey || '',
    );
    return store;
  });

  useEffect(() => {
    return () => {
      store.destroy();
    };
  }, []);

  const conversations = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const activeConversationKey = useSyncExternalStore(
    store.subscribe,
    store.getActiveConversationKey,
    store.getActiveConversationKey,
  );

  return {
    conversations,
    activeConversationKey: activeConversationKey,
    setActiveConversationKey: store.setActiveConversationKey,
    addConversation: store.addConversation,
    removeConversation: store.removeConversation,
    setConversation: store.setConversation,
    getConversation: store.getConversation,
    setConversations: store.setConversations,
    getMessages: store.getMessages,
  };
}
