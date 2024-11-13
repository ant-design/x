import { createStyles } from 'antd-style';
import React from 'react';

import DesignBanner from './components/DesignBanner';
import DesignGuide from './components/DesignGuide';
import MainBanner from './components/MainBanner';

const useStyle = createStyles(({ token, css }) => {
  return {
    designContent: css`
      background-image: linear-gradient(180deg, #1e2226e6 0%, #1c2024 38%, #16191c 100%);
      border-radius: 40px 40px 0 0;
      backdrop-filter: blur(40px);
      display: flex;
      flex-direction: column;
      padding: ${token.pcContainerXMargin}px 0;
    `,
  };
});

const Homepage: React.FC = () => {
  const { styles } = useStyle();

  return (
    <main>
      <MainBanner />
      <section className={styles.designContent}>
        <DesignBanner />
        <DesignGuide />
      </section>
    </main>
  );
};

export default Homepage;
