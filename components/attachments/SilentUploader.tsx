import { Upload, type UploadProps } from 'antd';
import React from 'react';

export interface SilentUploaderProps {
  children: React.ReactElement;
  upload: UploadProps;
}

/**
 * SilentUploader is only wrap children with antd Upload component.
 */
export default function SilentUploader(props: SilentUploaderProps) {
  const { children, upload } = props;

  // ============================ Render ============================
  return (
    <Upload {...upload} showUploadList={false}>
      {children}
    </Upload>
  );
}
