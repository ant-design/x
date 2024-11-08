import { createStyles } from 'antd-style';
import classnames from 'classnames';
import React from 'react';

const useStyle = createStyles(({ token, css }) => {
  return {
    container: css`
      width: 100%;
      margin: 0 auto;
      max-width: ${token.pcMaxWidth - token.pcContainerXMargin * 2}px;

      @media only screen and (max-width: ${token.pcMaxWidth}px) {
        max-width: calc(100vw - ${token.pcContainerXMargin * 2}px);
      }

      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
        max-width: calc(100vw - ${token.marginLG * 2}px);
      }
    `,
  };
});

interface ContainerProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * @descriptionEN Container for center layout on the homepage, controlling the maximum width under various screen widths
 */
const Container: React.FC<ContainerProps> = (props) => {
  const { styles } = useStyle();
  return (
    <div className={classnames(styles.container, props.className)} style={props.style}>
      {props.children}
    </div>
  );
};

export default Container;
