type ComponentName = `${Uppercase<string>}${string}`;

export interface BoxProps {
  children?: React.ReactNode;
  /**
   * @description 配置组件需要遵循 React 组件规范， 组件名称必须以大写字母开头
   */
  components?: Record<ComponentName, React.ComponentType<any>>;
}
