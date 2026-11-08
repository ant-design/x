import React from 'react';
import type { ChoiceProps } from './interface';

export interface ChoiceContextProps {
  prefixCls: string;
  mode: 'single' | 'multiple';
  disabled: boolean;
  indicator: 'check' | 'radio' | 'number' | 'none';
  selectedKeys: ChoiceProps['value'];
  isSelected: (key: string | number) => boolean;
  onItemClick: (item: import('./interface').ChoiceItemType, index: number) => void;
  classNames?: ChoiceProps['classNames'];
  styles?: ChoiceProps['styles'];
}

export const ChoiceContext = React.createContext<ChoiceContextProps>(null!);
