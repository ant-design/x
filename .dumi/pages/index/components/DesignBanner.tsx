import { createStyles } from 'antd-style';
import lottie from 'lottie-web';
import React from 'react';

import useLocale from '../../../hooks/useLocale';
import Container from '../common/Container';

const locales = {
  cn: {
    title: 'AI 设计范式 - RICH',
    desc: '我们致力于构建 AI 设计理论，并在蚂蚁内部海量 AI 产品中实践、迭代。在此过程中，RICH 设计范式应运而生：角色（Role）、意图（Intention）、会话（Conversation）和混合界面（Hybrid UI） ',
  },
  en: {
    title: 'AI Design Paradigm - RICH',
    desc: "We focus on developing AI design theory, iterating it across Ant Group's AI products, leading to the RICH design paradigm: Role, Intention, Conversation, and Hybrid UI.",
  },
};

const useStyle = createStyles(({ token, css }) => {
  return {
    container: css`
      height: 500px;
      overflow: hidden;
      font-family: AlibabaPuHuiTiB, ${token.fontFamily}, sans-serif;
    `,
    title: css`
      font-size: 48px;
      color: ${token.colorText};
    `,
    desc: css`
      color: ${token.colorTextSecondary};
      max-width: 880px !important;
    `,
    lottie: css`
      width: 100%;
      height: auto;
      transform: translate(0, -20%);
    `,
  };
});

const DesignBanner: React.FC = () => {
  const [locale] = useLocale(locales);

  const { styles } = useStyle();

  const id = React.useId();

  React.useEffect(() => {
    const animation = lottie.loadAnimation({
      container: document.getElementById(`design-guide-${id}`) as Element,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*6J33TJUtOVsAAAAAAAAAAAAADgCCAQ',
    });

    window.addEventListener('scroll', () => {
      if (animation.isLoaded && window.scrollY > 600) {
        animation.play();
      }
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <Container className={styles.container} title={locale.title} desc={locale.desc}>
      <div id={`design-guide-${id}`} className={styles.lottie} />
    </Container>
  );
};

export default DesignBanner;
