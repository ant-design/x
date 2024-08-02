export type AnyObject = Record<PropertyKey, any>;

export interface BaseProps {
  /**
   * @desc 自定义前缀
   * @descEN Prefix
   */
  prefixCls?: string;

  /**
   * @desc 自定义根类名
   * @descEN Custom class name
   */
  rootClassName?: string;
}
