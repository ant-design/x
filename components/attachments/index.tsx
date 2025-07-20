import { type GetProp, GetRef, Upload, type UploadProps } from 'antd';
import classnames from 'classnames';
import { useEvent, useMergedState } from 'rc-util';
import React from 'react';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import { AttachmentContext } from './context';
import DropArea from './DropArea';
import FileList, { type FileListProps } from './FileList';
import FileListCard from './FileList/FileListCard';
import PlaceholderUploader, {
  type PlaceholderProps,
  type PlaceholderType,
} from './PlaceholderUploader';
import SilentUploader from './SilentUploader';
import useStyle from './style';

export type SemanticType = 'list' | 'item' | 'placeholder' | 'upload';

export type Attachment = GetProp<UploadProps, 'fileList'>[number] & {
  description?: React.ReactNode;
};

export interface AttachmentsProps extends Omit<UploadProps, 'fileList'> {
  prefixCls?: string;

  rootClassName?: string;
  rootStyle?: React.CSSProperties;

  style?: React.CSSProperties;
  className?: string;

  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;

  children?: React.ReactElement;

  disabled?: boolean;

  // ============= placeholder =============
  placeholder?: PlaceholderType | ((type: 'inline' | 'drop') => PlaceholderType);
  getDropContainer?: null | (() => HTMLElement | null | undefined);

  // ============== File List ==============
  items?: Attachment[];
  overflow?: FileListProps['overflow'];
  imageProps?: FileListProps['imageProps'];
}

export interface AttachmentsRef {
  nativeElement: HTMLDivElement | null;
  upload: (file: File) => void;
}

function Attachments(props: AttachmentsProps, ref: React.Ref<AttachmentsRef>) {
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
    onRemove,
    overflow,
    imageProps,
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

  // ============================= Ref =============================
  const containerRef = React.useRef<HTMLDivElement>(null);

  const uploadRef = React.useRef<GetRef<typeof Upload>>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: containerRef.current,
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
  }));

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
        <SilentUploader upload={mergedUploadProps} rootClassName={rootClassName} ref={uploadRef}>
          {children}
        </SilentUploader>
        <DropArea
          getDropContainer={getDropContainer}
          prefixCls={prefixCls}
          className={classnames(cssinjsCls, rootClassName)}
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
        <FileList
          prefixCls={prefixCls}
          items={fileList}
          onRemove={onItemRemove}
          overflow={overflow}
          upload={mergedUploadProps}
          listClassName={classnames(contextClassNames.list, classNames.list)}
          listStyle={{
            ...contextStyles.list,
            ...styles.list,
            ...(!hasFileList && { display: 'none' }),
          }}
          uploadClassName={classnames(contextClassNames.upload, classNames.upload)}
          uploadStyle={{ ...contextStyles.upload, ...styles.upload }}
          itemClassName={classnames(contextClassNames.item, classNames.item)}
          itemStyle={{
            ...contextStyles.item,
            ...styles.item,
          }}
          imageProps={imageProps}
          maxCount={maxCount}
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

  return wrapCSSVar(
    <AttachmentContext.Provider
      value={{
        disabled,
      }}
    >
      {renderChildren}
    </AttachmentContext.Provider>,
  );
}

const ForwardAttachments = React.forwardRef(Attachments) as React.ForwardRefExoticComponent<
  AttachmentsProps & React.RefAttributes<AttachmentsRef>
> & {
  FileCard: typeof FileListCard;
};

if (process.env.NODE_ENV !== 'production') {
  ForwardAttachments.displayName = 'Attachments';
}

ForwardAttachments.FileCard = FileListCard;

export default ForwardAttachments;
