import { createStyles } from 'antd-style';
import React from 'react';

import { useLocation, useNavigate } from 'dumi';
import { getLocalizedPathname, isZhCN } from '../../../theme/utils';

import useLocale from '../../../hooks/useLocale';
import useLottie from '../../../hooks/useLottie';
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

  const [lottieRef] = useLottie({
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*6J33TJUtOVsAAAAAAAAAAAAADgCCAQ',
  });

  return (
    <Container
      className={styles.container}
      title={locale.title}
      desc={locale.desc}
      onClick={() =>
        navigate(getLocalizedPathname('docs/spec/introduce', isZhCN(pathname), search))
      }
    >
      <div ref={lottieRef} className={styles.lottie} />
    </Container>
  );
};

export default DesignBanner;
