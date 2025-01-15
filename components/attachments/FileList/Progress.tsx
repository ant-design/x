import { Progress as AntdProgress, theme } from 'antd';
import React from 'react';

export interface ProgressProps {
  prefixCls: string;
  percent: number;
}

export default function Progress(props: ProgressProps) {
  const { percent } = props;
  const { token } = theme.useToken();

  return (
    <AntdProgress
      type="circle"
      percent={percent}
      size={token.fontSizeHeading2 * 2}
      strokeColor="#FFF"
      trailColor="rgba(255, 255, 255, 0.3)"
      format={(ptg) => <span style={{ color: '#FFF' }}>{(ptg || 0).toFixed(0)}%</span>}
    />
  );
}
