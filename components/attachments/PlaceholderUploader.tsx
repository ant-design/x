import { Flex, Typography, Upload, type UploadProps } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { AttachmentContext } from './context';

export interface PlaceholderConfig {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export type PlaceholderType = PlaceholderConfig | React.ReactElement;

export interface PlaceholderProps {
  prefixCls: string;
  placeholder?: PlaceholderType;
  upload?: UploadProps;
}

function Placeholder(props: PlaceholderProps, ref: React.Ref<HTMLDivElement>) {
  const { prefixCls, placeholder = {}, upload } = props;

  const placeholderCls = `${prefixCls}-placeholder`;

  const placeholderConfig = (placeholder || {}) as PlaceholderConfig;

  const { disabled } = React.useContext(AttachmentContext);

  // ============================= Drag =============================
  const [dragIn, setDragIn] = React.useState(false);

  const onDragEnter = () => {
    setDragIn(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    // Leave the div should end
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as HTMLElement)) {
      setDragIn(false);
    }
  };

  const onDrop = () => {
    setDragIn(false);
  };

  // ============================ Render ============================
  const node = React.isValidElement(placeholder) ? (
    placeholder
  ) : (
    <Flex align="center" justify="center" vertical className={`${placeholderCls}-inner`}>
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
      className={classNames(placeholderCls, {
        [`${placeholderCls}-drag-in`]: dragIn,
        [`${placeholderCls}-disabled`]: disabled,
      })}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      aria-hidden={disabled}
      ref={ref}
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

export default React.forwardRef(Placeholder);
