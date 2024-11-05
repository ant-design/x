import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import { createStyles } from 'antd-style';
import classnames from 'classnames';
import React from 'react';

import useLocale from '../../../hooks/useLocale';
import SiteContext from '../SiteContext';

import HeaderActions from './Actions';
import Logo from './Logo';
import Navigation from './Navigation';

import type { SiteContextProps } from '../SiteContext';
import type { SharedProps } from './interface';
import useScrollY from './useScrollY';

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
    `,
    mobile: css`
      height: ${token.headerHeight - token.padding * 2}px;
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

      left: 50%;
      transform: translate(-50%, 0);
    `,

    background: css`
      position: auto;
      background-image: linear-gradient(117deg, #ffffff1a 17%, #ffffff0d 51%);
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
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

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
  const { direction, isMobile } = React.useContext<SiteContextProps>(SiteContext);

  const { styles } = useStyle();

  const { scrollY, scrollDirection } = useScrollY();

  const isMini = scrollY > 800 && !isMobile;

  const sharedProps: SharedProps = {
    isZhCN: lang === 'cn',
    isRTL: direction === 'rtl',
    isMobile,
    isMini,
  };

  let content = null;

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

  return (
    <header
      className={classnames(
        styles.header,
        (isMobile || isMini) && styles.background,
        (isMobile || isMini) && styles.mobile,
        isMini && styles.mini,
      )}
      style={{
        display: (isMobile || isMini) && scrollDirection === 'down' ? 'none' : 'flex',
      }}
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
