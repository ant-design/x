import { createStyles, css } from 'antd-style';
import React, { Suspense } from 'react';

import useDark from '../../hooks/useDark';
import useLocale from '../../hooks/useLocale';
import BannerRecommends from './components/BannerRecommends';
import Group from './components/Group';
import PreviewBanner from './components/PreviewBanner';

const DesignFramework = React.lazy(() => import('./components/DesignFramework'));

const useStyle = createStyles(() => ({
  image: css`
    position: absolute;
    inset-inline-start: 0;
    top: -50px;
    height: 160px;
  `,
}));

const locales = {
  cn: {
    assetsTitle: '组件丰富，选用自如',
    assetsDesc: '大量实用组件满足你的需求，灵活定制与拓展',
    designTitle: '设计语言与研发框架',
    designDesc: '配套生态，让你快速搭建网站应用',
  },
  en: {
    assetsTitle: 'Rich components',
    assetsDesc: 'Practical components to meet your needs, flexible customization and expansion',
    designTitle: 'Design and framework',
    designDesc: 'Supporting ecology, allowing you to quickly build website applications',
  },
};

const Homepage: React.FC = () => {
  const [locale] = useLocale(locales);
  const { styles } = useStyle();

  const isRootDark = useDark();

  return (
    <section>
      <PreviewBanner>
        <BannerRecommends />
      </PreviewBanner>

      <div>
        {/* 设计语言 */}
        <Group
          title={locale.designTitle}
          description={locale.designDesc}
          background={isRootDark ? '#393F4A' : '#F5F8FF'}
          decoration={
            <img
              draggable={false}
              className={styles.image}
              src="https://gw.alipayobjects.com/zos/bmw-prod/ba37a413-28e6-4be4-b1c5-01be1a0ebb1c.svg"
              alt="bg"
            />
          }
        >
          <Suspense fallback={null}>
            <DesignFramework />
          </Suspense>
        </Group>
      </div>
    </section>
  );
};

export default Homepage;
