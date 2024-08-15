import React from 'react';

export interface XAction {
  /**
   * @desc Action 的唯一标识符
   * @descEN The unique identifier of the Action
   */
  id?: string;
}

export interface UseXActionOptions extends XAction {}

export type UseXAction = (options: UseXActionOptions) => [XAction];

const useXAction: UseXAction = (options) => {
  const actionId = React.useId();

  const { id = actionId } = options;

  return [
    {
      id,
    },
  ];
};

export default useXAction;
