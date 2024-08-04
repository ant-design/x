export interface PromptProps {
  /**
   * @desc 唯一标识
   * @descEN Unique identifier
   */
  key: string;

  /**
   * @desc 提示图标
   * @descEN prompt icon
   */
  icon?: React.ReactNode;

  /**
   * @desc 提示
   * @descEN prompt
   */
  label?: React.ReactNode;
}

export interface PromptsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'title'> {
  /**
   * @desc 提示列表
   * @descEN prompt list
   */
  data?: PromptProps[];

  /**
   * @desc 提示列表标题
   * @descEN title
   */
  title?: React.ReactNode;

  /**
   * @desc Item 点击事件
   * @descEN click event
   */
  onClick?: (params: {
    item: PromptProps;
    domEvent: React.MouseEvent<HTMLElement, MouseEvent>;
  }) => void;

  /**
   * @desc 样式前缀
   * @descEN style prefix
   */
  prefixCls?: string;

  /**
   * @desc 根节点样式
   * @descEN root node style
   */
  rootClassName?: string;
}