import { CloseOutlined } from '@ant-design/icons';
import React, { useMemo } from 'react';
import type { SkillType } from '../interface';

interface ClosableConfig {
  closeIcon?: React.ReactNode;
  onClose?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * 处理技能关闭配置的自定义 Hook
 * @param closableCollection - 关闭配置，可以是布尔值或配置对象
 * @param removeSkill - 移除技能的回调函数
 * @param componentCls - 组件样式类名前缀
 * @returns 包含关闭按钮节点的只读元组
 */
const useClosableConfig = (
  closableCollection: SkillType['closable'],
  removeSkill: () => void,
  componentCls: string,
): readonly [React.ReactNode] => {
  return useMemo(() => {
    if (!closableCollection) {
      return [null] as const;
    }

    const config: ClosableConfig =
      typeof closableCollection === 'boolean' ? {} : closableCollection;

    const handleClose: React.MouseEventHandler<HTMLDivElement> = (event) => {
      event.stopPropagation();
      removeSkill();
      config.onClose?.(event);
    };

    const closeIcon = config.closeIcon || (
      <CloseOutlined className={`${componentCls}-close-icon`} />
    );

    const closeNode = (
      <div
        className={`${componentCls}-close`}
        onClick={handleClose}
        role="button"
        aria-label="Close skill"
        tabIndex={0}
      >
        {closeIcon}
      </div>
    );

    return [closeNode] as const;
  }, [closableCollection, removeSkill, componentCls]);
};

export default useClosableConfig;
