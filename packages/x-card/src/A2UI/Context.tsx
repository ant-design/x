import { createContext } from 'react';
import { BoxProps } from './types/box';

interface IBoxContext {
  components: BoxProps['components'];
  commands?: BoxProps['commands'];
}

const BoxContext = createContext<IBoxContext>({
  components: {},
});

export default BoxContext;
