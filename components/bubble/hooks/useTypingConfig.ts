import * as React from 'react';
import type { BubbleProps, TypingOption } from '../interface';

function useTypingConfig(typing: BubbleProps['typing']) {
  return React.useMemo<
    [enableTyping: boolean, step: number, interval: number, suffix: React.ReactNode]
  >(() => {
    if (!typing) {
      return [false, 0, 0, null];
    }

    let baseConfig: Required<TypingOption> = {
      step: 1,
      interval: 50,
      // set default suffix is empty
      suffix: '',
    };

    if (typeof typing === 'object') {
      baseConfig = { ...baseConfig, ...typing };
    }

    return [true, baseConfig.step, baseConfig.interval, baseConfig.suffix];
  }, [typing]);
}

export default useTypingConfig;
