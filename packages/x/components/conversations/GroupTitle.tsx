import { RightOutlined } from '@ant-design/icons';
import type { ConfigProviderProps, GetProp } from 'antd';
import classnames from 'classnames';
import type { CSSMotionProps } from 'rc-motion';
import CSSMotion from 'rc-motion';
import React from 'react';
import type { GroupInfoType } from './hooks/useGroupable';

export interface GroupTitleProps {
  children?: React.ReactNode;
  className?: string;
}
interface GroupTitleContextType {
  prefixCls?: GetProp<ConfigProviderProps, 'prefixCls'>;
  enableCollapse: boolean;
  expandedKeys: string[];
  onItemExpand: ((curKey: string) => void) | undefined;
  collapseMotion: CSSMotionProps;
  groupInfo: Omit<GroupInfoType, 'collapsible'> & { collapsible: boolean };
}
export const GroupTitleContext = React.createContext<GroupTitleContextType>(null!);

const GroupTitle: React.FC<GroupTitleProps> = ({ className, children }) => {
  const { prefixCls, groupInfo, enableCollapse, expandedKeys, onItemExpand, collapseMotion } =
    React.useContext(GroupTitleContext) || {};
  const { label, name, collapsible } = groupInfo || {};

  const labelNode =
    typeof label === 'function'
      ? label(name, {
          groupInfo,
        })
      : label || name;

  const mergeCollapsible = collapsible && enableCollapse;
  const expandFun = () => {
    if (mergeCollapsible) {
      onItemExpand?.(groupInfo.name);
    }
  };

  const groupOpen = mergeCollapsible && !!expandedKeys?.includes?.(name);

  return (
    <li className={className}>
      <div
        className={classnames(`${prefixCls}-group-title`, {
          [`${prefixCls}-group-title-collapsible`]: mergeCollapsible,
        })}
        onClick={expandFun}
      >
        {labelNode && <div className={classnames(`${prefixCls}-group-label`)}>{labelNode}</div>}
        {mergeCollapsible && (
          <div
            className={classnames(
              `${prefixCls}-group-collapse-trigger `,
              `${prefixCls}-group-collapse-trigger-${groupOpen ? 'open' : 'close'}`,
            )}
          >
            <RightOutlined />
          </div>
        )}
      </div>
      <CSSMotion {...collapseMotion} visible={mergeCollapsible ? groupOpen : true}>
        {({ className: motionClassName, style }, motionRef) => (
          <div className={classnames(motionClassName)} ref={motionRef} style={style}>
            {children}
          </div>
        )}
      </CSSMotion>
    </li>
  );
};

export default GroupTitle;
