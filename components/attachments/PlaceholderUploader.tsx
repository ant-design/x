import { Flex, Typography, Upload, type UploadProps } from 'antd';
import classNames from 'classnames';
import React from 'react';

export interface PlaceholderProps {
  prefixCls: string;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className: string;
  upload?: UploadProps;
}

export default function Placeholder(props: PlaceholderProps) {
  const { prefixCls, icon, title, description, className, upload } = props;

  const placeholderCls = `${prefixCls}-placeholder`;

  return (
    <div className={classNames(placeholderCls, className)}>
      <Upload.Dragger {...upload} style={{ padding: 0, border: 0 }}>
        <Flex align="center" justify="center" vertical gap="small">
          <Typography.Text className={`${placeholderCls}-icon`}>{icon}</Typography.Text>
          <Typography.Title className={`${placeholderCls}-title`} level={5}>
            {title}
          </Typography.Title>
          <Typography.Text className={`${placeholderCls}-description`} type="secondary">
            {description}
          </Typography.Text>
        </Flex>
      </Upload.Dragger>
    </div>
  );
}
