import { createStyles } from 'antd-style';
import classnames from 'classnames';
import React from 'react';
import CompIntroduction from './components/CompIntroduction';
import DesignBanner from './components/DesignBanner';
import DesignFramework from './components/DesignFramework';
import DesignGuide from './components/DesignGuide';
import MainBanner from './components/MainBanner';
import SceneIntroduction from './components/SceneIntroduction';

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
  };
});

const Homepage: React.FC = () => {
  const { styles } = useStyle();

  return (
    <main>
      <MainBanner />
      <section className={styles.section}>
        <DesignBanner />
      </section>
      <section className={classnames(styles.section, styles.container)}>
        <DesignGuide />
      </section>
      <section className={classnames(styles.section, styles.container)}>
        <SceneIntroduction />
        <CompIntroduction />
      </section>
      <section className={classnames(styles.section, styles.container)}>
        <DesignFramework />
      </section>
    </main>
  );
};

export default Homepage;
