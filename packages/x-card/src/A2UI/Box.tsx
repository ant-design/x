import React from 'react';
import { BoxProps } from './types/box';
import Context from './Context';

const Box: React.FC<BoxProps> = ({ children, commands, components, onAction }) => {
  return (
    <Context.Provider value={{ components, commands, onAction }}>
      <div>{children}</div>
    </Context.Provider>
  );
};
export default Box;
