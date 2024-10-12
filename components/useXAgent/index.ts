import React from 'react';
import XAgent from '../x-tools/x-agent';

import type { XAgentOptions } from '../x-tools/x-agent';

export default function useXAgent<Message = string>(
  baseURL: string,
  options?: XAgentOptions<Message>,
) {
  const agent = React.useMemo(() => new XAgent<Message>(baseURL, options), [baseURL, options]);

  const loading = React.useSyncExternalStore(
    (callback) => {
      agent.on('loading', callback);
      return () => agent.remove('loading', callback);
    },
    () => agent.loading,
  );

  return [
    { loading, model: options?.model },
    { chat: agent.chat, on: agent.on, remove: agent.remove },
  ] as const;
}
