import {
  CloseCircleFilled,
  FileExcelFilled,
  FileImageFilled,
  FileMarkdownFilled,
  FilePdfFilled,
  FilePptFilled,
  FileTextFilled,
  FileWordFilled,
  FileZipFilled,
} from '@ant-design/icons';
import { Image, type ImageProps } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { useXProviderContext } from '../../x-provider';
import type { Attachment } from '..';
import { AttachmentContext } from '../context';
import useStyle from '../style';
import { previewImage } from '../util';
import AudioIcon from './AudioIcon';
import Progress from './Progress';
import VideoIcon from './VideoIcon';

export type PresetIcons =
  | 'default'
  | 'excel'
  | 'image'
  | 'markdown'
  | 'pdf'
  | 'ppt'
  | 'word'
  | 'zip'
  | 'video'
  | 'audio';

export interface FileListCardProps {
  prefixCls?: string;
  item: Attachment;
  onRemove?: (item: Attachment) => void;
  className?: string;
  style?: React.CSSProperties;
  imageProps?: ImageProps;
  icon?: React.ReactNode | PresetIcons;
  type?: 'file' | 'image';
}

const EMPTY = '\u00A0';

const DEFAULT_ICON_COLOR = '#8c8c8c';

const IMG_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'];

const PRESET_FILE_ICONS: {
  key: PresetIcons;
  ext: string[];
  color: string;
  icon: React.ReactElement;
}[] = [
  {
    key: 'default',
    icon: <FileTextFilled />,
    color: DEFAULT_ICON_COLOR,
    ext: [],
  },
  {
    key: 'excel',
    icon: <FileExcelFilled />,
    color: '#22b35e',
    ext: ['xlsx', 'xls'],
  },
  {
    key: 'image',
    icon: <FileImageFilled />,
    color: DEFAULT_ICON_COLOR,
    ext: IMG_EXTS,
  },
  {
    key: 'markdown',
    icon: <FileMarkdownFilled />,
    color: DEFAULT_ICON_COLOR,
    ext: ['md', 'mdx'],
  },
  {
    key: 'pdf',
    icon: <FilePdfFilled />,
    color: '#ff4d4f',
    ext: ['pdf'],
  },
  {
    key: 'ppt',
    icon: <FilePptFilled />,
    color: '#ff6e31',
    ext: ['ppt', 'pptx'],
  },
  {
    key: 'word',
    icon: <FileWordFilled />,
    color: '#1677ff',
    ext: ['doc', 'docx'],
  },
  {
    key: 'zip',
    icon: <FileZipFilled />,
    color: '#fab714',
    ext: ['zip', 'rar', '7z', 'tar', 'gz'],
  },
  {
    key: 'video',
    icon: <VideoIcon />,
    color: '#ff4d4f',
    ext: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
  },
  {
    key: 'audio',
    icon: <AudioIcon />,
    color: '#8c8c8c',
    ext: ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'],
  },
];

function matchExt(suffix: string, ext: string[]) {
  return ext.some((e) => suffix.toLowerCase() === `.${e}`);
}

function getSize(size: number) {
  let retSize = size;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  let unitIndex = 0;

  while (retSize >= 1024 && unitIndex < units.length - 1) {
    retSize /= 1024;
    unitIndex++;
  }

  return `${retSize.toFixed(0)} ${units[unitIndex]}`;
}

function FileListCard(props: FileListCardProps, ref: React.Ref<HTMLDivElement>) {
  const {
    prefixCls: customizePrefixCls,
    item,
    onRemove,
    className,
    style,
    imageProps,
    type,
    icon,
  } = props;
  const context = React.useContext(AttachmentContext);
  const { disabled } = context || {};

  const { name, size, percent, status = 'done', description } = item;

  // ============================= Prefix =============================
  const { getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('attachment', customizePrefixCls);
  const cardCls = `${prefixCls}-list-card`;

  // ============================= Style ==============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  // ============================== Name ==============================
  const [namePrefix, nameSuffix] = React.useMemo(() => {
    const nameStr = name || '';
    const match = nameStr.match(/^(.*)\.[^.]+$/);
    return match ? [match[1], nameStr.slice(match[1].length)] : [nameStr, ''];
  }, [name]);

  const isImg = React.useMemo(() => matchExt(nameSuffix, IMG_EXTS), [nameSuffix]);

  // ============================== Desc ==============================
  const desc = React.useMemo(() => {
    if (description) {
      return description;
    }

    if (status === 'uploading') {
      return `${percent || 0}%`;
    }

    if (status === 'error') {
      return item.response || EMPTY;
    }

    return size ? getSize(size) : EMPTY;
  }, [status, percent]);

  // ============================== Icon ==============================
  const [finalIcon, iconColor] = React.useMemo(() => {
    if (icon) {
      if (typeof icon === 'string') {
        const presetIcon = PRESET_FILE_ICONS.find((preset) => preset.key === icon);
        if (presetIcon) {
          return [presetIcon.icon, presetIcon.color];
        }
      } else {
        return [icon, undefined];
      }
    }

    for (const { ext, icon: presetIcon, color } of PRESET_FILE_ICONS) {
      if (matchExt(nameSuffix, ext)) {
        return [presetIcon, color];
      }
    }

    return [<FileTextFilled key="defaultIcon" />, DEFAULT_ICON_COLOR];
  }, [nameSuffix, icon]);

  // ========================== ImagePreview ==========================
  const [previewImg, setPreviewImg] = React.useState<string>();

  React.useEffect(() => {
    if (item.originFileObj) {
      let synced = true;
      previewImage(item.originFileObj).then((url) => {
        if (synced) {
          setPreviewImg(url);
        }
      });

      return () => {
        synced = false;
      };
    }
    setPreviewImg(undefined);
  }, [item.originFileObj]);

  // ============================= Render =============================
  let content: React.ReactNode = null;
  const previewUrl = item.thumbUrl || item.url || previewImg;

  // 根据 type 属性或文件类型决定是否显示图片预览
  const shouldShowImagePreview =
    type === 'image' || (type !== 'file' && isImg && (item.originFileObj || previewUrl));

  if (shouldShowImagePreview) {
    // Preview Image style
    content = (
      <>
        {previewUrl && <Image alt="preview" src={previewUrl} {...imageProps} />}

        {status !== 'done' && (
          <div className={`${cardCls}-img-mask`}>
            {status === 'uploading' && percent !== undefined && (
              <Progress percent={percent} prefixCls={cardCls} />
            )}
            {status === 'error' && (
              <div className={`${cardCls}-desc`}>
                <div className={`${cardCls}-ellipsis-prefix`}>{desc}</div>
              </div>
            )}
          </div>
        )}
      </>
    );
  } else {
    // Preview Card style
    content = (
      <>
        <div className={`${cardCls}-icon`} style={iconColor ? { color: iconColor } : undefined}>
          {finalIcon}
        </div>
        <div className={`${cardCls}-content`}>
          <div className={`${cardCls}-name`}>
            <div className={`${cardCls}-ellipsis-prefix`}>{namePrefix ?? EMPTY}</div>
            <div className={`${cardCls}-ellipsis-suffix`}>{nameSuffix}</div>
          </div>
          <div className={`${cardCls}-desc`}>
            <div className={`${cardCls}-ellipsis-prefix`}>{desc}</div>
          </div>
        </div>
      </>
    );
  }

  return wrapCSSVar(
    <div
      className={classnames(
        cardCls,
        {
          [`${cardCls}-status-${status}`]: status,
          [`${cardCls}-type-preview`]: shouldShowImagePreview,
          [`${cardCls}-type-overview`]: !shouldShowImagePreview,
        },
        className,
        hashId,
        cssVarCls,
      )}
      style={style}
      ref={ref}
    >
      {content}

      {/* Remove Icon */}
      {!disabled && onRemove && (
        <button
          type="button"
          className={`${cardCls}-remove`}
          onClick={() => {
            onRemove(item);
          }}
        >
          <CloseCircleFilled />
        </button>
      )}
    </div>,
  );
}

export default React.forwardRef(FileListCard);
