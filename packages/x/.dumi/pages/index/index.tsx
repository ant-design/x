import { createStyles } from 'antd-style';
import classnames from 'classnames';
import React, { lazy, Suspense } from 'react';
import DesignBanner from './components/DesignBanner';
import MainBanner from './components/MainBanner';

const useStyle = createStyles(({ token, css }) => {
  return {
    section: css`
      background: linear-gradient(180deg, #1e2226e6 0%, #1c2024 38%, #16191c 100%);
      border-radius: 40px 40px 0 0;
      backdrop-filter: blur(40px);
      display: flex;
      flex-direction: column;
      gap: ${token.pcContainerMargin}px;
      padding: ${token.pcContainerMargin}px 0;
    `,
    container: css`
      margin-top: -40px;
    `,
    framework: css`
      border-radius: 0;
      background-image: linear-gradient(90deg, #5a37e6 0%, #0059c9 100%);
    `,
  };
});

const Homepage: React.FC = () => {
  const { styles } = useStyle();

  const DesignFramework = lazy(() => import('./components/DesignFramework'));

  const CompIntroduction = lazy(() => import('./components/CompIntroduction'));

  const SceneIntroduction = lazy(() => import('./components/SceneIntroduction'));

  const DesignGuide = lazy(() => import('./components/DesignGuide'));

  return (
    <main>
      <MainBanner />
      <section className={styles.section}>
        <DesignBanner />
      </section>
      <section className={classnames(styles.section, styles.container)}>
        <Suspense>
          <DesignGuide />
        </Suspense>
      </section>
      <section className={classnames(styles.section, styles.container)}>
        <Suspense>
          <SceneIntroduction />
        </Suspense>
        <Suspense>
          <CompIntroduction />
        </Suspense>
      </section>
      <section className={classnames(styles.section, styles.framework, styles.container)}>
        <Suspense>
          <DesignFramework />
        </Suspense>
      </section>
    </main>
  );
};

export default Homepage;
