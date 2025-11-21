import React from 'react';
import type { BubbleItemType } from './interface';
export const BubbleContext = React.createContext<
  Partial<Pick<BubbleItemType, 'key' | 'status' | 'extraInfo'>>
>({});
