import useLayoutEffect from 'rc-util/es/hooks/useLayoutEffect';
import React from 'react';
import type { BubbleAnimationOption, BubbleProps } from '../interface';

interface OutputData {
  text: string;
  taskId: number;
  id: string;
  done: boolean;
}

function getLCP(strs: string[]) {
  if (!strs || strs.length === 0) return '';
  return strs.reduce((prefix, str) => {
    let i = 0;
    while (i < prefix.length && i < str.length && prefix[i] === str[i]) {
      i++;
    }
    return prefix.slice(0, i);
  });
}

export function useTyping({
  streaming,
  content,
  typing,
  onTyping,
  onTypingComplete,
}: {
  streaming: boolean;
  content: string;
  typing: true | BubbleAnimationOption;
  onTyping?: BubbleProps['onTyping'];
  onTypingComplete?: BubbleProps['onTypingComplete'];
}) {
  const [output, setOutput] = React.useState<OutputData[]>([]);
  // 标记动画状态，由于是 ref，且有渲染时依赖，故应和 setOutput 成对出现
  const animating = React.useRef(false);
  const renderedData = React.useRef('');
  const currentTask = React.useRef(1);
  const raf = React.useRef(-1);
  // 正在执行的 excuteAnimation 处于闭包内，但需要获取最新的 streaming。
  const streamingRef = React.useRef(streaming);
  streamingRef.current = streaming;

  // typing legal check
  const memoedAnimationCfg = React.useMemo<BubbleAnimationOption>(() => {
    const baseCfg: BubbleAnimationOption = {
      effect: 'fade-in',
      interval: 100,
      step: 6,
      keepPrefix: false,
    };
    if (typing === true) return baseCfg;
    // exclude undefined value
    const { step = 6, interval = 100 } = typing;
    const isNumber = (num: any): num is number => typeof num === 'number';
    if (!isNumber(interval) || interval <= 0) {
      throw '[Bubble] invalid prop typing.interval, expect positive number.';
    }
    if (!isNumber(step) && !Array.isArray(step)) {
      throw '[Bubble] invalid prop typing.step, expect positive number or positive number array';
    }
    if (isNumber(step) && step <= 0) {
      throw '[Bubble] invalid prop typing.step, expect positive number';
    }
    if (Array.isArray(step)) {
      if (!isNumber(step[0]) || step[0] <= 0) {
        throw '[Bubble] invalid prop typing.step[0], expect positive number';
      }
      if (!isNumber(step[1]) || step[1] <= 0) {
        throw '[Bubble] invalid prop typing.step[1], expect positive number';
      }
      if (step[0] > step[1]) {
        throw '[Bubble] invalid prop typing.step, step[0] should less than step[1]';
      }
    }
    return { ...baseCfg, ...typing };
  }, [typing]);

  const typingSourceRef = React.useRef({
    content,
    interval: memoedAnimationCfg.interval!,
    step: memoedAnimationCfg.step!,
  });
  typingSourceRef.current = {
    content,
    interval: memoedAnimationCfg.interval!,
    step: memoedAnimationCfg.step!,
  };

  const getUid = () => Math.random().toString().slice(2);

  // scoped function use ref to reach newest state
  const excuteAnimation = React.useCallback(
    (taskId: number) => {
      let lastActivedFrameTime = 0;
      // start with LCP
      renderedData.current = memoedAnimationCfg.keepPrefix
        ? getLCP([typingSourceRef.current.content, renderedData.current])
        : '';
      setOutput(
        renderedData.current
          ? [{ text: renderedData.current, id: getUid(), taskId, done: true }]
          : [],
      );
      const fn = () => {
        if (taskId !== currentTask.current) return;
        const now = performance.now();
        const { content, interval, step } = typingSourceRef.current;

        if (now - lastActivedFrameTime < interval) {
          raf.current = requestAnimationFrame(fn);
          return;
        }
        const len = renderedData.current.length;
        const _step =
          typeof step === 'number'
            ? step
            : Math.floor(Math.random() * (step[1] - step[0])) + step[0];
        const nextText = content.slice(len, len + _step);
        if (!nextText) {
          // 流式传输 content，收敛同一个 stream 对应一次动画周期，依赖最新的 streaming
          if (streamingRef.current) {
            raf.current = requestAnimationFrame(fn);
            return;
          }
          setOutput((prev) => [
            {
              text: prev.map(({ text }) => text).join(''),
              id: getUid(),
              taskId,
              done: true,
            },
          ]);
          onTypingComplete?.(content);
          animating.current = false;
          currentTask.current++;
          return;
        }

        renderedData.current += nextText;
        const nextOutput = {
          id: getUid(),
          text: nextText,
          taskId,
          done: false,
        };
        setOutput((prev) => prev.concat(nextOutput));
        if (!animating.current) {
          animating.current = true;
        }
        lastActivedFrameTime = now;
        raf.current = requestAnimationFrame(fn);
        onTyping?.(renderedData.current, content);
      };
      fn();
    },
    [memoedAnimationCfg.keepPrefix, onTyping, onTypingComplete],
  );

  const reset = React.useCallback(() => {
    cancelAnimationFrame(raf.current);
    setOutput([]);
    renderedData.current = '';
    animating.current = false;
  }, []);

  useLayoutEffect(() => {
    if (!content) return reset();
    if (content === renderedData.current) return;
    // interrupt ongoing typing and restart new typing if content changed totally
    if (animating.current && !content.startsWith(renderedData.current)) {
      cancelAnimationFrame(raf.current);
      animating.current = false;
      requestAnimationFrame(() => excuteAnimation(++currentTask.current));
    } else if (animating.current === false) {
      // start new typing
      excuteAnimation(currentTask.current);
    }
  }, [content, excuteAnimation]);

  return { renderedData: output, animating: animating.current, memoedAnimationCfg };
}
