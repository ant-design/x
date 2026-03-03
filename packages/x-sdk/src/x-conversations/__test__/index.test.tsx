import React, { useImperativeHandle } from 'react';
import { render, sleep } from '../../../tests/utils';
import useXConversations, { ConversationData } from '../index';
import { conversationStoreHelper } from '../store';

describe('useXConversations tests', () => {
  const requestNeverEnd = jest.fn(() => {});

  beforeAll(() => {
    requestNeverEnd.mockClear();
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const createDemo = () =>
    React.forwardRef((config: any, ref: any) => {
      const {
        conversations,
        activeConversationKey,
        setActiveConversationKey,
        addConversation,
        removeConversation,
        setConversation,
        getConversation,
        setConversations,
        getMessages,
      } = useXConversations({
        defaultConversations: config.defaultConversations || [],
        defaultActiveConversationKey: config.defaultActiveConversationKey,
      });

      useImperativeHandle(ref, () => ({
        conversations,
        activeConversationKey,
        setActiveConversationKey,
        addConversation,
        removeConversation,
        setConversation,
        getConversation,
        setConversations,
        getMessages,
      }));
      return (
        <>
          <ul>
            {conversations.map((item) => (
              <li key={item.key}>{item.label}</li>
            ))}
          </ul>
          <div data-testid="active-key">{activeConversationKey}</div>
        </>
      );
    });

  const Demo = createDemo();

  it('should init with defaultConversations', async () => {
    const list: ConversationData[] = [
      {
        key: '1',
        label: 'Chat 1',
      },
    ];
    const ref = React.createRef<{ conversations: ConversationData[] }>();
    render(<Demo ref={ref} defaultConversations={list} />);
    expect(ref.current?.conversations?.length).toEqual(1);
    expect(ref.current?.conversations).toEqual(list);
  });

  it('should init with defaultActiveConversationKey', async () => {
    const list: ConversationData[] = [
      {
        key: '1',
        label: 'Chat 1',
      },
      {
        key: '2',
        label: 'Chat 2',
      },
    ];
    const ref = React.createRef<any>();
    const { getByTestId } = render(
      <Demo ref={ref} defaultConversations={list} defaultActiveConversationKey="2" />,
    );
    expect(getByTestId('active-key').textContent).toBe('2');
    expect(ref.current?.activeConversationKey).toBe('2');
  });

  it('should addConversation, setConversation, removeConversation, getConversation work correctly', async () => {
    const list: ConversationData[] = [
      {
        key: '1',
        label: 'Chat 1',
      },
    ];
    const ref = React.createRef<any>();
    const { queryByText } = render(<Demo ref={ref} defaultConversations={list} />);

    const conversation = ref.current?.getConversation('1');
    expect(conversation).toEqual(list[0]);

    ref.current?.addConversation({ key: '1', label: 'Chat 1' });
    ref.current?.addConversation({ key: '2', label: 'Chat 2' });
    // wait for component rerender
    await sleep(500);
    expect(ref.current?.conversations?.length).toEqual(2);
    expect(queryByText('Chat 2')).toBeTruthy();

    ref.current?.setConversation('20', { key: '20', label: 'Chat 30' });
    ref.current?.setConversation('2', { key: '2', label: 'Chat 3' });
    await sleep(500);
    expect(queryByText('Chat 3')).toBeTruthy();

    ref.current?.removeConversation('30');
    ref.current?.removeConversation('2');
    await sleep(500);
    expect(ref.current?.conversations?.length).toEqual(1);
    expect(queryByText('Chat 3')).not.toBeTruthy();
  });

  it('should support multiple instance in a context', async () => {
    const ref = React.createRef<{ conversations: ConversationData[] }>();
    const ref2 = React.createRef<{ conversations: ConversationData[] }>();
    render(
      <>
        <Demo ref={ref} defaultConversations={[{ key: 'demo1', label: 'Chat 1' }]} />
        <Demo
          ref={ref2}
          defaultConversations={[
            { key: 'demo2', label: 'Chat 2' },
            { key: 'demo3', label: 'Chat 3' },
          ]}
        />
      </>,
    );
    expect(ref.current?.conversations?.length).toEqual(1);
    expect(ref2.current?.conversations?.length).toEqual(2);
  });

  it('should get conversation by conversationKey successfully', async () => {
    const list: ConversationData[] = [
      {
        key: '1',
        label: 'Chat 1',
      },
    ];
    await sleep(500);
    const ref = React.createRef<any>();
    const Demo2 = createDemo();
    render(<Demo2 ref={ref} defaultConversations={list} />);
    await sleep(500);
    const conversation = conversationStoreHelper.getConversation('1');
    expect(conversation).toEqual(list[0]);
  });

  it('should set and get activeConversationKey correctly', async () => {
    const list: ConversationData[] = [
      { key: '1', label: 'Chat 1' },
      { key: '2', label: 'Chat 2' },
    ];
    const ref = React.createRef<any>();
    const { getByTestId } = render(<Demo ref={ref} defaultConversations={list} />);

    expect(ref.current?.activeConversationKey).toBe('');

    ref.current?.setActiveConversationKey('1');
    await sleep(500);
    expect(ref.current?.activeConversationKey).toBe('1');
    expect(getByTestId('active-key').textContent).toBe('1');

    ref.current?.setActiveConversationKey('2');
    await sleep(500);
    expect(ref.current?.activeConversationKey).toBe('2');
    expect(getByTestId('active-key').textContent).toBe('2');
  });

  it('should addConversation with prepend placement', async () => {
    const list: ConversationData[] = [{ key: '1', label: 'Chat 1' }];
    const ref = React.createRef<any>();
    render(<Demo ref={ref} defaultConversations={list} />);

    ref.current?.addConversation({ key: '2', label: 'Chat 2' }, 'prepend');
    await sleep(500);

    expect(ref.current?.conversations?.length).toEqual(2);
    expect(ref.current?.conversations[0].key).toBe('2');
    expect(ref.current?.conversations[1].key).toBe('1');
  });

  it('should addConversation with append placement (default)', async () => {
    const list: ConversationData[] = [{ key: '1', label: 'Chat 1' }];
    const ref = React.createRef<any>();
    render(<Demo ref={ref} defaultConversations={list} />);

    ref.current?.addConversation({ key: '2', label: 'Chat 2' }, 'append');
    await sleep(500);

    expect(ref.current?.conversations?.length).toEqual(2);
    expect(ref.current?.conversations[0].key).toBe('1');
    expect(ref.current?.conversations[1].key).toBe('2');
  });

  it('should setConversations replace all conversations', async () => {
    const initialList: ConversationData[] = [
      { key: '1', label: 'Chat 1' },
      { key: '2', label: 'Chat 2' },
    ];
    const newList: ConversationData[] = [
      { key: '3', label: 'Chat 3' },
      { key: '4', label: 'Chat 4' },
    ];
    const ref = React.createRef<any>();
    render(<Demo ref={ref} defaultConversations={initialList} />);

    expect(ref.current?.conversations?.length).toEqual(2);

    ref.current?.setConversations(newList);
    await sleep(500);

    expect(ref.current?.conversations?.length).toEqual(2);
    expect(ref.current?.conversations).toEqual(newList);
    expect(ref.current?.conversations.some((c: ConversationData) => c.key === '1')).toBe(false);
    expect(ref.current?.conversations.some((c: ConversationData) => c.key === '3')).toBe(true);
  });

  it('should getMessages return messages for conversation', async () => {
    const list: ConversationData[] = [{ key: 'test-conversation', label: 'Test Chat' }];
    const ref = React.createRef<any>();
    render(<Demo ref={ref} defaultConversations={list} />);

    const messages = ref.current?.getMessages('test-conversation');
    // getMessages should return array or undefined when no chat store exists
    expect(messages === undefined || Array.isArray(messages)).toBe(true);
  });

  it('should not add duplicate conversation', async () => {
    const list: ConversationData[] = [{ key: '1', label: 'Chat 1' }];
    const ref = React.createRef<any>();
    render(<Demo ref={ref} defaultConversations={list} />);

    const result = ref.current?.addConversation({ key: '1', label: 'Duplicate Chat' });
    await sleep(500);

    expect(result).toBe(false);
    expect(ref.current?.conversations?.length).toEqual(1);
    expect(ref.current?.conversations[0].label).toBe('Chat 1');
  });

  it('should return false when setting non-existent conversation', async () => {
    const list: ConversationData[] = [{ key: '1', label: 'Chat 1' }];
    const ref = React.createRef<any>();
    render(<Demo ref={ref} defaultConversations={list} />);

    const result = ref.current?.setConversation('non-existent', {
      key: 'non-existent',
      label: 'New Chat',
    });
    expect(result).toBe(false);
  });

  it('should return false when removing non-existent conversation', async () => {
    const list: ConversationData[] = [{ key: '1', label: 'Chat 1' }];
    const ref = React.createRef<any>();
    render(<Demo ref={ref} defaultConversations={list} />);

    const result = ref.current?.removeConversation('non-existent');
    expect(result).toBe(false);
  });
});
