import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { SourcesItem } from '../Sources';

export interface CarouselCardProps {
  prefixCls: string;
  items?: Array<SourcesItem>;
  onClick?: (item: SourcesItem) => void;
}

const CarouselCard: React.FC<CarouselCardProps> = (props) => {
  const { prefixCls, items } = props;

  const compCls = `${prefixCls}-carousel`;
  const [slide, setSlide] = React.useState<number>(0);
  const carouselRef = React.useRef<React.ComponentRef<typeof Carousel>>(null);

  const handleClick = (item: SourcesItem) => {
    item.url && window.open(item.url, '_blank', 'noopener,noreferrer');
    props.onClick?.(item);
  };

  return (
    <div className={`${compCls}-wrapper`}>
      <div className={`${compCls}-title`}>
        <div className={`${compCls}-btn-wrapper`}>
          <span
            className={classnames(`${compCls}-btn`, `${compCls}-left-btn`, {
              [`${compCls}-btn-disabled`]: slide === 0,
            })}
            onClick={() => carouselRef.current?.prev()}
          >
            <LeftOutlined />
          </span>
          <span
            className={classnames(`${compCls}-btn`, `${compCls}-right-btn`, {
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
        className={`${compCls}`}
        ref={carouselRef}
        arrows={false}
        infinite={false}
        dots={false}
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
