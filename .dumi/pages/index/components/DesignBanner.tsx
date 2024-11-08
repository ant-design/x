import { createStyles } from 'antd-style';
import lottie from 'lottie-web';
import React from 'react';

import useLocale from '../../../hooks/useLocale';
import Container from './Container';

const locales = {
  cn: {
    title: '开启一场全新 AI 设计之旅',
    desc: '熟悉的 Ant Design 设计语言，全新 AGI 混合界面（Hybrid-UI）解决方案，完美融合 GUI 和自然会话交互。从唤醒到表达，从过程到反馈，合适的组件恰当的呈现在所有的人机互动过程中。',
  },
  en: {
    title: 'Embark on a New AI Design Journey',
    desc: 'Familiar Ant Design language with a new AGI Hybrid-UI solution, seamlessly blending GUI and natural conversational interactions. From awakening to expression, from process to feedback, the right components are thoughtfully placed throughout every human-computer interaction.',
  },
};

const useStyle = createStyles(({ token, css }) => {
  return {
    banner: css`
      height: 500px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: ${token.margin}px;
      align-items: center;
      text-align: center;
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
    <Container className={styles.banner}>
      <h2 className={styles.title}>{locale.title}</h2>
      <p className={styles.desc}>{locale.desc}</p>
      <div id={`design-guide-${id}`} className={styles.lottie} />
    </Container>
  );
};

export default DesignBanner;
