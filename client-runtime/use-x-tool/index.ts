import React from 'react';

export interface XTool {
  /**
   * @desc Tool 的唯一标识符
   * @descEN The unique identifier of the Tool
   */
  id?: string;
}

export interface UseXToolOptions extends XTool {}

export type UseXTool = (options: UseXToolOptions) => [XTool];

const useXTool: UseXTool = (options) => {
  const toolId = React.useId();

  const { id = toolId } = options;

  return [
    {
      id,
    },
  ];
};

export default useXTool;
