import { createStyles } from 'antd-style';
import { useLocation, useNavigate } from 'dumi';
import React, { lazy, Suspense, useEffect, useRef } from 'react';
import useLocale from '../../../hooks/useLocale';
import { getLocalizedPathname, isZhCN } from '../../../theme/utils';
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

const useStyle = createStyles(({ css }) => {
  return {
    container: css`
      height: 500px;
      overflow: hidden;
      cursor: pointer;
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

  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const { styles } = useStyle();

  const LottieComponent = lazy(() => import('./Lottie'));

  const lottieRef = useRef<{ animation: any }>(null);

  const onScrollFn = () => {
    if (window?.scrollY > 600) {
      lottieRef?.current?.animation?.play?.();
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', onScrollFn);
    return () => {
      window.removeEventListener('scroll', onScrollFn);
    };
  }, []);
  return (
    <Container
      className={styles.container}
      title={locale.title}
      desc={locale.desc}
      onClick={() =>
        navigate(getLocalizedPathname('docs/spec/introduce', isZhCN(pathname), search))
      }
    >
      <Suspense>
        <LottieComponent
          config={{
            autoplay: false,
          }}
          ref={lottieRef}
          className={styles.lottie}
          path="https://mdn.alipayobjects.com/huamei_lkxviz/afts/file/nLaTTqe5cMAAAAAAQiAAAAgADtFMAQFr"
        />
      </Suspense>
    </Container>
  );
};

export default DesignBanner;
