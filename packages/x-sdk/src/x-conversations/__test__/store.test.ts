import { ConversationStore } from '../store';

describe('ConversationStore snapshots', () => {
  let store: ConversationStore;

  beforeEach(() => {
    store = new ConversationStore([], '');
  });

  afterEach(() => {
    store.destroy();
  });

  it('keeps earlier conversations unchanged when updating a conversation', () => {
    const first = Object.freeze({ key: '1', label: 'before', group: 'today' });
    const second = { key: '2', label: 'unchanged' };
    store.setConversations([first, second]);
    const previousSnapshot = store.getSnapshot();

    expect(store.setConversation('1', { key: '1', label: 'after' })).toBe(true);

    expect(previousSnapshot).toEqual([first, second]);
    expect(store.getConversation('1')).toEqual({ key: '1', label: 'after', group: 'today' });
    expect(store.getConversation('1')).not.toBe(first);
    expect(store.getConversation('2')).toBe(second);
  });

  it('keeps the previous array unchanged when removing a conversation', () => {
    const first = { key: '1', label: 'first' };
    const second = { key: '2', label: 'second' };
    store.setConversations([first, second]);
    const previousSnapshot = Object.freeze(store.getSnapshot());

    expect(store.removeConversation('1')).toBe(true);

    expect(previousSnapshot).toEqual([first, second]);
    expect(store.getSnapshot()).toEqual([second]);
    expect(store.getConversation('2')).toBe(second);
  });

  it('does not replace the snapshot for unknown conversation keys', () => {
    store.setConversations([{ key: '1', label: 'first' }]);
    const previousSnapshot = store.getSnapshot();

    expect(store.setConversation('missing', { key: 'missing', label: 'after' })).toBe(false);
    expect(store.removeConversation('missing')).toBe(false);
    expect(store.getSnapshot()).toBe(previousSnapshot);
  });
});
