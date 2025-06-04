import { useCallback, useEffect, useRef, useState } from 'react';
import { MarkdownProps } from '../interface';

const useBuffer = (input: string, typing: MarkdownProps['buffer']) => {
  const [displayContent, setDisplayContent] = useState('');
  const currentIndexRef = useRef(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const interval = (typeof typing === 'object' ? typing?.interval : undefined) ?? 100;

  const getStep = useCallback(
    (remaining: number) => {
      const defaultStep = Math.max(Math.floor(remaining / 2), 5);
      return typing && typeof typing === 'object' && typing?.step ? typing.step : defaultStep;
    },
    [typing],
  );

  const showNextCharacters = useCallback(() => {
    // 如果输入字符串发生变化了，移除缓存
    if (input.indexOf(displayContent) === -1) {
      setDisplayContent(input);
      currentIndexRef.current = 0;
      return;
    }

    const remaining = input.length - currentIndexRef.current;
    const step = getStep(remaining);
    currentIndexRef.current += step;

    if (currentIndexRef.current < input.length) {
      timeoutIdRef.current = setTimeout(showNextCharacters, interval);
    }
  }, [input, getStep, interval]);

  useEffect(() => {
    if (!typing || !input) {
      return;
    }
    // 清除之前的定时器
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    // 开始展示字符
    showNextCharacters();
    // 清除定时器
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [typing, input, showNextCharacters]);

  if (!typing || !input) {
    return input || '';
  }
  return displayContent;
};

export default useBuffer;
