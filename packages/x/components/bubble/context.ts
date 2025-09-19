import React from 'react';
import { AnyObject } from '../_util/type';
import { MessageStatus } from './interface';

export const BubbleContext = React.createContext<{
  key?: string | number;
  status?: `${MessageStatus}`;
  extra?: AnyObject;
}>({});
