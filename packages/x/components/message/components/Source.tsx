import { DownOutlined, RightOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

interface SourceProps {
  content?: React.ReactNode;
  prefixCls?: string;
  title?: React.ReactNode;
  items?: Array<{
    label: string;
    src: string;
    key?: string;
  }>;
}

const Source: React.FC<SourceProps> = ({ content, prefixCls, title, items }) => {
  const compCls = `${prefixCls}-source`;
  const [isExpand, setIsExpand] = useState(false);

  const ContentNode = () => {
    if (items) {
      return (
        <ul className={`${compCls}-list`}>
          {items.map((item) => (
            <li key={item.key} className={`${compCls}-list-item`}>
              <a className={`${compCls}-link`} href={item.src} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      );
    }

    return content;
  };

  return (
    <div className={compCls}>
      <div className={`${compCls}-title-wrapper`} onClick={() => setIsExpand(!isExpand)}>
        {isExpand ? <DownOutlined /> : <RightOutlined />}
        <span className={`${compCls}-title`}>{title}</span>
      </div>
      {isExpand ? (
        <div className={`${compCls}-content`}>
          <ContentNode />
        </div>
      ) : null}
    </div>
  );
};

export default Source;
