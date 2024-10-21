import { Progress as AntdProgress, theme } from 'antd';
import React from 'react';

export interface ProgressProps {
  prefixCls: string;
  percent: number;
}

const SVG_SIZE = 100;
const LINE_WIDTH = 10;

export default function Progress(props: ProgressProps) {
  const { percent, prefixCls } = props;
  const { token } = theme.useToken();

  const progressCls = `${prefixCls}-progress`;

  return (
    <AntdProgress
      type="circle"
      percent={percent}
      size={token.fontSizeHeading2 * 2}
      strokeColor="#FFF"
      trailColor="rgba(255, 255, 255, 0.3)"
      format={(ptg) => <span style={{ color: '#FFF' }}>{(ptg || 0).toFixed(0)}%</span>}
    />
    // <svg
    //   className={progressCls}
    //   viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <circle
    //     className={`${progressCls}-bg`}
    //     cx="50"
    //     cy="50"
    //     r="45"
    //     fill="none"
    //     stroke="rgba(255, 255, 255, 0.3)"
    //     strokeWidth={LINE_WIDTH}
    //   />
    //   <circle
    //     className={`${progressCls}-line`}
    //     cx="50"
    //     cy="50"
    //     r="45"
    //     fill="none"
    //     stroke="#FFF"
    //     strokeWidth={LINE_WIDTH}
    //     strokeDasharray={`${(percent * Math.PI * 2 * 45) / 100}, 9999`}
    //     strokeLinecap="round"
    //     rotate={-90}
    //   />
    // </svg>
  );
}
