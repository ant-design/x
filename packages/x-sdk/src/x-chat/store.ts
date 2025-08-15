import { useEffect, useState, useSyncExternalStore } from 'react';

type ConversationKey = string | number;

export const chatMessagesStoreHelper = {
  _chatMessagesStores: new Map<string | number, ChatMessagesStore<any>>(),
  get: (conversationKey: ConversationKey) => {
    return chatMessagesStoreHelper._chatMessagesStores.get(conversationKey);
  },
  set: (key: ConversationKey, store: ChatMessagesStore<any>) => {
    chatMessagesStoreHelper._chatMessagesStores.set(key, store);
  },
  delete: (key: ConversationKey) => {
    chatMessagesStoreHelper._chatMessagesStores.delete(key);
  },
  getMessages: (conversationKey: ConversationKey) => {
    const store = chatMessagesStoreHelper._chatMessagesStores.get(conversationKey);
    return store?.getMessages();
  },
};

export class ChatMessagesStore<T extends { id: number | string }> {
  private messages: T[] = [];
  private listeners: (() => void)[] = [];
  private conversationKey: ConversationKey | undefined;

  private emitListeners() {
    this.listeners.forEach((listener) => listener());
  }

  constructor(defaultMessages: T[], conversationKey?: ConversationKey) {
    this.setMessages(defaultMessages);
    if (conversationKey) {
      this.conversationKey = conversationKey;
      chatMessagesStoreHelper.set(this.conversationKey, this);
    }
  }

  setMessages = (messages: T[] | ((ori: T[]) => T[])) => {
    let list: T[];
    if (typeof messages === 'function') {
      list = messages(this.messages);
    } else {
      list = messages as T[];
    }
    this.messages = [...list];
    this.emitListeners();
    return true;
  };

  getMessages = () => {
    return this.messages;
  };

  getMessage = (id: string | number) => {
    return this.messages.find((item) => item.id === id);
  };

  addMessage = (message: T) => {
    const exist = this.getMessage(message.id);
    if (!exist) {
      this.setMessages([...this.messages, message]);
      return true;
    }
    return false;
  };

  setMessage = (id: string, message: Partial<T>) => {
    const exist = this.getMessage(id);
    if (exist) {
      Object.assign(exist, message);
      this.setMessages([...this.messages]);
      return true;
    }
    return false;
  };

  removeMessage = (id: string) => {
    const index = this.messages.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.messages.splice(index, 1);
      this.setMessages([...this.messages]);
      return true;
    }
    return false;
  };

  getSnapshot = () => {
    return this.messages;
  };

  subscribe = (callback: () => void) => {
    this.listeners.push(callback);
    return () => {
      this.listeners.filter((listener) => listener !== callback);
    };
  };
}

type Getter<T> = () => T;

export function useChatStore<T extends { id: number | string }>(
  defaultValue: T[] | Getter<T[]>,
  conversationKey?: ConversationKey,
) {
  const createStore = () => {
    if (conversationKey && chatMessagesStoreHelper.get(conversationKey)) {
      return chatMessagesStoreHelper.get(conversationKey) as ChatMessagesStore<T>;
    }
    const messages =
      typeof defaultValue === 'function' ? (defaultValue as Getter<T[]>)() : defaultValue;
    const store = new ChatMessagesStore<T>(messages || [], conversationKey);
    return store;
  };
  const [store, setStore] = useState(createStore);

  useEffect(() => {
    setStore(createStore());
  }, [conversationKey]);

  const messages = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  return {
    messages,
    addMessage: store.addMessage,
    removeMessage: store.removeMessage,
    setMessage: store.setMessage,
    getMessage: store.getMessage,
    setMessages: store.setMessages,
    getMessages: store.getMessages,
  };
}
