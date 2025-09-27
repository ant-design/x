import { type GetRef, Upload, type UploadProps } from 'antd';
import React from 'react';

export interface SilentUploaderProps {
  children: React.ReactElement;
  upload: UploadProps;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SilentUploader is only wrap children with antd Upload component.
 */
function SilentUploader(props: SilentUploaderProps, ref: React.Ref<GetRef<typeof Upload>>) {
  const { children, upload, className, style } = props;

  const uploadRef = React.useRef<GetRef<typeof Upload>>(null);
  React.useImperativeHandle(ref, () => uploadRef.current!);

  // ============================ Render ============================
  return (
    <Upload {...upload} showUploadList={false} className={className} style={style} ref={uploadRef}>
      {children}
    </Upload>
  );
}

export default React.forwardRef(SilentUploader);
