import * as React from 'react';
import type { BubbleProps, TypingOption } from '../interface';

export default function useTypingConfig(
  typing: BubbleProps['typing'],
): [enableTyping: boolean, step: number, interval: number] {
  return React.useMemo(() => {
    if (!typing) {
      return [false, 0, 0];
    }

    let baseConfig: Required<TypingOption> = {
      step: 1,
      interval: 100,
    };
    if (typeof typing === 'object') {
      baseConfig = { ...baseConfig, ...typing };
    }

    return [true, baseConfig.step, baseConfig.interval];
  }, [typing]);
}
