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
        addConversation,
        removeConversation,
        setConversation,
        getConversation,
      } = useXConversations({
        defaultConversations: config.defaultConversations || [],
      });

      useImperativeHandle(ref, () => ({
        conversations,
        addConversation,
        removeConversation,
        setConversation,
        getConversation,
      }));
      return (
        <>
          <ul>
            {conversations.map((item) => (
              <li key={item.key}>{item.label}</li>
            ))}
          </ul>
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
});
