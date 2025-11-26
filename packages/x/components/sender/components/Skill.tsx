import { CloseOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import React, { useMemo } from 'react';
import type { SkillType } from '../interface';

interface ClosableConfig {
  closeIcon?: React.ReactNode;
  onClose?: React.MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
}

export interface SkillProps extends Omit<SkillType, 'value'> {
  prefixCls: string;
  removeSkill: () => void;
}

const Skill: React.FC<SkillProps> = ({ removeSkill, prefixCls, toolTip, closable, title }) => {
  const componentCls = `${prefixCls}-skill-tag`;

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
        className={classnames(`${componentCls}-close`, {
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
  const titleNode = toolTip ? <Tooltip {...toolTip}>{title}</Tooltip> : title;
  return (
    <div className={componentCls} role="button" aria-label={`Skill: ${title}`} tabIndex={0}>
      <span className={`${componentCls}-text`}>{titleNode}</span>
      {closeNode}
    </div>
  );
};

Skill.displayName = 'Skill';

export default Skill;
