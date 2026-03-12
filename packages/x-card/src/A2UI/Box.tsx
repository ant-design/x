import React from 'react';
import { BoxProps } from './types/box';
import Context from './Context';

const Box: React.FC<BoxProps> = ({ children, commands, components }) => {
  return (
    <Context.Provider value={{ components, commands }}>
      <div>{children}</div>
    </Context.Provider>
  );
};
export default Box;
