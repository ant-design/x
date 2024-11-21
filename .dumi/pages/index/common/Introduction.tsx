import { createStyles } from 'antd-style';
import React from 'react';

import Container, { type ContainerProps } from './Container';
import CustomizationProvider from './CustomizationProvider';

const useStyle = createStyles(({ token, css }) => {
  const introRadius = 24;
  return {
    container: css`
      overflow: hidden;
    `,
    content: css`
      display: grid;
      width: 100%;
      gap: ${token.padding + token.paddingSM}px;
      margin-top: ${token.marginXXL}px;
    `,
    item: css`
      background: #0c0e10cc;
      border-radius: ${introRadius}px;
      padding: ${token.padding + token.paddingSM}px;
      overflow: hidden;
      position: relative;
      cursor: pointer;

      & :hover::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: ${introRadius}px;
        padding: ${token.lineWidth * 2}px;
        background: linear-gradient(180deg, #ffffff20 0%, #ffffff0d 100%);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
      }
    `,
    item_header: css`
    `,
    item_content: css`
      display: flex;
      align-items: center;
      gap: ${token.paddingSM}px;
    `,
    item_icon: css`
      width: 32px;
      height: 32px;
      padding: ${token.paddingSM}px;
      border-radius: ${introRadius / 2}px;
      background: #ffffff1a;
      box-shadow: inset 0px 1px 1.5px 0px #ffffff80;
    `,
    item_title: css`
      display: flex;
      align-items: center;
      gap: ${token.paddingXS}px;
      font-size: ${token.fontSizeHeading4}px;
      font-weight: bold;
      margin-bottom: ${token.paddingXS}px;
    `,
    item_desc: css`
      text-align: start;
      font-size: ${token.fontSizeSM}px;
      opacity: 0.65;
    `,
    item_tag: css`
      border-radius: 4px;
      color: transparent;
      height: 24px;
      line-height: 24px;
      box-sizing: border-box;
      font-size: ${token.fontSizeSM}px;
      padding: 0 8px;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        width: 100%;
        height: 100%;

        background: #ffffff;
        opacity: 0.1;
      }
    `,
  };
});

export interface IntroductionItem extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  desc?: React.ReactNode;
  tag?: React.ReactNode;
  startColor?: string;
  endColor?: string;
  icon?: string;
  url?: string;
  header?: React.ReactNode;
}

interface IntroductionProps extends ContainerProps {
  column?: number;
  items?: IntroductionItem[];
  cardStyle?: React.CSSProperties;
}

const Introduction: React.FC<IntroductionProps> = (props) => {
  const { styles } = useStyle();

  return (
    <Container className={styles.container} title={props.title} desc={props.desc}>
      <div
        className={styles.content}
        style={{
          gridTemplateColumns: `repeat(${props.column || props.items?.length}, 1fr)`,
        }}
      >
        {props.items?.map((item) => (
          <div
            className={styles.item}
            key={`${item.title}`}
            style={props.cardStyle}
            onClick={item.onClick}
          >
            {item.header && (
              <div className={styles.item_header}>
                <CustomizationProvider>{item.header}</CustomizationProvider>
              </div>
            )}
            <div className={styles.item_content}>
              {item.icon && <img className={styles.item_icon} src={item.icon} alt={item.icon} />}
              <div>
                <h3 className={styles.item_title}>
                  {item.title}
                  {item.tag && (
                    <span
                      className={styles.item_tag}
                      style={{
                        background: `linear-gradient(127deg, ${item.startColor || '#fff'} 23%, ${item.endColor || '#fff'} 100%)`,
                        WebkitBackgroundClip: 'text',
                      }}
                    >
                      {item.tag}
                    </span>
                  )}
                </h3>
                <p className={styles.item_desc}>{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Introduction;
