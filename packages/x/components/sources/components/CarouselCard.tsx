import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel } from 'antd';
import classnames from 'classnames';
import React, { useEffect } from 'react';
import type { SourcesItem, SourcesProps } from '../Sources';

export interface CarouselCardProps {
  activeKey?: SourcesProps['activeKey'];
  prefixCls: string;
  items?: Array<SourcesItem>;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (item: SourcesItem) => void;
}

const CarouselCard: React.FC<CarouselCardProps> = (props) => {
  const { prefixCls, items, activeKey, className, style } = props;

  const compCls = `${prefixCls}-carousel`;
  const [slide, setSlide] = React.useState<number>(
    items?.findIndex(({ key }) => key === activeKey) ?? 0,
  );
  const carouselRef = React.useRef<React.ComponentRef<typeof Carousel>>(null);

  const handleClick = (item: SourcesItem) => {
    item.url && window.open(item.url, '_blank', 'noopener,noreferrer');
    props.onClick?.(item);
  };
  useEffect(() => {
    carouselRef.current?.goTo(slide);
  }, [slide]);

  return (
    <div style={style} className={classnames(`${compCls}-wrapper`, className)}>
      <div className={`${compCls}-title`}>
        <div className={`${compCls}-btn-wrapper`}>
          <span
            className={classnames(`${compCls}-btn`, `${compCls}-left-btn`, {
              [`${compCls}-btn-disabled`]: slide === 0,
            })}
            onClick={() => {
              if (slide > 0) {
                setSlide((pre) => pre - 1);
              }
            }}
          >
            <LeftOutlined />
          </span>
          <span
            className={classnames(`${compCls}-btn`, `${compCls}-right-btn`, {
              [`${compCls}-btn-disabled`]: slide === (items?.length || 1) - 1,
              [`${compCls}-btn-disabled`]: slide === (items?.length || 1) - 1,
            })}
            onClick={() => {
              if (slide < (items?.length || 1) - 1) {
                setSlide((pre) => pre + 1);
              }
            }}
          >
            <RightOutlined />
          </span>
        </div>
        <div className={`${compCls}-page`}>{`${slide + 1}/${items?.length || 1}`}</div>
      </div>
      <Carousel
        className={`${compCls}-carousel`}
        ref={carouselRef}
        arrows={false}
        infinite={false}
        dots={false}
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
