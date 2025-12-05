import React from 'react';
import type { ActionsProps } from './interface';

export const ActionsContext = React.createContext<{
  prefixCls?: string;
  styles?: ActionsProps['styles'];
  classNames?: ActionsProps['classNames'];
}>(null!);
