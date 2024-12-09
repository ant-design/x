import { useEffect, useRef } from 'react';

interface AutoScrollOptions {
  container: HTMLDivElement | null;
  autoScroll: boolean;
}

/**
 * 自动滚动 Hook，用于处理消息流的自动滚动
 * @param options 配置项
 * @param options.container 消息容器元素
 * @param options.autoScroll 是否启用自动滚动
 */
const useAutoScroll = ({ container, autoScroll }: AutoScrollOptions) => {
  // 用于存储是否应该自动滚动的状态
  const shouldAutoScrollRef = useRef(true);
  // 存储上一次内容高度，用于检测新内容
  const prevScrollHeightRef = useRef(0);
  // 标记是否是程序触发的滚动
  const isAutoScrollingRef = useRef(false);

  useEffect(() => {
    if (!container || !autoScroll) {
      return;
    }

    // 创建 MutationObserver 监听内容变化
    const mutationObserver = new MutationObserver(() => {
      const currentScrollHeight = container.scrollHeight;

      if (currentScrollHeight > prevScrollHeightRef.current) {
        if (shouldAutoScrollRef.current) {
          isAutoScrollingRef.current = true; // 标记即将进行自动滚动
          requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
            // 在下一帧重置标记，确保滚动事件能正确判断
            requestAnimationFrame(() => {
              isAutoScrollingRef.current = false;
            });
          });
        }
        prevScrollHeightRef.current = currentScrollHeight;
      }
    });

    // 监听滚动事件，判断用户是否手动滚动
    const handleScroll = () => {
      // 如果是自动滚动触发的，不处理
      if (isAutoScrollingRef.current) {
        return;
      }

      const { scrollTop, clientHeight, scrollHeight } = container;
      // 判断是否滚动到底部（允许 1px 的误差）
      const isScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) <= 1;

      shouldAutoScrollRef.current = isScrolledToBottom;
    };

    // 开始监听
    mutationObserver.observe(container, {
      childList: true, // 监听子节点变化
      subtree: true, // 监听所有后代节点变化
      characterData: true, // 监听文本内容变化
    });
    container.addEventListener('scroll', handleScroll);

    // 初始化滚动高度
    prevScrollHeightRef.current = container.scrollHeight;

    // 清理函数
    return () => {
      mutationObserver.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [container, autoScroll]);

  // 提供手动滚动到底部的方法
  const manualScrollToBottom = () => {
    if (container) {
      isAutoScrollingRef.current = true; // 标记手动滚动
      container.scrollTop = container.scrollHeight;
      shouldAutoScrollRef.current = true;
      // 重置标记
      requestAnimationFrame(() => {
        isAutoScrollingRef.current = false;
      });
    }
  };

  return {
    manualScrollToBottom,
  };
};

export default useAutoScroll;
