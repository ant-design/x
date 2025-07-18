import { CloseCircleFilled } from '@ant-design/icons';
import classnames from 'classnames';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import FileCard, { FileCardProps } from './FileCard';
import useStyle from './style';

export interface FileCardListProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  items: FileCardProps[];
  size?: 'small' | 'default';
  removable?: boolean | ((item: FileCardProps) => boolean);
  onRemove?: (item?: FileCardProps, list?: FileCardProps[]) => void;
}

const List: React.FC<FileCardListProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    items,
    size,
    removable,
    onRemove,
  } = props;

  const [list, setList] = React.useState(items || []);

  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('file-card', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const compCls = `${prefixCls}-list`;

  const mergedCls = classnames(
    compCls,
    className,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    {
      [`${compCls}-small-size`]: size === 'small',
    },
  );

  const handleRemove = (item: FileCardProps, index: number) => {
    const newList = list?.filter((_, i) => i !== index);
    setList(newList);
    onRemove?.(item, newList);
  };

  return (
    <div className={mergedCls} style={style}>
      {list?.map((item, index) => (
        <div className={`${compCls}-item`} key={index}>
          <FileCard type="file" {...item} />
          {(typeof removable === 'function' ? removable(item) : removable) && (
            <div className={`${compCls}-remove`} onClick={() => handleRemove(item, index)}>
              <CloseCircleFilled />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default List;
