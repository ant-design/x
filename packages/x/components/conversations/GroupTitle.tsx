import { RightOutlined } from '@ant-design/icons';
import type { CSSMotionProps } from '@rc-component/motion';
import CSSMotion from '@rc-component/motion';
import type { ConfigProviderProps, GetProp } from 'antd';
import { clsx } from 'clsx';
import React from 'react';
import type { GroupInfoType } from './hooks/useGroupable';

export interface GroupTitleProps {
  children?: React.ReactNode;
  className?: string;
  virtual?: boolean;
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

const GroupTitle = React.forwardRef<HTMLLIElement, GroupTitleProps>(
  ({ className, children, virtual }, ref) => {
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
      <li ref={ref} className={className}>
        <div
          className={clsx(`${prefixCls}-group-title`, {
            [`${prefixCls}-group-title-collapsible`]: mergeCollapsible,
          })}
          onClick={expandFun}
        >
          {labelNode && <div className={clsx(`${prefixCls}-group-label`)}>{labelNode}</div>}
          {mergeCollapsible && (
            <div
              className={clsx(
                `${prefixCls}-group-collapse-trigger `,
                `${prefixCls}-group-collapse-trigger-${groupOpen ? 'open' : 'close'}`,
              )}
            >
              <RightOutlined />
            </div>
          )}
        </div>
        {!virtual && (
          <CSSMotion {...collapseMotion} visible={mergeCollapsible ? groupOpen : true}>
            {({ className: motionClassName, style }, motionRef) => (
              <div className={clsx(motionClassName)} ref={motionRef} style={style}>
                {children}
              </div>
            )}
          </CSSMotion>
        )}
      </li>
    );
  },
);

if (process.env.NODE_ENV !== 'production') {
  GroupTitle.displayName = 'GroupTitle';
}

export default GroupTitle;
