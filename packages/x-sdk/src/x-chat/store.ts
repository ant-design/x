import { useEffect, useState, useSyncExternalStore } from 'react';

export type ConversationKey = string | number | symbol;

export const chatMessagesStoreHelper = {
  _chatMessagesStores: new Map<ConversationKey, ChatMessagesStore<any>>(),
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
  private listeners: (() => void)[] = [];
  private conversationKey: ConversationKey | undefined;
  private snapshotResult: {
    messages: T[];
    isDefaultMessagesRequesting: boolean;
  } = {
    messages: [],
    isDefaultMessagesRequesting: false,
  };
  // Throttle state for preventing "Maximum update depth exceeded" during streaming
  private throttleTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingEmit = false;
  private readonly throttleInterval: number = 50;
  // 竞态条件保护
  private isDestroyed = false;

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

  constructor(defaultMessages: () => Promise<T[]>, conversationKey?: ConversationKey) {
    // 初始化消息，处理同步和异步情况
    this.initializeMessages(defaultMessages, (value) => {
      this.setSnapshotResult('isDefaultMessagesRequesting', value);
      this.emitListeners();
    });

    // 注册到全局存储助手
    if (conversationKey) {
      this.conversationKey = conversationKey;
      chatMessagesStoreHelper.set(this.conversationKey, this);
    }
  }

  private async initializeMessages(
    defaultMessages: () => Promise<T[]>,
    setDefaultMessagesRequesting: (defaultValueLoading: boolean) => void,
  ) {
    try {
      setDefaultMessagesRequesting(true);
      const messages = await defaultMessages();

      // 检查是否已被销毁，避免竞态条件
      if (!this.isDestroyed) {
        this.setMessagesInternal(messages, false);
      }
    } catch (error) {
      // 错误处理：保持空数组状态，避免应用崩溃
      console.warn('Failed to initialize messages:', error);
      if (!this.isDestroyed) {
        this.setMessagesInternal([], false);
      }
    } finally {
      setDefaultMessagesRequesting(false);
    }
  }
  private setSnapshotResult = <K extends keyof typeof this.snapshotResult>(
    key: K,
    value: (typeof this.snapshotResult)[K],
  ) => {
    this.snapshotResult = {
      ...this.snapshotResult,
      [key]: value,
    };
  };
  private setMessagesInternal = (messages: T[] | ((ori: T[]) => T[]), throttle = true) => {
    let list: T[];
    if (typeof messages === 'function') {
      list = messages(this.snapshotResult.messages);
    } else {
      list = messages as T[];
    }
    this.setSnapshotResult('messages', list);

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
    return this.snapshotResult.messages;
  };

  getMessage = (id: string | number) => {
    return this.getMessages().find((item) => item.id === id);
  };

  addMessage = (message: T) => {
    const exist = this.getMessage(message.id);
    if (!exist) {
      this.setMessages([...this.snapshotResult.messages, message]);
      return true;
    }
    return false;
  };

  setMessage = (id: string | number, message: Partial<T> | ((message: T) => Partial<T>)) => {
    const originMessage = this.getMessage(id);
    if (originMessage) {
      const mergeMessage = typeof message === 'function' ? message(originMessage) : message;
      Object.assign(originMessage, mergeMessage);
      this.setMessages([...this.snapshotResult.messages]);
      return true;
    }
    return false;
  };

  removeMessage = (id: string | number) => {
    const index = this.getMessages().findIndex((item) => item.id === id);
    if (index !== -1) {
      this.snapshotResult.messages.splice(index, 1);
      this.setMessages([...this.getMessages()]);
      return true;
    }
    return false;
  };

  getSnapshot = () => {
    return this.snapshotResult;
  };

  subscribe = (callback: () => void) => {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
      // Clean up throttle timer when no listeners remain to prevent memory leaks
      // and "setState on unmounted component" warnings
      if (this.listeners.length === 0) {
        if (this.throttleTimer) {
          clearTimeout(this.throttleTimer);
          this.throttleTimer = null;
        }
        this.pendingEmit = false;
      }
    };
  };

  /**
   * Clean up resources (throttle timer) when the store is no longer needed.
   * Should be called when the component unmounts or the store is disposed.
   */
  destroy = () => {
    this.isDestroyed = true;
    if (this.throttleTimer) {
      clearTimeout(this.throttleTimer);
      this.throttleTimer = null;
    }
    this.pendingEmit = false;
    this.listeners = [];
  };
}

export function useChatStore<T extends { id: number | string }>(
  defaultValue: () => Promise<T[]>,
  conversationKey: ConversationKey,
) {
  const createStore = () => {
    if (chatMessagesStoreHelper.get(conversationKey)) {
      return chatMessagesStoreHelper.get(conversationKey) as ChatMessagesStore<T>;
    }

    const store = new ChatMessagesStore<T>(defaultValue, conversationKey);
    return store;
  };
  const [store, setStore] = useState(createStore);

  useEffect(() => {
    setStore(createStore());
  }, [conversationKey]);

  const { messages, isDefaultMessagesRequesting } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );

  return {
    messages,
    isDefaultMessagesRequesting,
    addMessage: store.addMessage,
    removeMessage: store.removeMessage,
    setMessage: store.setMessage,
    getMessage: store.getMessage,
    setMessages: store.setMessages,
    getMessages: store.getMessages,
  };
}
