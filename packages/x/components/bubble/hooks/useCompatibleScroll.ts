import { useCallback, useLayoutEffect, useRef } from 'react';

function isReverse(dom: HTMLElement) {
  return getComputedStyle(dom).flexDirection === 'column-reverse';
}

/**
 * Safari 兼容的倒序滚动视窗锁定与 scrollTo 方法适配
 * @param {HTMLElement} dom - 倒序滚动容器元素
 */
export function useCompatibleScroll(dom?: HTMLElement | null) {
  // 底部哨兵
  const sentinelRef = useRef<HTMLElement>(null);
  const sentineHeight = 10;
  const isAtBottom = useRef(true);
  const shouldLock = useRef(false);
  const lockedScrollBottomPos = useRef(0);
  const scrolling = useRef<ReturnType<typeof setTimeout>>(undefined);
  const callOnScrollNotNative = useRef(false);
  const isScrollToBottom = useRef<boolean>(false);

  // 初始化哨兵元素
  useLayoutEffect(() => {
    if (!dom) return;
    if (!sentinelRef.current) {
      const sentinel = document.createElement('div');
      // sentinel.style.position = 'absolute';
      sentinel.style.bottom = '0';
      sentinel.style.flexShrink = '0';
      sentinel.style.pointerEvents = 'none';
      sentinel.style.height = `${sentineHeight}px`;
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
      if (!dom) return;
      // 内容变化时正在滚动，交互优先，不锁定视窗
      if (scrolling.current) {
        // 动态处理滚动到底
        isScrollToBottom.current &&
          requestAnimationFrame(() =>
            dom.scrollTo({
              top: isReverse(dom) ? 0 : dom.scrollHeight,
              behavior: 'instant',
            }),
          );
        return;
      }
      isReverse(dom) && shouldLock.current && enforceScrollLock();
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
      if (sentinelRef.current?.parentNode) {
        sentinelRef.current.parentNode.removeChild(sentinelRef.current);
        sentinelRef.current = null;
      }
    };
  }, [dom]);

  const setTimer = useCallback(() => {
    scrolling.current = setTimeout(() => {
      clearTimeout(scrolling.current);
      scrolling.current = undefined;
      isScrollToBottom.current = false;
    }, 50);
  }, []);

  const handleScroll = useCallback(
    (e: Event) => {
      const target = e.target as HTMLElement;
      if (!isReverse(target)) return;
      const { scrollTop, scrollHeight } = target;
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
      setTimer();
    },
    [dom],
  );

  useLayoutEffect(() => {
    if (!dom) return;
    dom.addEventListener('scroll', handleScroll, { capture: true });
    return () => dom?.removeEventListener('scroll', handleScroll, { capture: true });
  }, [dom, handleScroll]);

  // 强制锁定滚动位置
  const enforceScrollLock = useCallback(() => {
    /**
     * 同时发生滚动+内容变化，在 safari 内有两种可选行为：
     * 1、强制锁定视窗，可视内容不变，但会造成滚动抖动。
     * 2、不锁定视窗，内容会变化。
     * 出于鲁棒性考虑，选择行为2，在滚动结束后再锁视窗
     * 最终效果：
     * 1、滚动+内容变化同时发生，表现为浏览器默认行为
     * 2、仅内容变化，表现为 chrome 行为（视窗锁定）（无论是否贴底）
     **/
    const targetScroll = lockedScrollBottomPos.current - dom!.scrollHeight;
    dom!.scrollTop = targetScroll;
    // 赋值 scrollTop 会立即触发 onScroll
    callOnScrollNotNative.current = true;
  }, [dom]);

  const reset = useCallback(() => {
    isAtBottom.current = true;
    shouldLock.current = false;
    lockedScrollBottomPos.current = dom?.scrollHeight || 0;
  }, [dom]);

  const scrollTo = useCallback(
    (
      option?: ScrollToOptions & {
        intoView?: ScrollIntoViewOptions;
        intoViewDom?: HTMLElement;
      },
    ) => {
      if (!dom) return;
      const { top, intoView, intoViewDom } = option || {};
      if (intoViewDom) {
        intoViewDom.scrollIntoView(intoView);
      } else {
        dom.scrollTo(option);
      }
      if (isReverse(dom)) {
        if ((top as any) === 'bottom' || (top as any) >= -sentineHeight) {
          isScrollToBottom.current = true;
        } else if (intoViewDom) {
          isScrollToBottom.current = dom.childNodes[1] === intoViewDom;
        } else {
          isScrollToBottom.current = false;
        }
      } else {
        if (
          (top as any) === 'bottom' ||
          (top as any) >= dom.scrollHeight - dom.clientHeight - sentineHeight
        ) {
          isScrollToBottom.current = true;
        } else if (intoViewDom) {
          isScrollToBottom.current = dom.lastElementChild === intoViewDom;
        } else {
          isScrollToBottom.current = false;
        }
      }
      // 立即进入滚动状态，提升 api 滚动行为的优先级，避免在同时存在内容增长的情况下，api 滚动行为被强制锁定视窗的行为覆盖
      if (!scrolling.current) {
        setTimer();
      }
    },
    [dom],
  );

  return {
    reset,
    scrollTo,
  };
}
