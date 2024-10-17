import { Flex, Typography, Upload, type UploadProps } from 'antd';
import classNames from 'classnames';
import React from 'react';

export interface PlaceholderConfig {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export interface PlaceholderProps {
  prefixCls: string;
  placeholder?: PlaceholderConfig | React.ReactElement;
  className: string;
  upload?: UploadProps;
}

export default function Placeholder(props: PlaceholderProps) {
  const { prefixCls, placeholder = {}, className, upload } = props;

  const placeholderCls = `${prefixCls}-placeholder`;

  const placeholderConfig = (placeholder || {}) as PlaceholderConfig;

  // ============================= Drag =============================
  const [dragIn, setDragIn] = React.useState(false);

  const onDragEnter = () => {
    setDragIn(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    // Leave the div should end
    if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as HTMLElement)) {
      return;
    }
    setDragIn(false);
  };

  const onDrop = () => {
    setDragIn(false);
  };

  // ============================ Render ============================
  const node = React.isValidElement(placeholder) ? (
    placeholder
  ) : (
    <Flex align="center" justify="center" vertical gap="small">
      <Typography.Text className={`${placeholderCls}-icon`}>
        {placeholderConfig.icon}
      </Typography.Text>
      <Typography.Title className={`${placeholderCls}-title`} level={5}>
        {placeholderConfig.title}
      </Typography.Title>
      <Typography.Text className={`${placeholderCls}-description`} type="secondary">
        {placeholderConfig.description}
      </Typography.Text>
    </Flex>
  );

  return (
    <div
      className={classNames(placeholderCls, className, {
        [`${placeholderCls}-drag-in`]: dragIn,
      })}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Upload.Dragger
        showUploadList={false}
        {...upload}
        style={{ padding: 0, border: 0, background: 'transparent' }}
      >
        {node}
      </Upload.Dragger>
    </div>
  );
}
