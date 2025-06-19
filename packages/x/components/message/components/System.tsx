import classnames from 'classnames';
import React, { useMemo } from 'react';

interface SystemProps {
  content?: React.ReactNode;
  prefixCls?: string;
  divider?: boolean | string;
}

const System: React.FC<SystemProps> = ({ content, prefixCls, divider = true }) => {
  const compCls = `${prefixCls}-system`;

  const hrStyle = useMemo(() => {
    if (!divider) {
      return { display: 'none' };
    }
    if (typeof divider === 'string' && divider !== 'double') {
      return { borderStyle: `${divider} none none` };
    }
    return {};
  }, [divider]);

  const hrClassName = classnames(`${compCls}-divider`, {
    [`${compCls}-divider-double`]: divider === 'double',
  });

  return (
    <div className={compCls}>
      <hr className={hrClassName} style={hrStyle} />
      <div className={`${compCls}-content`}>{content}</div>
      <hr className={hrClassName} style={hrStyle} />
    </div>
  );
};

export default System;
