import React from 'react';
import { MessageStatus } from './interface';

export const BubbleContext = React.createContext<{
  key?: string | number;
  status?: `${MessageStatus}`;
}>({});
