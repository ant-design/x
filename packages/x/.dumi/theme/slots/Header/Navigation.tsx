import { createStyles, css } from 'antd-style';
import classnames from 'classnames';
import { useFullSidebarData, useLocation } from 'dumi';
import React from 'react';

import useLocale from '../../../hooks/useLocale';
import Link from '../../common/Link';
import { getLocalizedPathname } from '../../utils';

import type { SharedProps } from './interface';

const locales = {
  cn: {
    design: '设计',
    development: '研发',
    components: '组件',
    playground: '演示',
    blog: '博客',
    resources: '资源',
  },
  en: {
    design: 'Design',
    development: 'Development',
    components: 'Components',
    playground: 'Playground',
    blog: 'Blog',
    resources: 'Resources',
  },
};

const defaultItems = [
  {
    path: '/docs/spec/introduce',
    basePath: '/docs/spec',
    key: 'design',
  },
  {
    path: '/docs/react/introduce',
    basePath: '/docs/react',
    key: 'development',
  },
  {
    path: '/components/overview/',
    basePath: '/components',
    key: 'components',
  },
  {
    path: '/docs/playground/independent',
    basePath: '/playground',
    key: 'playground',
  },
];

const useStyle = createStyles(({ token }) => {
  return {
    nav: css`
      padding: 0 ${token.paddingLG}px;
      border-radius: ${token.indexRadius}px;
      box-sizing: border-box;

      display: flex;
      gap: ${token.paddingLG}px;
      align-items: center;

      a {
        font-size: ${token.fontSizeLG}px;
        color: ${token.colorTextSecondary};
      };

      a:hover {
        color: ${token.colorText};
      }
    `,
    pc: css`
      height: 48px;
      overflow: hidden;

      position: absolute;
      top: 50%;
      inset-inline-start: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;

      flex-direction: row;
    `,
    pc_rtl: css`
      transform: translate(50%, -50%);

      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
        transform: translate(0, 0);
      }
    `,
    mobile: css`
      padding: ${token.headerHeight}px 0 !important;

      flex-direction: column;
    `,
    mini: css`
      flex-direction: row;
      width: max-content;
      padding: 0 !important;
    `,
    item_active: css`
    color: ${token.colorText} !important;
    font-weight: 500;
  `,
  };
});

export interface HeaderNavigationProps extends SharedProps {
  className?: string;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = (props) => {
  const { isZhCN, isMobile, isMini, isRTL, className } = props;

  const { styles } = useStyle();

  const [locale] = useLocale(locales);

  const { search, pathname } = useLocation();

  const [activeKey, setActiveKey] = React.useState<string>();

  const sidebarData = useFullSidebarData();

  const blogList = sidebarData['/docs/blog']?.[0]?.children || [];

  const items = React.useMemo(() => {
    const navItems = [...defaultItems];

    if (blogList.length) {
      navItems.push({
        path: blogList.sort((a, b) => (a.frontmatter?.date > b.frontmatter?.date ? -1 : 1))[0].link,
        basePath: '/docs/blog',
        key: 'blog',
      });
    }

    return navItems;
  }, [blogList.length]);

  React.useEffect(() => {
    if (!items.length || !pathname) return;

    const activeIndex = items.findIndex((item) => pathname.includes(item.basePath));

    if (activeIndex === -1) {
      setActiveKey(undefined);
    } else {
      setActiveKey(items[activeIndex].key);
    }
  }, [pathname, items.length]);

  const makeHandleActiveKeyChange = (key: string) => () => setActiveKey(key);

  return (
    <nav
      className={classnames(
        styles.nav,
        isMobile || isMini ? styles.mobile : styles.pc,
        isMini && styles.mini,
        !isMobile && !isMini && isRTL && styles.pc_rtl,
        className,
      )}
    >
      {items.map((item) => (
        <Link
          key={item.key}
          to={getLocalizedPathname(item.path, isZhCN, search)}
          onClick={makeHandleActiveKeyChange(item.key)}
          className={activeKey === item.key ? styles.item_active : ''}
        >
          {locale[item.key as keyof typeof locale]}
        </Link>
      ))}
    </nav>
  );
};

export default HeaderNavigation;
