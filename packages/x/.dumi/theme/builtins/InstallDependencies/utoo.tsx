import { createStyles, css } from 'antd-style';
import classNames from 'classnames';
import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const useStyle = createStyles(() => ({
  iconWrap: css`
    display: inline-flex;
    align-items: center;
    line-height: 0;
    text-align: center;
    vertical-align: -0.125em;
  `,
}));

const UtooIcon: React.FC<IconProps> = (props) => {
  const { className, style } = props;
  const { styles } = useStyle();
  return (
    <span className={classNames(styles.iconWrap, className)} style={style}>
      <svg
        id="utoo"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 350 350"
        width="1em"
        height="1em"
      >
        <title>Utoo Logo</title>
        <g id="utoo_1" data-name="utoo_1">
          <g>
            <path
              style={{
                fill: '#fff',
              }}
              d="M1.16,108.38s-1.16,13-1.16,35.59v222.49s.38,19.84,20.62,19.84h211.68s76.05-83.93-23.08-150.94c0,0,37.46-187.86-42-212.33,0,0-46.08-1.51-46.5,67.39,0,0-22.08-99.48-92.45-42.26,0,0-26.3,29.93-27.12,60.22Z"
            />
            <path
              style={{
                fill: '#0b9dee',
              }}
              d="M61.11,219.17l-44.08,2.26S2.38,183.59.86,136.91c0,0-5.2-79.81,30.13-117.08,0,0,28.14-29.74,63.33-8.66,0,0,15.51,9.79,24.21,28.61,0,0,3.78-29.36,35.94-38.78,0,0,35.94-7.91,56.75,20.71,0,0,21.94,24.41,28,89,0,0,4.54,74.76-10.22,116.55l.14.99s32.96,21.18,46.21,65.6c0,0,16.65,53.08-21.94,91.86l-.72.59h-55.9s29.09-8.96,39.49-37.95c0,0,12.67-27.39-2.46-58.82,0,0-16.65-32.66-52.02-49.22l4.73-20.14s8.23-33.46,9.74-59.06c0,0,2.27-68.52-10.97-95.25,0,0-8.7-19.95-23.84-18.45,0,0-20.32,4.52-20.57,31.62,0,0,.04,53.18,3.16,83.11,0,0,4.82,33.6-11.92,41.79,0,0-20.43,9.88-30.65-18.07,0,0-3.41-7.34-1.99-26.54,0,0,1.42-53.93-3.97-79.62,0,0-4.82-28.24-24.12-27.67,0,0-19.01-.85-25.25,36.71,0,0-6.53,43.76,3.69,85.55,0,0,3.52,19.33,11.27,44.89Z"
            />
            <polygon
              style={{
                fill: '#404040',
              }}
              points="62.57 274.61 66.4 297.48 86.55 302.7 68.91 313.62 71.74 334.7 120.73 298.56 62.57 274.61"
            />
            <polygon
              style={{
                fill: '#404040',
              }}
              points="167.75 281.52 170.02 297.15 207.1 293.38 203.31 268.72 167.75 281.52"
            />
          </g>
        </g>
      </svg>
    </span>
  );
};

export default UtooIcon;
