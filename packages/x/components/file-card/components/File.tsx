import { clsx } from 'clsx';
import React, { useMemo } from 'react';
import { type FileCardProps, SemanticType } from '../FileCard';
import { getSize } from '../utils';

interface FileProps {
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  classNames?: Partial<Record<SemanticType, string>>;
  prefixCls?: string;
  name?: string;
  ext?: string;
  size?: 'small' | 'default';
  byte?: number;
  src?: string;
  type?: FileCardProps['type'];
  description?: FileCardProps['description'];
  icon?: React.ReactNode;
  iconColor?: string;
  onClick?: () => void;
  mask?: FileCardProps['mask'];
}

const File: React.FC<FileProps> = (props) => {
  const {
    styles = {},
    classNames = {},
    prefixCls,
    name,
    ext,
    size,
    byte,
    src,
    type,
    description,
    icon,
    iconColor,
    onClick,
    mask,
  } = props;
  const compCls = `${prefixCls}-file`;

  const mergedCls = clsx(compCls, classNames.file, {
    [`${compCls}-pointer`]: !!onClick,
    [`${compCls}-small`]: size === 'small',
  });

  const desc = useMemo(() => {
    const size = typeof byte === 'number' ? getSize(byte) : '';
    const descriptionNode =
      typeof description === 'function'
        ? description({ size, icon, src, type, name, namePrefix: name, nameSuffix: ext })
        : description;

    return descriptionNode;
  }, [description, byte, icon, src, type, name, ext]);

  const maskNode = useMemo(() => {
    const size = typeof byte === 'number' ? getSize(byte) : '';
    const maskContent =
      typeof mask === 'function'
        ? mask({ size, icon, src, type, name, namePrefix: name, nameSuffix: ext })
        : mask;

    return maskContent;
  }, [mask, byte, icon, src, type, name, ext]);

  return (
    <div className={mergedCls} style={styles.file} onClick={onClick}>
      <div
        className={clsx(`${compCls}-icon`, classNames.icon)}
        style={{ color: iconColor, ...styles.icon }}
      >
        {icon}
      </div>
      <div className={`${compCls}-content`}>
        <div className={clsx(`${compCls}-name`, classNames.name)} style={styles.name}>
          <span className={`${compCls}-name-prefix`}>{name}</span>
          <span className={`${compCls}-name-suffix`}>{ext}</span>
        </div>
        {desc && (
          <div
            className={clsx(`${compCls}-description`, classNames.description)}
            style={styles.description}
          >
            {desc}
          </div>
        )}
      </div>
      {maskNode && (
        <div className={`${compCls}-mask`}>
          <div className={`${compCls}-mask-info`}>{maskNode}</div>
        </div>
      )}
    </div>
  );
};

export default File;
