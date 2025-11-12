import type { SpinProps } from 'antd';
import { Flex, Skeleton, Spin } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { FileCardProps } from '../FileCard';
import ImageIcon from './ImageIcon';
import usePercent from './usePercent';

export type ImageLoadingProps = SpinProps & {
  prefixCls?: string;
  style?: React.CSSProperties;
  className?: string;
  spinProps?: FileCardProps['spinProps'];
};

const ImageLoading: React.FC<ImageLoadingProps> = (props) => {
  const { style, className, prefixCls, percent = 'auto', spinProps } = props;
  const [mergedPercent, percentText] = usePercent(true, percent);
  const mergeSinkProps = {
    size: 'default',
    showText: true,
    icon: <ImageIcon color="rgba(0,0,0,.45)" size={spinProps?.size || 'default'} />,
    ...spinProps,
  };
  return (
    <div className={classnames(`${prefixCls}-image-loading`, className)} style={style}>
      <Skeleton.Node rootClassName={classnames(`${prefixCls}-image-skeleton`)} active>
        <Flex
          className={classnames(`${prefixCls}-image-spin`, {
            [`${prefixCls}-image-spin-${mergeSinkProps.size}`]: mergeSinkProps.size,
          })}
          align="center"
          gap="small"
        >
          <Spin percent={mergedPercent} {...(spinProps as SpinProps)} />
          {mergeSinkProps.showText && (
            <div className={`${prefixCls}-image-spin-text`}>{percentText}</div>
          )}
        </Flex>
        {mergeSinkProps.icon}
      </Skeleton.Node>
    </div>
  );
};

export default ImageLoading;
