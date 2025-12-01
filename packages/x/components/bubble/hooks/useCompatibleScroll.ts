import { useCallback, useEffect, useRef } from 'react';

/**
 * Safari 兼容的倒序滚动视窗锁定
 * @param {HTMLElement} dom - 倒序滚动容器元素（flex-direction: column-reverse）
 */
export function useCompatibleScroll(dom?: HTMLElement | null) {
  // 底部哨兵
  const sentinelRef = useRef<HTMLElement>(null);
  const isAtBottom = useRef(true);
  const shouldLock = useRef(false);
  const lockedScrollBottomPos = useRef(0);
  const scrolling = useRef<ReturnType<typeof setTimeout>>(undefined);
  const callOnScrollNotNative = useRef(false);

  const disable = !dom || getComputedStyle(dom).flexDirection !== 'column-reverse';

  // 初始化哨兵元素
  useEffect(() => {
    if (disable) return;
    if (!sentinelRef.current) {
      const sentinel = document.createElement('div');
      // sentinel.style.position = 'absolute';
      sentinel.style.bottom = '0';
      sentinel.style.flexShrink = '0';
      sentinel.style.pointerEvents = 'none';
      sentinel.style.height = '10px';
      sentinel.style.visibility = 'hidden';

      dom.insertBefore(sentinel, dom.firstChild);
      sentinelRef.current = sentinel;
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isAtBottom.current = entry.isIntersecting;
        shouldLock.current = !entry.isIntersecting;
      },
      { root: dom, threshold: 0.0 },
    );

    intersectionObserver.observe(sentinelRef.current);

    // 监听 DOM 内容变化，锁定视窗
    const mutationObserver = new MutationObserver(() => {
      shouldLock.current && !disable && enforceScrollLock();
    });

    mutationObserver.observe(dom, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
      clearTimeout(scrolling.current);
      if (sentinelRef.current && sentinelRef.current.parentNode) {
        sentinelRef.current.parentNode.removeChild(sentinelRef.current);
        sentinelRef.current = null;
      }
    };
  }, [dom, disable]);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight } = dom!;
    // 倒序， top 在变化，但 bottom 固定
    lockedScrollBottomPos.current = scrollHeight + scrollTop;
    // 检测并恢复自然触发状态
    if (callOnScrollNotNative.current) {
      callOnScrollNotNative.current = false;
      return;
    }
    if (scrolling.current) {
      clearTimeout(scrolling.current);
    }
    scrolling.current = setTimeout(() => {
      clearTimeout(scrolling.current);
      scrolling.current = undefined;
    }, 50);
  }, [dom]);

  useEffect(() => {
    if (!disable) {
      dom.addEventListener('scroll', handleScroll, { capture: true });
    }
    return () => dom?.removeEventListener('scroll', handleScroll, { capture: true });
  }, [dom, disable, handleScroll]);

  // 强制锁定滚动位置
  const enforceScrollLock = useCallback(() => {
    /**
     * 同时发生滚动+内容变化，有两种可选行为：
     * 1、强制锁定视窗，可视内容不变，但会造成滚动抖动。
     * 2、不锁定视窗，内容会变化（safari行为）。
     * 出于鲁棒性考虑，选择行为2，在滚动结束后再锁视窗
     * 最终效果：
     * 1、滚动+内容变化同时发生，表现为 safari 行为
     * 2、仅内容变化，表现为 chrome 行为（无论是否贴底）
     **/
    // requestAnimationFrame(() => {
    const targetScroll = lockedScrollBottomPos.current - dom!.scrollHeight;
    dom!.scrollTop = targetScroll;
    // 赋值 scrollTop 会立即触发 onScroll
    callOnScrollNotNative.current = true;
    // });
  }, [dom]);

  const resetToBottom = useCallback(() => {
    if (disable) return;
    isAtBottom.current = true;
    shouldLock.current = false;
    lockedScrollBottomPos.current = dom.scrollHeight;
  }, [dom, disable]);

  return {
    resetToBottom,
  };
}
