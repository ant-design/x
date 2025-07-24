import {
  FileExcelFilled,
  FileImageFilled,
  FileMarkdownFilled,
  FilePdfFilled,
  FilePptFilled,
  FileTextFilled,
  FileWordFilled,
  FileZipFilled,
} from '@ant-design/icons';
import classnames from 'classnames';
import React, { useMemo } from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import File from './components/File';
import AudioIcon from './icons/audio';
import VideoIcon from './icons/video';
import useStyle from './style';
import { matchExt } from './utils';

import { Image, type ImageProps } from 'antd';

export type SemanticType = 'root' | 'file' | 'icon' | 'name' | 'description';
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

type FileExtendsProps =
  | ImageProps
  | Partial<React.JSX.IntrinsicElements['video']>
  | Partial<React.JSX.IntrinsicElements['audio']>;

export type FileCardProps = FileExtendsProps & {
  prefixCls?: string;
  style?: React.CSSProperties;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  className?: string;
  classNames?: Partial<Record<SemanticType, string>>;
  rootClassName?: string;

  name?: string;
  size?: number | string;
  description?: React.ReactNode;
  src?: string;
  mask?: React.ReactNode;
  icon?: React.ReactNode | PresetIcons;
  type?: 'file' | 'image' | 'audio' | 'video';
  onClick?: () => void;
}

const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'];
const AUDIO_EXT = ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'];
const VIDEO_EXT = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];

const PRESET_FILE_ICONS: {
  ext: string[];
  color: string;
  icon: React.ReactElement;
  key: string;
}[] = [
  {
    icon: <FileExcelFilled />,
    color: '#22b35e',
    ext: ['xlsx', 'xls'],
    key: 'excel',
  },
  {
    icon: <FileImageFilled />,
    color: '#8c8c8c',
    ext: IMAGE_EXT,
    key: 'image',
  },
  {
    icon: <FileMarkdownFilled />,
    color: '#8c8c8c',
    ext: ['md', 'mdx'],
    key: 'markdown',
  },
  {
    icon: <FilePdfFilled />,
    color: '#ff4d4f',
    ext: ['pdf'],
    key: 'pdf',
  },
  {
    icon: <FilePptFilled />,
    color: '#ff6e31',
    ext: ['ppt', 'pptx'],
    key: 'ppt',
  },
  {
    icon: <FileWordFilled />,
    color: '#1677ff',
    ext: ['doc', 'docx'],
    key: 'word',
  },
  {
    icon: <FileZipFilled />,
    color: '#fab714',
    ext: ['zip', 'rar', '7z', 'tar', 'gz'],
    key: 'zip',
  },
  {
    icon: <VideoIcon />,
    color: '#ff4d4f',
    ext: VIDEO_EXT,
    key: 'video',
  },
  {
    icon: <AudioIcon />,
    color: '#8c8c8c',
    ext: AUDIO_EXT,
    key: 'audio',
  },
];

const DEFAULT_ICON = {
  icon: <FileTextFilled />,
  color: '#8c8c8c',
  ext: ['default'],
  key: 'default',
};

const FileCard: React.FC<FileCardProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    style,
    styles = {},
    className,
    rootClassName,
    classNames = {},
    name,
    size,
    description,
    icon: customIcon,
    src,
    mask,
    type: customType,
    onClick,
    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('file-card', customizePrefixCls);
  const contextConfig = useXComponentConfig('fileCard');

  const [hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    prefixCls,
    contextConfig.className,
    className,
    rootClassName,
    classNames.root,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

  const [namePrefix, nameSuffix] = useMemo(() => {
    const nameStr = name || '';
    const match = nameStr.match(/^(.*)\.[^.]+$/);
    return match ? [match[1], nameStr.slice(match[1].length)] : [nameStr, ''];
  }, [name]);

  const [icon, iconColor] = useMemo(() => {
    if (typeof customIcon === 'string') {
      const match = PRESET_FILE_ICONS.find((item) => item.key === customIcon);
      if (match) {
        return [match.icon, match.color];
      }
    }
    for (const item of PRESET_FILE_ICONS) {
      if (matchExt(nameSuffix, item.ext)) {
        return [item.icon, item.color];
      }
    }
    return [DEFAULT_ICON.icon, DEFAULT_ICON.color];
  }, [nameSuffix]);

  const fileType = useMemo(() => {
    if (customType) {
      return customType;
    }
    if (matchExt(nameSuffix, IMAGE_EXT)) {
      return 'image';
    }
    if (matchExt(nameSuffix, AUDIO_EXT)) {
      return 'audio';
    }
    if (matchExt(nameSuffix, VIDEO_EXT)) {
      return 'video';
    }

    return 'file';
  }, [nameSuffix, customType]);

  const ContentNode = () => {
    if (fileType === 'image') {
      return (
        <Image
          rootClassName={`${prefixCls}-image`}
          alt={name}
          src={src}
          {...(restProps as ImageProps)}
        />
      );
    }
    if (fileType === 'video') {
      return (
        <video
          src={src}
          controls
          className={`${prefixCls}-video`}
          {...(restProps as React.JSX.IntrinsicElements['video'])}
        />
      );
    }
    if (fileType === 'audio') {
      return (
        <audio
          src={src}
          controls
          className={`${prefixCls}-audio`}
          {...(restProps as React.JSX.IntrinsicElements['audio'])}
        />
      );
    }
    return (
      <File
        prefixCls={prefixCls}
        name={namePrefix}
        ext={nameSuffix}
        size={size}
        description={description}
        icon={customIcon && typeof customIcon !== 'string' ? customIcon : icon}
        iconColor={iconColor}
        onClick={onClick}
        mask={mask}
        classNames={classNames}
        styles={styles}
      />
    );
  };

  return (
    <div
      {...domProps}
      className={mergedCls}
      style={{
        ...contextConfig.style,
        ...style,
        ...styles.root,
      }}
    >
      <ContentNode />
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  FileCard.displayName = 'FileCard';
}

export default FileCard;
