import { CloseCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { CSSMotionList } from 'rc-motion';
import { useXProviderContext } from '../x-provider';
import FileCard, { FileCardProps } from './FileCard';
import useStyle from './style';

export interface FileCardListProps {
  prefixCls?: string;
  className?: string;
  classNames?: Partial<Record<'root' | 'file', string>>;
  style?: React.CSSProperties;
  styles?: Partial<Record<'root' | 'file', React.CSSProperties>>;
  items: FileCardProps[];
  size?: 'small' | 'default';
  removable?: boolean | ((item: FileCardProps) => boolean);
  onRemove?: (item: FileCardProps) => void;
  extension?: React.ReactNode;
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
}

const List: React.FC<FileCardListProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    classNames = {},
    style,
    styles = {},
    items,
    size,
    removable,
    onRemove,
    extension,
    overflow,
  } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);

  const [list, setList] = React.useState<(FileCardProps & {key: React.Key})[]>([]);

  React.useEffect(() => {
    const list = items.map((item) => ({
      ...item,
      key: item.key || item.name,
    }));
    setList(list);
  }, [items]);

  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('file-card', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const compCls = `${prefixCls}-list`;

  const [pingStart, setPingStart] = React.useState(false);
  const [pingEnd, setPingEnd] = React.useState(false);

  const mergedCls = classnames(
    compCls,
    className,
    classNames?.root,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${compCls}-overflow-${props.overflow}`]: overflow,
      [`${compCls}-overflow-ping-start`]: pingStart,
      [`${compCls}-overflow-ping-end`]: pingEnd,
      [`${compCls}-small`]: size === 'small',
    },
  );

  const checkPing = () => {
    const containerEle = containerRef.current;

    if (!containerEle) {
      return;
    }

    if (overflow === 'scrollX') {
      setPingStart(Math.abs(containerEle.scrollLeft) >= 1);
      setPingEnd(
        containerEle.scrollWidth - containerEle.clientWidth - Math.abs(containerEle.scrollLeft) >= 1,
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

  const handleRemove = (item: FileCardProps, key?: React.Key) => {
    const newList = list?.filter((i) => i.key !== key);
    setList(newList);
    onRemove?.(item);
  };

  return (
    <div className={`${compCls}-wrapper`}>
      <div className={mergedCls} dir={direction} style={{...style, ...styles?.root}} ref={containerRef} onScroll={checkPing}>
        <CSSMotionList
          keys={list.map(item => ({ key: item.key, item }))}
          motionName={`${compCls}-motion`}
          component={false}
          motionAppear={false}
          motionLeave
          motionEnter
        >
          {({ key, item, className: motionCls, style: motionStyle }) => {
            return (
              <div className={classnames(`${compCls}-item`, motionCls)} style={motionStyle} key={key}>
                <FileCard
                  {...item}
                  size={size}
                  key={key}
                  className={classnames(item.className, classNames?.file)}
                  style={{ ...item.style, ...styles?.file }}
                />
                {(typeof removable === 'function' ? removable(item) : removable) && (
                  <div className={`${compCls}-remove`} onClick={() => handleRemove(item, key)}>
                    <CloseCircleFilled />
                  </div>
                )}
              </div>
            );
          }}
        </CSSMotionList>

        {overflow === 'scrollX' && (
          <>
            <Button
              size="small"
              shape="circle"
              className={`${compCls}-prev-btn`}
              icon={<LeftOutlined />}
              onClick={onScrollLeft}
            />
            <Button
              size="small"
              shape="circle"
              className={`${compCls}-next-btn`}
              icon={<RightOutlined />}
              onClick={onScrollRight}
            />
          </>
        )}
        {extension}
      </div>
    </div>
  );
};

export default List;
