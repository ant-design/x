import { Popover, PopoverProps } from 'antd';
import React from 'react';

export interface SupProps extends PopoverProps {
  prefixCls?: string;
  popoverTitle?: React.ReactNode;
  popoverContent?: React.ReactNode;
  content?: React.ReactNode;
}

const Markdown: React.FC<SupProps> = ({
  prefixCls,
  content,
  popoverTitle,
  popoverContent,
  ...restProps
}) => {
  const compCls = `${prefixCls}-sup`;

  return (
    <Popover {...restProps} title={popoverTitle} content={popoverContent}>
      <span className={compCls}>{content}</span>
    </Popover>
  );
};

export default Markdown;
