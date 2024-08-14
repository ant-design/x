export interface PromptProps {
  /**
   * @desc 唯一标识用于区分每个提示项。
   * @descEN Unique identifier used to distinguish each prompt item.
   */
  key: string;

  /**
   * @desc 提示图标显示在提示项的左侧。
   * @descEN Prompt icon displayed on the left side of the prompt item.
   */
  icon?: React.ReactNode;

  /**
   * @desc 提示标签显示提示的主要内容。
   * @descEN Prompt label displaying the main content of the prompt.
   */
  label?: React.ReactNode;

  /**
   * @desc 提示描述提供额外的信息。
   * @descEN Prompt description providing additional information.
   */
  description?: React.ReactNode;

  /**
   * @desc 设置为 true 时禁用点击事件。
   * @descEN When set to true, click events are disabled.
   */
  disabled?: boolean;
}
