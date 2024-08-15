import React from 'react';

export interface XAgent {
  /**
   * @desc Agent 的唯一标识符
   * @descEN The unique identifier of the Agent
   */
  id?: string;
  /**
   * @desc Agent 的名称
   * @descEN The name of the Agent
   */
  name?: string;
  /**
   * @desc Agent 所属的组织
   * @descEN The organization to which the Agent belongs
   */
  organization?: string;
}

export interface UseXAgentOptions extends XAgent {}

export type UseXAgent = (options: UseXAgentOptions) => [XAgent];

const useXAgent: UseXAgent = (options) => {
  const agentId = React.useId();

  const { id = agentId } = options;

  return [
    {
      id,
    },
  ];
};

export default useXAgent;
