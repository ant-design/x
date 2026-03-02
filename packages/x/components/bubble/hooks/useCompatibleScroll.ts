import { useCallback, useLayoutEffect, useRef } from 'react';

function isReverse(scrollDom: HTMLElement) {
  return getComputedStyle(scrollDom).flexDirection === 'column-reverse';
}

/**
 * Safari 兼容的倒序滚动视窗锁定与 scrollTo 方法适配
 * @param {HTMLElement} scrollDom - 倒序滚动元素
 * @param {HTMLElement} contentDom - 滚动内容容器元素
 */
export function useCompatibleScroll(
  scrollDom?: HTMLElement | null,
  contentDom?: HTMLElement | null,
) {
  // 底部哨兵
  const sentinelRef = useRef<HTMLElement>(null);
  const sentinelHeight = 10;
  const isAtBottom = useRef(true);
  const shouldLock = useRef(false);
  const lockedScrollBottomPos = useRef(0);
  const scrolling = useRef<ReturnType<typeof setTimeout>>(undefined);
  const callOnScrollNotNative = useRef(false);
  const isScrollToBottom = useRef<boolean>(false);

  // 初始化哨兵元素
  useLayoutEffect(() => {
    if (!scrollDom || !contentDom) return;
    if (!sentinelRef.current) {
      const sentinel = document.createElement('div');
      // sentinel.style.position = 'absolute';
      sentinel.style.bottom = '0';
      sentinel.style.flexShrink = '0';
      sentinel.style.pointerEvents = 'none';
      sentinel.style.height = `${sentinelHeight}px`;
      sentinel.style.visibility = 'hidden';

      scrollDom.insertBefore(sentinel, scrollDom.firstChild);
      sentinelRef.current = sentinel;
    }
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isAtBottom.current = entry.isIntersecting;
        shouldLock.current = !entry.isIntersecting;
      },
      { root: scrollDom, threshold: 0.0 },
    );

    intersectionObserver.observe(sentinelRef.current);

    // 监听 DOM 内容变化，锁定视窗
    const resizeObserver = new ResizeObserver(() => {
      if (!scrollDom) return;
      // 内容变化时正在滚动，交互优先，不锁定视窗
      if (scrolling.current) {
        // 动态处理滚动到底
        isScrollToBottom.current &&
          requestAnimationFrame(() =>
            scrollDom.scrollTo({
              top: isReverse(scrollDom) ? 0 : scrollDom.scrollHeight,
              behavior: 'instant',
            }),
          );
        return;
      }
      isReverse(scrollDom) && shouldLock.current && enforceScrollLock();
    });

    resizeObserver.observe(contentDom);

    return () => {
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      clearTimeout(scrolling.current);
      if (sentinelRef.current?.parentNode) {
        sentinelRef.current.parentNode.removeChild(sentinelRef.current);
        sentinelRef.current = null;
      }
    };
  }, [scrollDom, contentDom]);

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
    [setTimer],
  );

  useLayoutEffect(() => {
    if (!scrollDom) return;
    scrollDom.addEventListener('scroll', handleScroll, { capture: true });
    return () => scrollDom?.removeEventListener('scroll', handleScroll, { capture: true });
  }, [scrollDom, handleScroll]);

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
    const targetScroll = lockedScrollBottomPos.current - scrollDom!.scrollHeight;
    scrollDom!.scrollTop = targetScroll;
    // 赋值 scrollTop 会立即触发 onScroll
    callOnScrollNotNative.current = true;
  }, [scrollDom]);

  const reset = useCallback(() => {
    isAtBottom.current = true;
    shouldLock.current = false;
    lockedScrollBottomPos.current = scrollDom?.scrollHeight || 0;
  }, [scrollDom]);

  const scrollTo = useCallback(
    (
      option?: ScrollToOptions & {
        intoView?: ScrollIntoViewOptions;
        intoViewDom?: HTMLElement;
      },
    ) => {
      if (!scrollDom || !contentDom) return;
      const { top, intoView, intoViewDom } = option || {};
      if (isReverse(scrollDom)) {
        if (top !== undefined && top >= -sentinelHeight) {
          isScrollToBottom.current = true;
        } else if (intoViewDom && intoView?.block === 'end') {
          isScrollToBottom.current = contentDom.lastElementChild === intoViewDom;
        } else {
          isScrollToBottom.current = false;
        }
      } else {
        if (
          top !== undefined &&
          top >= scrollDom.scrollHeight - scrollDom.clientHeight - sentinelHeight
        ) {
          isScrollToBottom.current = true;
        } else if (intoViewDom && intoView?.block === 'end') {
          isScrollToBottom.current = contentDom.lastElementChild === intoViewDom;
        } else {
          isScrollToBottom.current = false;
        }
      }
      // 立即进入滚动状态，提升 api 滚动行为的优先级，避免在同时存在内容增长的情况下，api 滚动行为被强制锁定视窗的行为覆盖
      if (!scrolling.current) {
        setTimer();
      }
      if (intoViewDom) {
        intoViewDom.scrollIntoView(intoView);
      } else {
        scrollDom.scrollTo(option);
      }
    },
    [scrollDom, contentDom],
  );

  return {
    reset,
    scrollTo,
  };
}
