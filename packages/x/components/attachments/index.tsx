import { type GetProp, GetRef, Upload, type UploadProps } from 'antd';
import classnames from 'classnames';
import { useEvent, useMergedState } from 'rc-util';
import React from 'react';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { FileCardProps } from '../file-card';
import { SemanticType as FileCardSemanticType } from '../file-card/FileCard';
import { SemanticType as FileCardListSemanticType } from '../file-card/List';
import { useXProviderContext } from '../x-provider';
import { AttachmentContext } from './context';
import DropArea from './DropArea';
import FileList, { type FileListProps } from './FileList';
import PlaceholderUploader, {
  type PlaceholderProps,
  type PlaceholderType,
} from './PlaceholderUploader';
import SilentUploader from './SilentUploader';
import useStyle from './style';
export type SemanticType = 'list' | 'placeholder' | 'upload';

export type Attachment = GetProp<UploadProps, 'fileList'>[number] &
  Omit<FileCardProps, 'size' | 'byte'> & {
    description?: React.ReactNode;
  };

export interface AttachmentsProps extends Omit<UploadProps, 'fileList'> {
  prefixCls?: string;

  rootClassName?: string;

  style?: React.CSSProperties;
  className?: string;

  classNames?: Partial<
    Record<SemanticType | FileCardSemanticType | FileCardListSemanticType, string>
  >;
  styles?: Partial<
    Record<SemanticType | FileCardSemanticType | FileCardListSemanticType, React.CSSProperties>
  >;

  children?: React.ReactElement;

  disabled?: boolean;

  // ============= placeholder =============
  placeholder?: PlaceholderType | ((type: 'inline' | 'drop') => PlaceholderType);
  getDropContainer?: null | (() => HTMLElement | null | undefined);

  // ============== File List ==============
  items?: Attachment[];
  overflow?: FileListProps['overflow'];
}

export interface AttachmentsRef {
  nativeElement: HTMLDivElement | null;
  fileNativeElement: HTMLInputElement | null;
  upload: (file: File) => void;
  select: (options: { accept?: string; multiple?: boolean }) => void;
}

function Attachments(props: AttachmentsProps, ref: React.Ref<AttachmentsRef>) {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    style,
    items,
    children,
    getDropContainer,
    placeholder,
    onChange,
    onRemove,
    overflow,
    disabled,
    maxCount,
    classNames = {},
    styles = {},
    ...uploadProps
  } = props;

  // ============================ PrefixCls ============================
  const { getPrefixCls, direction } = useXProviderContext();

  const prefixCls = getPrefixCls('attachment', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('attachments');

  const { classNames: contextClassNames, styles: contextStyles } = contextConfig;

  const { root: rootOfClassNames, ...otherClassNames } = classNames;
  const { root: rootOfStyles, ...otherStyles } = styles;

  // ============================= Ref =============================
  const containerRef = React.useRef<HTMLDivElement>(null);

  const uploadRef = React.useRef<GetRef<typeof Upload>>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: containerRef.current,
    fileNativeElement: uploadRef.current?.nativeElement?.querySelector('input[type="file"]'),
    upload: (file) => {
      const fileInput = uploadRef.current?.nativeElement?.querySelector('input[type="file"]');
      // Trigger native change event
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;

        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    },
    select: ({ accept, multiple = false }) => {
      const fileInput = uploadRef.current?.nativeElement?.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.multiple = multiple;
        fileInput.accept = accept || props.accept;
        fileInput.click();
      }
    },
  }));

  // ============================ Style ============================
  const [hashId, cssVarCls] = useStyle(prefixCls);

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
    maxCount,
    onChange: triggerChange,
  };

  const onItemRemove = (item: Attachment) =>
    Promise.resolve(typeof onRemove === 'function' ? onRemove(item) : onRemove).then((ret) => {
      // Prevent removing file
      if (ret === false) {
        return;
      }

      const newFileList = fileList.filter((fileItem) => fileItem.uid !== item.uid);

      triggerChange({
        file: { ...item, status: 'removed' },
        fileList: newFileList,
      });
    });
  // ============================ Render ============================
  let renderChildren: React.ReactElement;

  const getPlaceholderNode = (
    type: 'inline' | 'drop',
    props?: Pick<PlaceholderProps, 'style'>,
    ref?: React.RefObject<GetRef<typeof Upload>>,
  ) => {
    const placeholderContent = typeof placeholder === 'function' ? placeholder(type) : placeholder;

    return (
      <PlaceholderUploader
        placeholder={placeholderContent}
        upload={mergedUploadProps}
        prefixCls={prefixCls}
        className={classnames(contextClassNames.placeholder, classNames.placeholder)}
        style={{
          ...contextStyles.placeholder,
          ...styles.placeholder,
          ...props?.style,
        }}
        ref={ref}
      />
    );
  };

  if (children) {
    renderChildren = (
      <>
        <SilentUploader
          upload={mergedUploadProps}
          style={rootOfStyles}
          className={classnames(rootClassName, rootOfClassNames)}
          ref={uploadRef}
        >
          {children}
        </SilentUploader>
        <DropArea
          getDropContainer={getDropContainer}
          prefixCls={prefixCls}
          style={rootOfStyles}
          className={classnames(cssinjsCls, rootClassName, rootOfClassNames)}
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
          rootOfClassNames,
        )}
        style={{
          ...styles.root,
          ...style,
        }}
        dir={direction || 'ltr'}
        ref={containerRef}
      >
        <FileList
          prefixCls={prefixCls}
          items={fileList}
          onRemove={onItemRemove}
          overflow={overflow}
          upload={mergedUploadProps}
          classNames={otherClassNames}
          style={!hasFileList ? { display: 'none' } : {}}
          styles={otherStyles}
        />
        {getPlaceholderNode('inline', hasFileList ? { style: { display: 'none' } } : {}, uploadRef)}
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

  return (
    <AttachmentContext.Provider
      value={{
        disabled,
      }}
    >
      {renderChildren}
    </AttachmentContext.Provider>
  );
}

const ForwardAttachments = React.forwardRef(Attachments) as React.ForwardRefExoticComponent<
  AttachmentsProps & React.RefAttributes<AttachmentsRef>
>;

if (process.env.NODE_ENV !== 'production') {
  ForwardAttachments.displayName = 'Attachments';
}

export default ForwardAttachments;
