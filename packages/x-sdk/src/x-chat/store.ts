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

  // Throttle state for preventing "Maximum update depth exceeded" during streaming
  private throttleTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingEmit: boolean = false;
  private readonly throttleInterval: number = 50;

  private emitListeners() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  private throttledEmitListeners() {
    if (!this.throttleTimer) {
      // Leading edge: execute immediately
      this.emitListeners();
      this.pendingEmit = false;

      this.throttleTimer = setTimeout(() => {
        this.throttleTimer = null;
        // Trailing edge: flush pending updates
        if (this.pendingEmit) {
          this.emitListeners();
          this.pendingEmit = false;
        }
      }, this.throttleInterval);
    } else {
      this.pendingEmit = true;
    }
  }

  constructor(defaultMessages: T[], conversationKey?: ConversationKey) {
    this.setMessagesInternal(defaultMessages, false);
    if (conversationKey) {
      this.conversationKey = conversationKey;
      chatMessagesStoreHelper.set(this.conversationKey, this);
    }
  }

  private setMessagesInternal = (
    messages: T[] | ((ori: T[]) => T[]),
    throttle: boolean = true,
  ) => {
    let list: T[];
    if (typeof messages === 'function') {
      list = messages(this.messages);
    } else {
      list = messages as T[];
    }
    this.messages = [...list];
    if (throttle) {
      this.throttledEmitListeners();
    } else {
      this.emitListeners();
    }
    return true;
  };

  setMessages = (messages: T[] | ((ori: T[]) => T[])) => {
    return this.setMessagesInternal(messages, true);
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

  setMessage = (id: string | number, message: Partial<T> | ((message: T) => Partial<T>)) => {
    const originMessage = this.getMessage(id);
    if (originMessage) {
      const mergeMessage = typeof message === 'function' ? message(originMessage) : message;
      Object.assign(originMessage, mergeMessage);
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
      this.listeners = this.listeners.filter((listener) => listener !== callback);
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
