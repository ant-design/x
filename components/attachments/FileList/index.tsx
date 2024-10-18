import React from 'react';
import type { Attachment } from '..';
import FileListCard from './FileListCard';

export interface FileListProps {
  prefixCls: string;
  items: Attachment[];
  onRemove: (item: Attachment) => void;
}

export default function FileList(props: FileListProps) {
  const { prefixCls, items, onRemove } = props;

  const listCls = `${prefixCls}-list`;

  return (
    <div className={listCls}>
      {items.map((item) => (
        <FileListCard key={item.uid} prefixCls={listCls} item={item} onRemove={onRemove} />
      ))}
    </div>
  );
}
