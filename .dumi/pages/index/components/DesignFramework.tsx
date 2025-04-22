import { createStyles } from 'antd-style';
import { useLocation } from 'dumi';
import React, { useContext } from 'react';

import useLocale from '../../../hooks/useLocale';
import SiteContext from '../../../theme/slots/SiteContext';
import * as utils from '../../../theme/utils';
import Introduction from '../common/Introduction';

const locales = {
  cn: {
    title: 'AI 设计语言与研发框架',
    desc: '配套生态 , 让你快速搭建网站应用',

    values: 'RICH 设计指南',
    valuesDesc: '意图、角色、会话、混合 UI',
    guide: '组件设计指引',
    guideDesc: '全局样式、设计模式',
    lib: '组件库',
    libDesc: 'Ant Design of React / Angular / Vue',

    // Secondary
    antd: 'Ant Design',
    antdDesc: '企业级 UI 设计语言和 React 组件库',
    antdMobile: 'Ant Design Mobile',
    antdMobileDesc: 'Ant Design移动端 UI 组件库',
    antv: 'AntV',
    antvDesc: '全新一代数据可视化解决方案',
  },
  en: {
    title: 'Design & Framework',
    desc: 'An ecosystem for rapid web app development',

    values: 'RICH Design Guide',
    valuesDesc: 'Intention, Role, Conversation, Hybrid',
    guide: 'Design guide',
    guideDesc: 'Global style and design pattern',
    lib: 'Components Libraries',
    libDesc: 'Ant Design of React / Angular / Vue',

    // Secondary
    antd: 'Ant Design',
    antdDesc:
      'Help designers/developers building beautiful products more flexible and working with happiness',
    antdMobile: 'Ant Design Mobile',
    antdMobileDesc: 'Mobile UI component library',
    antv: 'AntV',
    antvDesc: 'New generation of data visualization solutions',
  },
};

const useStyle = () => {
  return createStyles(({ token, css }) => ({
    container: css`
    `,
    header: css`
    display: flex;
        align-items: center;
        justify-content: center;
        height: 270px;

    `,
    card: css`
      padding: ${token.paddingSM}px;
      border-radius: ${token.borderRadius * 2}px;
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.03),
        0 1px 6px -1px rgba(0, 0, 0, 0.02),
        0 2px 4px rgba(0, 0, 0, 0.02);

        background: #ffffff1a;
        border-radius: 24px;  

      img {
        width: 100%;
        vertical-align: top;
        border-radius: ${token.borderRadius}px;
      }
    `,

    cardMini: css`
      background: #ffffff1a;
      border-radius: 24px;  
      display: block;
      border-radius: ${token.borderRadius * 2}px;
      padding: ${token.paddingMD}px ${token.paddingLG}px;

      img {
        height: 48px;
      }
    `,
  }))();
};

const DesignFramework: React.FC = () => {
  const [locale] = useLocale(locales);
  const { styles } = useStyle();
  const { pathname, search } = useLocation();
  const isZhCN = utils.isZhCN(pathname);
  const { isMobile } = useContext(SiteContext);

  const items = [
    {
      title: locale.values,
      desc: locale.valuesDesc,
      header: (
        <div className={styles.header}>
          <img
            loading="lazy"
            alt="thumbnails"
            style={{ width: 261 }}
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*poTnSZrI7-oAAAAAAAAAAAAADgCCAQ/fmt.webp"
          />
        </div>
      ),
      to: utils.getLocalizedPathname('/docs/spec/introduce', isZhCN, search),
    },
    {
      title: locale.guide,
      desc: locale.guideDesc,
      header: (
        <div className={styles.header}>
          <img
            loading="lazy"
            alt="thumbnails"
            style={{ width: 184 }}
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Off_QYoo0GIAAAAAAAAAAAAADgCCAQ/fmt.webp"
          />
        </div>
      ),
      to: utils.getLocalizedPathname('/docs/spec/hybrid-ui-design', isZhCN, search),
    },
    {
      title: locale.lib,
      desc: locale.libDesc,
      header: (
        <div className={styles.header}>
          <img
            loading="lazy"
            alt="thumbnails"
            style={{ width: 227 }}
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*AhrTT6K2vU0AAAAAAAAAAAAADgCCAQ/fmt.webp"
          />
        </div>
      ),
      to: utils.getLocalizedPathname('/components/overview', isZhCN, search),
    },
    {
      title: locale.antd,
      desc: locale.antdDesc,
      icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*dUzuRJes4pUAAAAAAAAAAAAADgCCAQ/original',
      to: 'https://ant.design/',
    },
    {
      title: locale.antdMobile,
      desc: locale.antdMobileDesc,
      icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*rzh3RoWC9zAAAAAAAAAAAAAADgCCAQ/original',
      to: 'https://mobile.ant.design/',
    },
    {
      title: locale.antv,
      desc: locale.antvDesc,
      icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*9MFyQ77L6E4AAAAAAAAAAAAADgCCAQ/fmt.webp',
      to: 'https://antv.vision/',
    },
  ];

  return (
    <Introduction
      cardStyle={{ background: '#ffffff1a', color: '#fff' }}
      title={locale.title}
      desc={locale.desc}
      items={items}
      column={isMobile ? 1 : 3}
    />
  );
};

export default DesignFramework;
