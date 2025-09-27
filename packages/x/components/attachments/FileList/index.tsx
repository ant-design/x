import { PlusOutlined } from '@ant-design/icons';
import omit from '@rc-component/util/lib/omit';
import { Button, type ImageProps, type UploadProps } from 'antd';
import classnames from 'classnames';
import React from 'react';
import FileCard, { FileCardProps } from '../../file-card';
import { SemanticType as FileCardSemanticType } from '../../file-card/FileCard';
import { SemanticType as FileCardListSemanticType } from '../../file-card/List';
import type { Attachment } from '..';
import { AttachmentContext } from '../context';
import SilentUploader from '../SilentUploader';
import { previewImage } from '../util';
import Progress from './Progress';

type SemanticType = 'list' | 'placeholder' | 'upload';
export interface FileListProps {
  prefixCls: string;
  items: Attachment[];
  style?: React.CSSProperties;
  onRemove: (item: Attachment) => void;
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
  upload: UploadProps;
  // Semantic
  classNames?: Partial<
    Record<SemanticType | FileCardSemanticType | FileCardListSemanticType, string>
  >;
  styles?: Partial<
    Record<SemanticType | FileCardSemanticType | FileCardListSemanticType, React.CSSProperties>
  >;
}

export default function FileList(props: FileListProps) {
  const {
    prefixCls,
    items,
    onRemove,
    overflow,
    upload,
    classNames = {},
    styles = {},
    style,
  } = props;

  const listCls = `${prefixCls}-list`;

  const { list: listClassName, upload: uploadClassName, ...otherClassNames } = classNames;
  const { list: listStyle, upload: uploadStyle, ...otherStyles } = styles;
  const { disabled } = React.useContext(AttachmentContext);

  const [list, setList] = React.useState<FileCardProps[]>([]);

  const getDescription = (item: Attachment) => {
    if (item.description) {
      return item.description;
    }
    if (item.status === 'uploading') {
      return `${item.percent || 0}%`;
    }
    if (item.status === 'error') {
      return item.response || '';
    }
    return '';
  };

  const getList = async (items: Attachment[]) => {
    const fileCardMap: FileCardProps[] = [];
    for (let i = 0; i < items.length; i++) {
      const desc = getDescription(items[i]);
      let previewImg: any;
      if (items[i].originFileObj) {
        previewImg = await previewImage(items[i].originFileObj!);
      }
      const previewUrl = items[i].thumbUrl || items[i].url || previewImg;
      const cardCls = `${prefixCls}-list-card`;
      const status = items[i].status;
      let preview: ImageProps['preview'];
      if (previewUrl && (status === 'uploading' || status === 'error')) {
        const percent = items[i].percent;
        const mask = (
          <div className={`${cardCls}-file-img-mask`}>
            {status === 'uploading' && percent !== undefined && (
              <Progress percent={percent} prefixCls={cardCls} />
            )}
            {status === 'error' && (
              <div className={`${cardCls}-desc`}>
                <div className={`${cardCls}-ellipsis`}>{desc}</div>
              </div>
            )}
          </div>
        );
        preview = {
          mask,
        };
      }
      fileCardMap.push({
        key: items[i].uid || i,
        description: desc,
        src: previewUrl,
        classNames: {
          file: classnames(`${cardCls}-status-${status}`, classNames.file),
          description: classnames(`${cardCls}-desc`, classNames.description),
        },
        byte: items[i].size,
        ...(omit(items[i], ['type']) as FileCardProps),
        size: undefined,
        preview: preview,
      });
    }
    setList(fileCardMap);
  };

  React.useEffect(() => {
    getList(items);
  }, [items]);

  const handleRemove = (item: FileCardProps) => {
    const index = list.findIndex((i) => i.key === item.key);
    onRemove(items[index]);
  };

  // ================================= Render =================================
  return (
    <FileCard.List
      items={list}
      classNames={{ root: classnames(`${prefixCls}-list`, listClassName), ...otherClassNames }}
      styles={{ root: styles.list, ...otherStyles }}
      style={style}
      removable={!disabled}
      onRemove={handleRemove}
      overflow={overflow}
      extension={
        !disabled && (
          <SilentUploader upload={upload}>
            <Button
              className={classnames(uploadClassName, `${listCls}-upload-btn`)}
              style={uploadStyle}
              type="dashed"
            >
              <PlusOutlined className={`${listCls}-upload-btn-icon`} />
            </Button>
          </SilentUploader>
        )
      }
    />
  );
}
