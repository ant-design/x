import { createAgentEventFactory } from '../../protocol';
import { getAgentEntityKey } from '../../reducer';
import { AgentProtocolError, createAgentStore } from '..';

describe('createAgentStore', () => {
  it('dispatches batches with a single notification', () => {
    const events = createAgentEventFactory({ sessionId: 's', runId: 'r' });
    const store = createAgentStore();
    const listener = jest.fn();
    store.subscribe(listener);

    store.batch([
      events.create('run.started', {}),
      events.create('message.started', { messageId: 'm', role: 'assistant' }),
      events.create('message.delta', { messageId: 'm', delta: 'hello' }),
    ]);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().messages[getAgentEntityKey('r', 'm')].content).toBe('hello');
  });

  it('throws protocol errors in strict mode without committing invalid state', () => {
    const events = createAgentEventFactory({ sessionId: 's', runId: 'r' });
    const store = createAgentStore({ protocolMode: 'strict' });
    const orphan = events.create('message.delta', { messageId: 'missing', delta: 'x' });

    expect(() => store.dispatch(orphan)).toThrow(AgentProtocolError);
    expect(store.getSnapshot().issues).toEqual([]);
  });

  it('rolls back an entire strict batch and does not notify subscribers', () => {
    const events = createAgentEventFactory({ sessionId: 's', runId: 'r' });
    const store = createAgentStore({ protocolMode: 'strict' });
    const listener = jest.fn();
    store.subscribe(listener);

    expect(() =>
      store.batch([
        events.create('run.started', {}),
        events.create('message.delta', { messageId: 'missing', delta: 'x' }),
      ]),
    ).toThrow(AgentProtocolError);

    expect(store.getSnapshot()).toMatchObject({ runs: {}, messages: {}, issues: [] });
    expect(listener).not.toHaveBeenCalled();
  });

  it('supports reset, unsubscribe and destroy', () => {
    const events = createAgentEventFactory({ sessionId: 's', runId: 'r' });
    const store = createAgentStore();
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);

    store.dispatch(events.create('run.started', {}));
    store.reset();
    unsubscribe();
    store.reset();
    store.destroy();

    expect(listener).toHaveBeenCalledTimes(2);
    expect(store.getSnapshot().runs).toEqual({});
    expect(() => store.dispatch(events.create('run.started', {}))).toThrow(
      'AgentStore has been destroyed.',
    );
  });
});
