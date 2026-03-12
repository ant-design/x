import { createContext } from 'react';
import { BoxProps } from './types/box';

interface IBoxContext {
  components: BoxProps['components'];
}

const BoxContext = createContext<IBoxContext>({
  components: {},
});

export default BoxContext;
