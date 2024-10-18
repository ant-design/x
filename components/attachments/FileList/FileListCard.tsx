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
import classNames from 'classnames';
import React from 'react';
import type { Attachment } from '..';

export interface FileListCardProps {
  prefixCls: string;
  item: Attachment;
  onRemove: (item: Attachment) => void;
}

const EMPTY = '\u00A0';

const DEFAULT_ICON_COLOR = '#8c8c8c';

const PRESET_FILE_ICONS: {
  ext: string[];
  color: string;
  icon: React.ReactElement;
}[] = [
  {
    icon: <FileExcelFilled />,
    color: '#22b35e',
    ext: ['xlsx', 'xls'],
  },
  {
    icon: <FileImageFilled />,
    color: DEFAULT_ICON_COLOR,
    ext: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'],
  },
  {
    icon: <FileMarkdownFilled />,
    color: DEFAULT_ICON_COLOR,
    ext: ['md', 'mdx'],
  },
  {
    icon: <FilePdfFilled />,
    color: '#ff4d4f',
    ext: ['pdf'],
  },
  {
    icon: <FilePptFilled />,
    color: '#ff6e31',
    ext: ['ppt', 'pptx'],
  },
  {
    icon: <FileWordFilled />,
    color: '#1677ff',
    ext: ['doc', 'docx'],
  },
  {
    icon: <FileZipFilled />,
    color: '#fab714',
    ext: ['zip', 'rar', '7z', 'tar', 'gz'],
  },
];

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

export default function FileListCard(props: FileListCardProps) {
  const { prefixCls, item, onRemove } = props;
  const { name, size, percent, status } = item;
  const cardCls = `${prefixCls}-card`;

  // ============================== Name ==============================
  const [namePrefix, nameSuffix] = React.useMemo(() => {
    const nameStr = name || '';
    const match = nameStr.match(/^(.*)\.[^.]+$/);
    return match ? [match[1], nameStr.slice(match[1].length)] : [nameStr, ''];
  }, [name]);

  // ============================== Desc ==============================
  const desc = React.useMemo(() => {
    if (status === 'uploading') {
      return `${percent || 0}%`;
    }

    if (status === 'error') {
      return item.response || EMPTY;
    }

    return size ? getSize(size) : EMPTY;
  }, [status, percent]);

  // ============================== Icon ==============================
  const [icon, iconColor] = React.useMemo(() => {
    for (const { ext, icon, color } of PRESET_FILE_ICONS) {
      if (ext.some((e) => nameSuffix.toLowerCase() === `.${e}`)) {
        return [icon, color];
      }
    }

    return [<FileTextFilled key="defaultIcon" />, DEFAULT_ICON_COLOR];
  }, [nameSuffix]);

  // ============================= Render =============================
  return (
    <div className={classNames(cardCls, `${cardCls}-status-${status}`)}>
      <div className={`${cardCls}-icon`} style={{ color: iconColor }}>
        {icon}
      </div>
      <div className={`${cardCls}-content`}>
        <div className={`${cardCls}-name`}>
          <div className={`${cardCls}-ellipsis-prefix`}>{namePrefix ?? EMPTY}</div>
          <div className={`${cardCls}-ellipsis-suffix`}>{nameSuffix}</div>
        </div>
        <div className={`${cardCls}-desc`}>
          <div className={`${cardCls}-ellipsis-prefix`}>{desc}</div>
          {/* <div className={`${cardCls}-ellipsis-suffix`} /> */}
        </div>
      </div>

      {/* Remove Icon */}
      <button
        type="button"
        className={`${cardCls}-remove`}
        onClick={() => {
          onRemove(item);
        }}
      >
        <CloseCircleFilled />
      </button>
    </div>
  );
}
