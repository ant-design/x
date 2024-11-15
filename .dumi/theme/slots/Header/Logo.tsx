import { createStyles } from 'antd-style';
import classnames from 'classnames';
import { useLocation } from 'dumi';
import * as React from 'react';

import Link from '../../common/Link';
import * as utils from '../../utils';
import { SharedProps } from './interface';

const useStyle = createStyles(({ token, css }) => {
  const { headerHeight, colorTextHeading, mobileMaxWidth } = token;

  return {
    logo: css`
      height: ${headerHeight}px;
      line-height: ${headerHeight}px;
      padding-inline-start: ${token.paddingXL}px;
      overflow: hidden;
      color: ${colorTextHeading};
      font-weight: normal;
      font-size: 24px;
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
      letter-spacing: -0.18px;
      white-space: nowrap;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      column-gap: ${token.marginSM}px;

      &:hover {
        color: ${colorTextHeading};
      }

      img {
        width: 40px;
        height: 40px;
        display: inline-block;
        vertical-align: middle;
      }

      @media only screen and (max-width: ${mobileMaxWidth}px) {
        padding-inline-start: 0;
        padding-inline-end: 0;
      }
    `,
    title: css`
      line-height: 32px;
    `,
    mobile: css`
      padding-inline-start: 0px !important;
      font-size: 16px !important;
      color: ${colorTextHeading} !important;

      img {
        width: 24px !important;
        height: 24px !important;
      }
    `,
  };
});

export interface LogoProps extends SharedProps {}

const logoSrc =
  'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original';

const Logo: React.FC<LogoProps> = ({ isZhCN, isMobile, isMini }) => {
  const { search } = useLocation();

  const { styles } = useStyle();

  return (
    <h1>
      <Link
        to={utils.getLocalizedPathname('/', isZhCN, search)}
        className={classnames(styles.logo, (isMobile || isMini) && styles.mobile)}
      >
        <img src={logoSrc} draggable={false} alt="logo" />
        <span className={styles.title}>Ant Design X</span>
      </Link>
    </h1>
  );
};

export default Logo;
