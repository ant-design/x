import { createStyles } from 'antd-style';
import classnames from 'classnames';
import React from 'react';

const useStyle = createStyles(({ token, css }) => {
  return {
    container: css`
      width: 100%;
      margin: 0 auto;
      max-width: ${token.pcMaxWidth - token.pcContainerMargin * 2}px;
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      @media only screen and (max-width: ${token.pcMaxWidth}px) {
        max-width: calc(100vw - ${token.pcContainerMargin * 2}px);
      }

      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
        max-width: calc(100vw - ${token.marginLG * 2}px);
      }
    `,
    title: css`
      font-size: 48px;
      color: #fff;
      text-align: center;
      padding-bottom: ${token.padding}px;
    `,
    desc: css`
      color: ${token.colorTextSecondary};
      max-width: 880px !important;
      margin: 0 auto;
      text-align: center;
      padding-bottom: ${token.padding}px;
    `,
  };
});

export interface ContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  desc?: React.ReactNode;
}

const Container: React.FC<ContainerProps> = (props) => {
  const { styles } = useStyle();
  return (
    <div
      className={classnames(styles.container, props.className)}
      style={props.style}
      onClick={props.onClick}
    >
      {props.title && <h2 className={styles.title}>{props.title}</h2>}
      {props.desc && <p className={styles.desc}>{props.desc}</p>}
      {props.children}
    </div>
  );
};

export default Container;
