import { type GetRef, Upload, type UploadProps } from 'antd';
import React from 'react';

export interface SilentUploaderProps {
  children: React.ReactElement;
  upload: UploadProps;
  rootClassName?: string;
}

/**
 * SilentUploader is only wrap children with antd Upload component.
 */
function SilentUploader(props: SilentUploaderProps, ref: React.Ref<GetRef<typeof Upload>>) {
  const { children, upload, rootClassName } = props;

  const uploadRef = React.useRef<GetRef<typeof Upload>>(null);
  React.useImperativeHandle(ref, () => uploadRef.current!);

  // ============================ Render ============================
  return (
    <Upload {...upload} showUploadList={false} rootClassName={rootClassName} ref={uploadRef}>
      {children}
    </Upload>
  );
}

export default React.forwardRef(SilentUploader);
