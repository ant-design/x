import { CloseOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { clsx } from 'clsx';
import React, { useMemo } from 'react';
import type { SkillType } from '../interface';

interface ClosableConfig {
  closeIcon?: React.ReactNode;
  onClose?: React.MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
}

export interface SkillProps extends SkillType {
  prefixCls: string;
  removeSkill: () => void;
}
const Skill: React.FC<SkillProps> = ({
  removeSkill,
  prefixCls,
  toolTip,
  closable,
  title,
  value,
}) => {
  const componentCls = `${prefixCls}-skill`;

  const closeNode = useMemo(() => {
    if (!closable) {
      return [null] as const;
    }

    const config: ClosableConfig = typeof closable === 'boolean' ? {} : closable;

    const handleClose: React.MouseEventHandler<HTMLDivElement> = (event) => {
      if (config.disabled) {
        return;
      }
      event.stopPropagation();
      removeSkill();

      config.onClose?.(event);
    };

    const closeIcon = config.closeIcon || (
      <CloseOutlined className={`${componentCls}-close-icon`} />
    );

    const closeNode = (
      <div
        className={clsx(`${componentCls}-close`, {
          [`${componentCls}-close-disabled`]: config.disabled,
        })}
        onClick={handleClose}
        role="button"
        aria-label="Close skill"
        tabIndex={0}
      >
        {closeIcon}
      </div>
    );

    return closeNode;
  }, [closable, removeSkill]);

  const mergeTitle = title || value;
  const titleNode = toolTip ? <Tooltip {...toolTip}>{mergeTitle}</Tooltip> : mergeTitle;

  return (
    <div className={`${componentCls}-wrapper`} contentEditable={false}>
      <div className={`${componentCls}-tag`} contentEditable={false} role="button" tabIndex={0}>
        <span className={`${componentCls}-tag-text`}>{titleNode}</span>
        {closeNode}
      </div>
      <div className={`${componentCls}-holder`} />
    </div>
  );
};

Skill.displayName = 'Skill';

export default Skill;
