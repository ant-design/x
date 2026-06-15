import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel } from 'antd';
import { clsx } from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import type { SourcesItem, SourcesProps } from '../Sources';

export interface CarouselCardProps {
  activeKey?: SourcesProps['activeKey'];
  prefixCls: string;
  items?: SourcesProps['items'];
  className?: string;
  style?: React.CSSProperties;
  onClick?: (item: SourcesItem) => void;
}

const CarouselCard: React.FC<CarouselCardProps> = (props) => {
  const { prefixCls, items, activeKey, className, style } = props;

  const compCls = `${prefixCls}-carousel`;

  // Derive the target slide index from activeKey
  const activeSlideIndex = React.useMemo(
    () => Math.max(0, items?.findIndex(({ key }) => key === activeKey) ?? 0),
    [items, activeKey],
  );

  const [slide, setSlide] = useState<number>(activeSlideIndex);

  const carouselRef = useRef<React.ComponentRef<typeof Carousel>>(null);

  // The previous activeSlideIndex — used to detect external activeKey changes
  const prevActiveSlideIndexRef = useRef(activeSlideIndex);

  // When activeKey changes (activeSlideIndex differs), sync slide to it
  useEffect(() => {
    if (activeSlideIndex !== prevActiveSlideIndexRef.current) {
      prevActiveSlideIndexRef.current = activeSlideIndex;
      setSlide(activeSlideIndex);
      if (carouselRef.current) {
        carouselRef.current.goTo(activeSlideIndex, false);
      }
    }
  }, [activeSlideIndex]);

  // On initial mount, sync the carousel position to the initial activeKey
  useEffect(() => {
    if (activeSlideIndex > 0 && carouselRef.current) {
      carouselRef.current.goTo(activeSlideIndex, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (item: SourcesItem) => {
    item.url && window.open(item.url, '_blank', 'noopener,noreferrer');
    props.onClick?.(item);
  };

  return (
    <div style={style} className={clsx(`${compCls}-wrapper`, className)}>
      <div className={`${compCls}-title`}>
        <div className={`${compCls}-btn-wrapper`}>
          <span
            className={clsx(`${compCls}-btn`, `${compCls}-left-btn`, {
              [`${compCls}-btn-disabled`]: slide === 0,
            })}
            onClick={() => {
              if (slide > 0) {
                const next = slide - 1;
                setSlide(next);
                carouselRef.current?.goTo(next, false);
              }
            }}
          >
            <LeftOutlined />
          </span>
          <span
            className={clsx(`${compCls}-btn`, `${compCls}-right-btn`, {
              [`${compCls}-btn-disabled`]: slide === (items?.length || 1) - 1,
            })}
            onClick={() => {
              const max = (items?.length || 1) - 1;
              if (slide < max) {
                const next = slide + 1;
                setSlide(next);
                carouselRef.current?.goTo(next, false);
              }
            }}
          >
            <RightOutlined />
          </span>
        </div>
        <div className={`${compCls}-page`}>{`${slide + 1}/${items?.length || 1}`}</div>
      </div>
      <Carousel className={compCls} ref={carouselRef} arrows={false} infinite={false} dots={false}>
        {items?.map((item, index) => (
          <div
            key={item.key || index}
            className={`${compCls}-item`}
            onClick={() => handleClick(item)}
          >
            <div className={`${compCls}-item-title-wrapper`}>
              {item.icon && <span className={`${compCls}-item-icon`}>{item.icon}</span>}
              <span className={`${compCls}-item-title`}>{item.title}</span>
            </div>
            {item.description && (
              <div className={`${compCls}-item-description`}>{item.description}</div>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselCard;
