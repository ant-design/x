import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Button, type ImageProps, type UploadProps } from 'antd';
import classnames from 'classnames';
import { CSSMotionList } from 'rc-motion';
import React from 'react';
import type { Attachment } from '..';
import { AttachmentContext } from '../context';
import SilentUploader from '../SilentUploader';
import FileListCard from './FileListCard';

export interface FileListProps {
  prefixCls: string;
  items: Attachment[];
  onRemove: (item: Attachment) => void;
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
  upload: UploadProps;
  imageProps?: ImageProps;

  // Semantic
  listClassName?: string;
  listStyle?: React.CSSProperties;
  itemClassName?: string;
  itemStyle?: React.CSSProperties;

  uploadClassName?: string;
  uploadStyle?: React.CSSProperties;
}

const TOLERANCE = 1;

export default function FileList(props: FileListProps) {
  const {
    prefixCls,
    items,
    onRemove,
    overflow,
    upload,
    listClassName,
    listStyle,
    itemClassName,
    uploadClassName,
    uploadStyle,
    itemStyle,
    imageProps,
  } = props;

  const listCls = `${prefixCls}-list`;

  const containerRef = React.useRef<HTMLDivElement>(null);

  const [firstMount, setFirstMount] = React.useState(false);

  const { disabled } = React.useContext(AttachmentContext);

  React.useEffect(() => {
    setFirstMount(true);
    return () => {
      setFirstMount(false);
    };
  }, []);

  // ================================= Scroll =================================
  const [pingStart, setPingStart] = React.useState(false);
  const [pingEnd, setPingEnd] = React.useState(false);

  const checkPing = () => {
    const containerEle = containerRef.current;

    if (!containerEle) {
      return;
    }

    if (overflow === 'scrollX') {
      setPingStart(Math.abs(containerEle.scrollLeft) >= TOLERANCE);
      setPingEnd(
        containerEle.scrollWidth - containerEle.clientWidth - Math.abs(containerEle.scrollLeft) >=
          TOLERANCE,
      );
    } else if (overflow === 'scrollY') {
      setPingStart(containerEle.scrollTop !== 0);
      setPingEnd(containerEle.scrollHeight - containerEle.clientHeight !== containerEle.scrollTop);
    }
  };

  React.useEffect(() => {
    checkPing();
  }, [overflow, items.length]);

  const onScrollOffset = (offset: -1 | 1) => {
    const containerEle = containerRef.current;

    if (containerEle) {
      containerEle.scrollTo({
        left: containerEle.scrollLeft + offset * containerEle.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const onScrollLeft = () => {
    onScrollOffset(-1);
  };

  const onScrollRight = () => {
    onScrollOffset(1);
  };

  // ================================= Render =================================
  return (
    <div
      className={classnames(
        listCls,
        {
          [`${listCls}-overflow-${props.overflow}`]: overflow,
          [`${listCls}-overflow-ping-start`]: pingStart,
          [`${listCls}-overflow-ping-end`]: pingEnd,
        },
        listClassName,
      )}
      ref={containerRef}
      onScroll={checkPing}
      style={listStyle}
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
              prefixCls={prefixCls}
              item={item}
              onRemove={onRemove}
              className={classnames(motionCls, itemClassName)}
              imageProps={imageProps}
              style={{
                ...motionStyle,
                ...itemStyle,
              }}
            />
          );
        }}
      </CSSMotionList>
      {!disabled && (
        <SilentUploader upload={upload}>
          <Button
            className={classnames(uploadClassName, `${listCls}-upload-btn`)}
            style={uploadStyle}
            type="dashed"
          >
            <PlusOutlined className={`${listCls}-upload-btn-icon`} />
          </Button>
        </SilentUploader>
      )}

      {overflow === 'scrollX' && (
        <>
          <Button
            size="small"
            shape="circle"
            className={`${listCls}-prev-btn`}
            icon={<LeftOutlined />}
            onClick={onScrollLeft}
          />
          <Button
            size="small"
            shape="circle"
            className={`${listCls}-next-btn`}
            icon={<RightOutlined />}
            onClick={onScrollRight}
          />
        </>
      )}
    </div>
  );
}
