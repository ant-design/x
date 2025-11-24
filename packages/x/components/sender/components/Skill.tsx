import { Tooltip } from 'antd';
import React from 'react';
import useClosableConfig from '../hooks/use-closable-config';
import type { SkillType } from '../interface';

export interface SkillProps extends Omit<SkillType, 'value'> {
  prefixCls: string;
  removeSkill: () => void;
}

const Skill: React.FC<SkillProps> = ({ removeSkill, prefixCls, toolTip, closable, title }) => {
  const componentCls = `${prefixCls}-skill-tag`;
  const [closeNode] = useClosableConfig(closable, removeSkill, componentCls);
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
