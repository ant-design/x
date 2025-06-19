import { DownOutlined, UpOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import ThinkIcon from '../icons/think';

interface ThinkProps {
  content?: React.ReactNode;
  prefixCls?: string;
  title?: React.ReactNode;
  logo?: React.ReactNode;
}

const Think: React.FC<ThinkProps> = ({ content, prefixCls, title, logo }) => {
  const compCls = `${prefixCls}-think`;
  const [isExpand, setIsExpand] = useState(true);

  return (
    <div className={compCls}>
      <div className={`${compCls}-title-wrapper`} onClick={() => setIsExpand(!isExpand)}>
        {logo ? logo : <ThinkIcon className={`${compCls}-logo`} />}
        <span className={`${compCls}-title`}>{title}</span>
        {isExpand ? <UpOutlined /> : <DownOutlined />}
      </div>
      {isExpand ? <div className={`${compCls}-content`}>{content}</div> : null}
    </div>
  );
};

export default Think;
