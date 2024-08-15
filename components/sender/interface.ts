export type EnterType = 'enter' | 'shiftEnter' | string | false;

type Component<P> =
  | React.ComponentType<P>
  | React.ForwardRefExoticComponent<P>
  | React.FC<P>
  | keyof React.ReactHTML;

export type CustomizeComponent<T = any> = Component<T>;
