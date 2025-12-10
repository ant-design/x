import { ChatMessagesStore } from '../store';

describe('ChatMessagesStore', () => {
  let store: ChatMessagesStore<{ id: string; message: string }>;

  beforeEach(() => {
    store = new ChatMessagesStore<{ id: string; message: string }>([]);
    jest.useFakeTimers();
  });

  afterEach(() => {
    store.destroy();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('destroy method', () => {
    it('should clear throttle timer when destroy is called', () => {
      // 设置一些消息来触发throttle逻辑
      store.setMessages([{ id: '1', message: 'test' }]);

      // 快速连续调用以触发throttle
      store.setMessages([{ id: '1', message: 'test1' }]);
      store.setMessages([{ id: '1', message: 'test2' }]);

      // 验证throttleTimer被设置
      expect((store as any).throttleTimer).toBeTruthy();
      expect((store as any).pendingEmit).toBe(true);

      // 调用destroy
      store.destroy();

      // 验证状态被清理
      expect((store as any).throttleTimer).toBeNull();
      expect((store as any).pendingEmit).toBe(false);
      expect((store as any).listeners).toEqual([]);
    });

    it('should not throw error when destroy is called without active timer', () => {
      // 确保没有活跃的timer
      expect((store as any).throttleTimer).toBeNull();

      // 调用destroy不应抛出错误
      expect(() => {
        store.destroy();
      }).not.toThrow();

      // 验证状态被正确设置
      expect((store as any).throttleTimer).toBeNull();
      expect((store as any).pendingEmit).toBe(false);
      expect((store as any).listeners).toEqual([]);
    });

    it('should clear listeners array when destroy is called', () => {
      // 添加一些监听器
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      store.subscribe(listener1);
      store.subscribe(listener2);

      expect((store as any).listeners).toHaveLength(2);

      // 调用destroy
      store.destroy();

      // 验证listeners被清空
      expect((store as any).listeners).toEqual([]);
    });
  });

  describe('throttledEmitListeners with pendingEmit', () => {
    it('should flush pending updates when throttle timer expires', () => {
      const listener = jest.fn();
      store.subscribe(listener);

      // 快速连续调用以触发throttle
      store.setMessages([{ id: '1', message: 'test1' }]);
      store.setMessages([{ id: '1', message: 'test2' }]);
      store.setMessages([{ id: '1', message: 'test3' }]);

      // 验证pendingEmit为true
      expect((store as any).pendingEmit).toBe(true);
      expect(listener).toHaveBeenCalledTimes(1); // 第一次立即触发

      // 快进时间让throttle timer触发
      jest.runAllTimers();

      // 验证pendingEmit被重置且监听器被再次调用
      expect((store as any).pendingEmit).toBe(false);
      expect(listener).toHaveBeenCalledTimes(2); // 第一次立即触发 + 第二次flush
    });

    it('should not flush pending updates when destroy is called before timer expires', () => {
      const listener = jest.fn();
      store.subscribe(listener);

      // 触发throttle
      store.setMessages([{ id: '1', message: 'test1' }]);
      store.setMessages([{ id: '1', message: 'test2' }]);

      expect((store as any).pendingEmit).toBe(true);
      expect(listener).toHaveBeenCalledTimes(1);

      // 在timer到期前调用destroy
      store.destroy();

      // 快进时间
      jest.runAllTimers();

      // 验证没有额外的监听器调用
      expect(listener).toHaveBeenCalledTimes(1);
      expect((store as any).pendingEmit).toBe(false);
    });
  });

  describe('subscribe cleanup', () => {
    it('should clear throttle timer when last listener unsubscribes', () => {
      const listener = jest.fn();
      const unsubscribe = store.subscribe(listener);

      // 触发throttle
      store.setMessages([{ id: '1', message: 'test' }]);
      store.setMessages([{ id: '1', message: 'test2' }]);

      expect((store as any).throttleTimer).toBeTruthy();
      expect((store as any).pendingEmit).toBe(true);

      // 取消订阅最后一个监听器
      unsubscribe();

      // 验证timer被清理
      expect((store as any).throttleTimer).toBeNull();
      expect((store as any).pendingEmit).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple destroy calls gracefully', () => {
      // 第一次调用
      store.destroy();

      // 第二次调用不应抛出错误
      expect(() => {
        store.destroy();
      }).not.toThrow();

      // 第三次调用
      expect(() => {
        store.destroy();
      }).not.toThrow();
    });

    it('should handle destroy with null throttleTimer', () => {
      // 确保throttleTimer为null
      expect((store as any).throttleTimer).toBeNull();

      // 设置pendingEmit为true
      (store as any).pendingEmit = true;

      // 调用destroy
      store.destroy();

      // 验证pendingEmit被重置
      expect((store as any).pendingEmit).toBe(false);
    });
  });
});
