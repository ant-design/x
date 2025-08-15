import { useEffect, useState, useSyncExternalStore } from 'react';
import { AnyObject } from '../_util/type';
import { ConversationStore } from './store';

export interface ConversationData extends AnyObject {
  key: string | number;
  label?: string;
}

interface XConversationConfig {
  defaultConversations?: ConversationData[];
}

export default function useXConversations(config: XConversationConfig) {
  const [store] = useState(() => {
    const store = new ConversationStore(config?.defaultConversations || []);
    return store;
  });

  useEffect(() => {
    return () => {
      store.destroy();
    };
  }, []);

  const conversations = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  return {
    conversations,
    addConversation: store.addConversation,
    removeConversation: store.removeConversation,
    setConversation: store.setConversation,
    getConversation: store.getConversation,
    setConversations: store.setConversations,
    getMessages: store.getMessages,
  };
}
