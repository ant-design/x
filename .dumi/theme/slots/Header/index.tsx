import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import { createStyles } from 'antd-style';
import classnames from 'classnames';
import React, { useEffect } from 'react';

import useLocale from '../../../hooks/useLocale';
import useScrollY from '../../../hooks/useScrollY';
import SiteContext from '../SiteContext';

import HeaderActions from './Actions';
import Logo from './Logo';
import Navigation from './Navigation';

import { useLocation } from 'dumi';
import type { SiteContextProps } from '../SiteContext';
import type { SharedProps } from './interface';

const useStyle = createStyles(({ token, css }) => {
  return {
    header: css`
      height: ${token.headerHeight}px;
      width: 100%;
      box-sizing: border-box;

      position: fixed;
      top: 0;
      z-index: 1000;

      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: padding 0.2s ease-in-out, margin 0.2s ease-in-out, opacity 0.2s ease-in-out;
    `,
    mobile: css`
      height: 48px;
      width: calc(100% - ${token.paddingLG * 2}px);
      padding: 0 ${token.paddingLG}px;
      margin: 0 ${token.paddingLG}px;
      
      top: ${(token.headerHeight - token.paddingLG * 2) / 2}px;
      overflow: hidden;
      
      border-radius: ${token.indexRadius}px;
    `,
    mini: css`
      width: min-content !important;
      margin: 0 !important;
      gap: ${token.paddingLG}px;
      inset-inline-end: 50%;
      transform: translateX(50%);
    `,
    hidden: css`
      opacity: 0;
    `,
    mini_rtl: css`
      inset-inline-start: 50%;
    `,
    background: css`
      position: auto;
      background: linear-gradient(117deg, #ffffff1a 17%, #ffffff0d 51%);
      backdrop-filter: blur(40px);

      pointer-events: auto;

      box-shadow: ${token.boxShadow};

      &::before, &::after {
        content: '';
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: inherit;

        position: absolute;
        top: 0;
        bottom: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;

        pointer-events: none;
      };

      &::before {
        border: ${token.lineWidth}px solid;
        border-image: linear-gradient(100deg, #ffffff53 0%, #ffffff00 100%);
        border-image-slice: 1 0 0 1;
        filter: blur(2px);
      };

      &::after {
        padding: ${token.lineWidth}px;
        background: linear-gradient(180deg, #ffffff26 0%, #ffffff00 100%);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
      };
    `,
  };
});

const Header: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [, lang] = useLocale();
  const { pathname } = useLocation();

  const { direction, isMobile } = React.useContext<SiteContextProps>(SiteContext);

  const { styles } = useStyle();

  const { scrollY, scrollYDirection } = useScrollY();

  const innerHeight = window?.innerHeight || 1080;

  const isMini = scrollY > innerHeight && !isMobile;

  const sharedProps: SharedProps = {
    isZhCN: lang === 'cn',
    isRTL: direction === 'rtl',
    isMobile,
    isMini,
  };

  let content = null;

  useEffect(() => {
    isMobile && setOpen(false);
  }, [pathname]);

  if (isMobile) {
    content = (
      <Drawer
        closable={false}
        footer={<HeaderActions {...sharedProps} />}
        onClose={() => setOpen(false)}
        open={open}
        placement="top"
        height="100%"
        zIndex={999}
      >
        <Navigation {...sharedProps} />
      </Drawer>
    );
  } else {
    content = (
      <>
        <Navigation
          {...sharedProps}
          className={classnames(!isMobile && !isMini && styles.background)}
        />
        <HeaderActions {...sharedProps} />
      </>
    );
  }

  const isHidden = scrollY > innerHeight * 1.5 && scrollYDirection === 'down';

  return (
    <header
      className={classnames(
        styles.header,
        (isMobile || isMini) && styles.background,
        (isMobile || isMini) && styles.mobile,
        isMini && styles.mini,
        isMini && direction === 'rtl' && styles.mini_rtl,
        isHidden && styles.hidden,
      )}
    >
      <Logo {...sharedProps} />
      {isMobile && (
        <Button
          onClick={() => setOpen((pre) => !pre)}
          type="text"
          icon={open ? <CloseOutlined /> : <MenuOutlined />}
        />
      )}
      {content}
    </header>
  );
};

export default Header;
