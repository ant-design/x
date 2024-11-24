import React from 'react';

interface LoadingProps {
  prefixCls?: string;
}

const Loading: React.FC<Readonly<LoadingProps>> = ({ prefixCls }) => (
  <span className={`${prefixCls}-dot`}>
    <i className={`${prefixCls}-dot-item`} key={`item-${1}`} />
    <i className={`${prefixCls}-dot-item`} key={`item-${2}`} />
    <i className={`${prefixCls}-dot-item`} key={`item-${3}`} />
  </span>
);

export default Loading;
