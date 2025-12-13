import { chatMessagesStoreHelper } from '../x-chat/store';
import type { ConversationData } from '.';

/**
 * We manage all conversation stores here, so that useXChat can get the conversation data by conversationKey.
 */
export const conversationStoreHelper = {
  _allConversationStores: new Map<string, ConversationStore>(),
  set: (key: string, store: ConversationStore) => {
    conversationStoreHelper._allConversationStores.set(key, store);
  },
  delete: (key: string) => {
    conversationStoreHelper._allConversationStores.delete(key);
  },
  getConversation: (conversationKey: string) => {
    for (const store of conversationStoreHelper._allConversationStores.values()) {
      if (store) {
        const conversation = store.getConversation(conversationKey);
        if (conversation) {
          return conversation;
        }
      }
    }
  },
};

export class ConversationStore {
  private conversations: ConversationData[] = [];
  private listeners: (() => void)[] = [];
  private storeKey: string;
  private activeConversationKey: string;

  private emitListeners() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  constructor(defaultConversations: ConversationData[], defaultActiveConversationKey: string) {
    this.setConversations(defaultConversations);
    this.storeKey = Math.random().toString();
    conversationStoreHelper.set(this.storeKey, this);
    this.activeConversationKey = defaultActiveConversationKey;
  }

  setActiveConversationKey = (key: string) => {
    this.activeConversationKey = key;
    this.emitListeners();
    return true;
  };
  setConversations = (list: ConversationData[]) => {
    this.conversations = [...list];
    this.emitListeners();
    return true;
  };

  getConversation = (key: ConversationData['key']) => {
    return this.conversations.find((item) => item.key === key);
  };

  addConversation = (conversation: ConversationData, placement?: 'prepend' | 'append') => {
    const exist = this.getConversation(conversation.key);
    if (!exist) {
      this.setConversations(
        placement === 'prepend'
          ? [conversation, ...this.conversations]
          : [...this.conversations, conversation],
      );
      return true;
    }
    return false;
  };

  setConversation = (key: ConversationData['key'], conversation: ConversationData) => {
    const exist = this.getConversation(key);
    if (exist) {
      Object.assign(exist, conversation);
      this.setConversations([...this.conversations]);
      return true;
    }
    return false;
  };

  removeConversation = (key: ConversationData['key']) => {
    const index = this.conversations.findIndex((item) => item.key === key);
    if (index !== -1) {
      this.conversations.splice(index, 1);
      this.setConversations([...this.conversations]);
      return true;
    }
    return false;
  };

  getMessages = (key: ConversationData['key']) => {
    return chatMessagesStoreHelper.getMessages(key);
  };

  getSnapshot = () => {
    return this.conversations;
  };

  getActiveConversationKey = () => {
    return this.activeConversationKey;
  };

  subscribe = (callback: () => void) => {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    };
  };

  destroy = () => {
    conversationStoreHelper.delete(this.storeKey);
  };
}
