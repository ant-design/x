import classNames from 'classnames';
import { CSSMotionList } from 'rc-motion';
import React from 'react';
import type { Attachment } from '..';
import FileListCard from './FileListCard';

export interface FileListProps {
  prefixCls: string;
  items: Attachment[];
  onRemove: (item: Attachment) => void;
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
  disabled?: boolean;
}

export default function FileList(props: FileListProps) {
  const { prefixCls, items, onRemove, overflow, disabled } = props;

  const listCls = `${prefixCls}-list`;

  const [firstMount, setFirstMount] = React.useState(false);

  React.useEffect(() => {
    setFirstMount(true);
    return () => {
      setFirstMount(false);
    };
  }, []);

  return (
    <div
      className={classNames(listCls, {
        [`${listCls}-overflow-${props.overflow}`]: overflow,
      })}
    >
      <CSSMotionList
        keys={items.map((item) => ({
          key: item.uid,
          item,
        }))}
        motionName={`${listCls}-card-motion`}
        component={false}
        motionAppear={firstMount}
        motionLeave
        motionEnter
      >
        {({ key, item, className: motionCls, style: motionStyle }) => {
          return (
            <FileListCard
              key={key}
              prefixCls={listCls}
              item={item}
              onRemove={onRemove}
              className={motionCls}
              style={motionStyle}
              disabled={disabled}
            />
          );
        }}
      </CSSMotionList>
    </div>
  );
}
