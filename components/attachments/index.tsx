import { type GetProp, type UploadProps } from 'antd';
import classnames from 'classnames';
import React from 'react';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';

import classNames from 'classnames';
import { useEvent, useMergedState } from 'rc-util';
import DropArea from './DropArea';
import FileList, { type FileListProps } from './FileList';
import PlaceholderUploader, { PlaceholderType } from './PlaceholderUploader';
import SilentUploader from './SilentUploader';
import { AttachmentContext } from './context';
import useStyle from './style';

export type SemanticType = 'list' | 'item' | 'itemContent' | 'title';

export type Attachment = GetProp<UploadProps, 'fileList'>[number];

export interface AttachmentsProps extends Omit<UploadProps, 'fileList'> {
  prefixCls?: string;

  rootClassName?: string;
  rootStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  className?: string;

  children?: React.ReactElement;

  disabled?: boolean;

  // ============= placeholder =============
  placeholder?: PlaceholderType | ((type: 'inline' | 'drop') => PlaceholderType);
  getDropContainer?: null | (() => HTMLElement | null | undefined);

  // ============== File List ==============
  items?: Attachment[];
  overflow?: FileListProps['overflow'];
}

const Attachments: React.FC<AttachmentsProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    rootStyle,
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

  const getPlaceholderNode = (type: 'inline' | 'drop') => {
    const placeholderContent = typeof placeholder === 'function' ? placeholder(type) : placeholder;

    return (
      <PlaceholderUploader
        placeholder={placeholderContent}
        upload={mergedUploadProps}
        prefixCls={prefixCls}
      />
    );
  };

  if (children) {
    renderChildren = (
      <>
        <SilentUploader upload={mergedUploadProps} rootClassName={rootClassName}>
          {children}
        </SilentUploader>
        <DropArea
          getDropContainer={getDropContainer}
          prefixCls={prefixCls}
          className={classNames(cssinjsCls, rootClassName)}
        >
          {getPlaceholderNode('drop')}
        </DropArea>
      </>
    );
  } else {
    const hasFileList = fileList.length > 0;

    renderChildren = (
      <div
        className={classnames(
          prefixCls,
          cssinjsCls,
          {
            [`${prefixCls}-rtl`]: direction === 'rtl',
          },
          className,
          rootClassName,
        )}
        style={{
          ...rootStyle,
          ...style,
        }}
        dir={direction || 'ltr'}
        ref={containerRef}
      >
        {hasFileList ? (
          <FileList
            prefixCls={prefixCls}
            items={fileList}
            onRemove={onItemRemove}
            overflow={overflow}
            upload={mergedUploadProps}
          />
        ) : (
          getPlaceholderNode('inline')
        )}

        <DropArea
          getDropContainer={getDropContainer || (() => containerRef.current)}
          prefixCls={prefixCls}
          className={cssinjsCls}
        >
          {getPlaceholderNode('drop')}
        </DropArea>
      </div>
    );
  }

  return wrapCSSVar(
    <AttachmentContext.Provider
      value={{
        disabled,
      }}
    >
      {renderChildren}
    </AttachmentContext.Provider>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Attachments.displayName = 'Attachments';
}

export default Attachments;
