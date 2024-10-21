import type { GetProp, UploadProps } from 'antd';
import classnames from 'classnames';
import React from 'react';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';

import { useEvent, useMergedState } from 'rc-util';
import DropArea from './DropArea';
import FileList, { type FileListProps } from './FileList';
import PlaceholderUploader, { PlaceholderProps } from './PlaceholderUploader';
import SilentUploader from './SilentUploader';
import useStyle from './style';

export type SemanticType = 'list' | 'item' | 'itemContent' | 'title';

export type Attachment = GetProp<UploadProps, 'fileList'>[number];

export interface AttachmentsProps extends Omit<UploadProps, 'fileList'> {
  prefixCls?: string;
  style?: React.CSSProperties;
  className?: string;

  children?: React.ReactElement;

  disabled?: boolean;

  // ============= placeholder =============
  placeholder?: PlaceholderProps['placeholder'];
  getDropContainer?: null | (() => HTMLElement | null | undefined);

  // ============== File List ==============
  items?: Attachment[];
  overflow?: FileListProps['overflow'];
}

const Attachments: React.FC<AttachmentsProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    items,
    children,
    getDropContainer,
    placeholder,
    onChange,
    overflow,
    disabled,
    ...uploadProps
  } = props;

  // ============================ PrefixCls ============================
  const { getPrefixCls, direction } = useXProviderContext();

  const prefixCls = getPrefixCls('attachment', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('attachments');

  // ============================= Ref =============================
  const containerRef = React.useRef<HTMLDivElement>(null);

  // ============================ Style ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const cssinjsCls = classnames(hashId, cssVarCls);

  // ============================ Upload ============================
  const [fileList, setFileList] = useMergedState([], {
    value: items,
  });

  const triggerChange: GetProp<AttachmentsProps, 'onChange'> = useEvent((info) => {
    setFileList(info.fileList);
    onChange?.(info);
  });

  const mergedUploadProps: UploadProps = {
    ...uploadProps,
    fileList,
    onChange: triggerChange,
  };

  const onItemRemove = (item: Attachment) => {
    const newFileList = fileList.filter((fileItem) => fileItem.uid !== item.uid);
    triggerChange({
      file: item,
      fileList: newFileList,
    });
  };

  // ============================ Render ============================
  let renderChildren: React.ReactElement;

  const placeholderNode = (
    <PlaceholderUploader
      placeholder={placeholder}
      upload={mergedUploadProps}
      prefixCls={prefixCls}
    />
  );

  if (children) {
    renderChildren = (
      <>
        <SilentUploader upload={mergedUploadProps}>{children}</SilentUploader>
        <DropArea getDropContainer={getDropContainer} prefixCls={prefixCls} className={cssinjsCls}>
          {placeholderNode}
        </DropArea>
      </>
    );
  } else {
    return (
      <div
        className={classnames(prefixCls, className, {
          [`${prefixCls}-rtl`]: direction === 'rtl',
        })}
        style={style}
        dir={direction || 'ltr'}
        ref={containerRef}
      >
        {fileList.length ? (
          <>
            <FileList
              disabled={disabled}
              prefixCls={prefixCls}
              items={fileList}
              onRemove={onItemRemove}
              overflow={overflow}
            />
            <DropArea
              getDropContainer={() => containerRef.current}
              prefixCls={prefixCls}
              className={cssinjsCls}
            >
              {placeholderNode}
            </DropArea>
          </>
        ) : (
          placeholderNode
        )}
      </div>
    );
  }

  return wrapCSSVar(renderChildren);
};

if (process.env.NODE_ENV !== 'production') {
  Attachments.displayName = 'Attachments';
}

export default Attachments;
