import { useCallback, useEffect, useRef } from 'react';

export function isSafari() {
  const ua = navigator.userAgent;
  return (
    /Safari/.test(ua) &&
    !/Chrome/.test(ua) &&
    !/Edge/.test(ua) &&
    !/Edg/.test(ua) &&
    !/Opera/.test(ua)
  );
}

/**
 * Safari 兼容的倒序滚动视窗锁定
 * @param {HTMLElement} dom - 倒序滚动容器元素（flex-direction: column-reverse）
 */
export function useCompatibleScroll(
  dom?: HTMLElement | null,
  options?: {
    onlySafari?: boolean;
  },
) {
  const { onlySafari = true } = options || {};
  // 底部哨兵
  const sentinelRef = useRef<HTMLElement>(null);
  const isAtBottom = useRef(true);
  const shouldLock = useRef(false);
  const lockedScrollBottomPos = useRef(0);

  const disable =
    !dom || getComputedStyle(dom).flexDirection !== 'column-reverse' || (onlySafari && !isSafari());

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
    };
  }, [dom, disable]);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight } = dom!;
    // 倒序， top 在变化，但 bottom 固定
    lockedScrollBottomPos.current = scrollHeight + scrollTop;
  }, [disable]);

  useEffect(() => {
    if (!disable) {
      dom.addEventListener('scroll', handleScroll, { capture: true });
    }
    return () => dom?.removeEventListener('scroll', handleScroll, { capture: true });
  }, [dom, disable, handleScroll]);

  // 强制锁定滚动位置
  const enforceScrollLock = useCallback(() => {
    const targetScroll = lockedScrollBottomPos.current - dom!.scrollHeight;

    // why: 同步设置 dom.scrollTop 会意外得到不符合 targetScroll - dom.scrollHeight 预期的值，导致视窗贴顶
    // dom.scrollTop = targetScroll - dom.scrollHeight;

    // TODO: 同时在滚动的话，存在较为明显的微小抖动
    requestAnimationFrame(() => {
      if (!dom) return;
      dom.scrollTop = targetScroll;
    });
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
