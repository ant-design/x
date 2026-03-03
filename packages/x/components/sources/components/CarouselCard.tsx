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

  const [slide, setSlide] = useState<number>(0);

  const carouselRef = useRef<React.ComponentRef<typeof Carousel>>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (carouselRef.current) {
        const current = Math.max(0, items?.findIndex(({ key }) => key === activeKey) ?? 0);
        setSlide(current);
        carouselRef.current.goTo(current, false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [activeKey, items, setSlide]);

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
            onClick={() => carouselRef.current?.prev()}
          >
            <LeftOutlined />
          </span>
          <span
            className={clsx(`${compCls}-btn`, `${compCls}-right-btn`, {
              [`${compCls}-btn-disabled`]: slide === (items?.length || 1) - 1,
            })}
            onClick={() => carouselRef.current?.next()}
          >
            <RightOutlined />
          </span>
        </div>
        <div className={`${compCls}-page`}>{`${slide + 1}/${items?.length || 1}`}</div>
      </div>
      <Carousel
        className={compCls}
        ref={carouselRef}
        arrows={false}
        infinite={false}
        dots={false}
        afterChange={setSlide}
        beforeChange={(_, nextSlide) => setSlide(nextSlide)}
      >
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
