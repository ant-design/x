import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import CSSMotion, { type MotionEventHandler } from 'rc-motion';
import * as React from 'react';

export interface SendHeaderContextProps {
  prefixCls: string;
}

export const SendHeaderContext = React.createContext<SendHeaderContextProps>({} as any);

export interface SenderHeaderProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const collapseHeight: MotionEventHandler = () => ({
  height: 0,
});
const expandedHeight: MotionEventHandler = (ele) => ({
  height: ele.scrollHeight,
});

export default function SenderHeader(props: SenderHeaderProps) {
  const { title, onOpenChange, open, children, className, style } = props;

  const { prefixCls } = React.useContext(SendHeaderContext);

  const headerCls = `${prefixCls}-header`;

  return (
    <CSSMotion
      motionEnter
      motionLeave
      motionName={`${headerCls}-motion`}
      leavedClassName={`${headerCls}-motion-hidden`}
      onEnterStart={collapseHeight}
      onEnterActive={expandedHeight}
      onLeaveStart={expandedHeight}
      onLeaveActive={collapseHeight}
      visible={open}
    >
      {({ className: motionClassName, style: motionStyle }) => {
        return (
          <div
            className={classNames(headerCls, motionClassName, className)}
            style={{
              ...motionStyle,
              ...style,
            }}
          >
            {/* Header */}
            <div
              className={
                // We follow antd naming standard here.
                // So the header part is use `-header` suffix.
                // Though its little bit weird for double `-header`.
                `${headerCls}-header`
              }
            >
              <div className={`${headerCls}-title`}>{title}</div>
              <div className={`${headerCls}-close`}>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  size="small"
                  onClick={() => {
                    onOpenChange?.(!open);
                  }}
                />
              </div>
            </div>

            {/* Content */}
            {children && <div className={`${headerCls}-content`}>{children}</div>}
          </div>
        );
      }}
    </CSSMotion>
  );
}
