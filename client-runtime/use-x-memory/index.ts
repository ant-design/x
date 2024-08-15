import React from 'react';

export interface XMemory {
  /**
   * @desc Memory 的唯一标识符
   * @descEN The unique identifier of the Memory
   */
  id?: string;
}

export interface UseXMemoryOptions extends XMemory {}

export type UseXMemory = (options: UseXMemoryOptions) => [XMemory];

const useXMemory: UseXMemory = (options) => {
  const memoryId = React.useId();

  const { id = memoryId } = options;

  return [
    {
      id,
    },
  ];
};

export default useXMemory;
