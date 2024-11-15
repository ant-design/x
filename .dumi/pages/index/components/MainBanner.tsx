import { createStyles } from 'antd-style';
import classnames from 'classnames';
import { Link, useLocation } from 'dumi';
import lottie from 'lottie-web';
import React from 'react';

import useLocale from '../../../hooks/useLocale';
import { getLocalizedPathname, isZhCN } from '../../../theme/utils';
import Container from '../common/Container';
import SiteContext from './SiteContext';
import type { SiteContextProps } from './SiteContext';

const locales = {
  cn: {
    slogan: 'AI 体验新秩序',
    desc: 'Ant Design 团队匠心呈现 RICH 设计范式，打造卓越 AI 界面解决方案，引领智能新体验。',
    start: '开始使用',
    design: '设计语言',
  },
  en: {
    slogan: 'New AI Experience',
    desc: 'The Ant Design team presents the RICH paradigm, crafting superior AI interface solutions and pioneering intelligent experiences.',
    start: 'Get Started',
    design: 'Get Design',
  },
};

const useStyle = createStyles(({ token, css }) => {
  const minBannerWidth = token.mobileMaxWidth - token.padding * 2;

  return {
    banner: css`
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      font-family: AlibabaPuHuiTiB, ${token.fontFamily}, sans-serif;
    `,
    background: css`
      width: 100%;
      height: 110vh;
      position: absolute;
    `,
    container: css`
      height: 100%;
      max-height: calc(100vh - ${token.headerHeight * 2}px);
      position: relative;
    `,
    title: css`
      max-width: ${minBannerWidth}px;
      position: absolute;
      top: 50%;
      inset-inline-start: 0;
      transform: translateY(-50%);
      z-index: 1;
    `,
    lottie: css`
      position: absolute;
      top: 50%;
      inset-inline-end: 0;
      transform: translate(${token.pcContainerMargin}px, -40%);
      z-index: 0;

      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
        display: none;
      }
    `,
    lottie_rtl: css`
      transform: translate(${token.pcContainerMargin * -2}px, -40%) !important;
    `,
    name: css`
      font-size: 80px !important;
      line-height: 1.3;
      color: ${token.colorText};
      font-weight: bold;

      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
        font-size: 54px !important;
      }
    `,
    desc: css`
      font-size: ${token.fontSizeHeading5}px;
      font-weight: 400;
      max-width: 500px;
      color: ${token.colorText};
      opacity: 0.65;
      margin: ${token.marginLG}px 0 ${token.marginLG * 2}px 0;
    `,
    iAlphabet: css`
      position: relative;
      font-size: 60px;
      display: inline-block;

      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
        transform: scale(0.7);
        top: 6px;
      }
    `,
    iAlphabetStar: css`
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 22px;
      height: 22px;
      background: no-repeat center url('https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*RMOpRLHgA9wAAAAAAAAAAAAADgCCAQ/original');
      background-size: cover;

      &::before {
        content: '';
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: inherit;
        position: absolute;
        background: radial-gradient(circle, #fe8aff 0%, #fe8aff00 100%);
        filter: blur(12px);
      };
    `,
    content: css`
      display: flex;
      gap: ${token.paddingLG}px;
      flex-wrap: wrap;
    `,
    btn: css`
      height: 56px;
      border: none;
      border-radius: 40px;
      padding: 0 40px;
      display: inline-block;
      font-size: 18px;
      cursor: pointer;
      font-weight: 600;
      box-shadow: ${token.boxShadow};
    `,
    startBtn: css`
      background: linear-gradient(90deg, #c7deff 0%, #ffffffd9 76%);
      color: #14204c;
    `,
    designBtn: css`
      background: #ffffff1a;
      backdrop-filter: blur(40px);
  `,
  };
});

const MainBanner: React.FC = () => {
  const [locale] = useLocale(locales);

  const { pathname, search } = useLocation();

  const { direction } = React.useContext<SiteContextProps>(SiteContext);

  const id = React.useId();

  const { styles } = useStyle();

  React.useEffect(() => {
    const animation = lottie.loadAnimation({
      container: document.getElementById(`main-banner-bg-${id}`) as Element,
      renderer: 'canvas',
      loop: false,
      autoplay: false,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
      path: 'https://mdn.alipayobjects.com/huamei_k0vkmw/afts/file/A*Zd4ZQKnIfi4AAAAAAAAAAAAADsR-AQ',
    });

    let isReverse = false;

    function playAnimation() {
      if (isReverse) {
        animation.setDirection(-1);
        animation.goToAndPlay(animation.totalFrames - 1, true);
      } else {
        animation.setDirection(1);
        animation.goToAndPlay(0, true);
      }
      isReverse = !isReverse;
    }

    animation.addEventListener('complete', playAnimation);

    playAnimation();

    return () => {
      animation.destroy();
    };
  }, []);

  React.useEffect(() => {
    const animation = lottie.loadAnimation({
      container: document.getElementById(`main-banner-ip-${id}`) as Element,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
      path: 'https://mdn.alipayobjects.com/huamei_k0vkmw/afts/file/A*9a6-RaC0zzYAAAAAAAAAAAAADsR-AQ',
    });

    let reverseFrameInterval: NodeJS.Timeout;

    animation.addEventListener('complete', () => {
      let currentFrame = animation.totalFrames;
      const reverseFrames = 30;

      reverseFrameInterval = setInterval(() => {
        currentFrame--;
        animation.goToAndStop(currentFrame, true);

        if (currentFrame <= animation.totalFrames - reverseFrames) {
          clearInterval(reverseFrameInterval);
          animation.play();
        }
      }, 1000 / 30);
    });

    return () => {
      animation.destroy();
      window.clearInterval(reverseFrameInterval);
    };
  }, []);

  return (
    <section className={styles.banner}>
      <div id={`main-banner-bg-${id}`} className={styles.background} />
      <Container className={styles.container}>
        <div className={styles.title}>
          <h1 className={styles.name}>
            Ant Des
            <span className={styles.iAlphabet}>
              I<span className={styles.iAlphabetStar} />
            </span>
            gn X
          </h1>
          <h1 className={styles.name}>{locale.slogan}</h1>
          <h5 className={styles.desc}>{locale.desc}</h5>

          <div className={styles.content}>
            <Link to={getLocalizedPathname('components/overview', isZhCN(pathname), search)}>
              <button type="button" className={classnames(styles.btn, styles.startBtn)}>
                {locale.start}
              </button>
            </Link>
            <Link to={getLocalizedPathname('/docs/spec/introduce', isZhCN(pathname), search)}>
              <button type="button" className={classnames(styles.btn, styles.designBtn)}>
                {locale.design}
              </button>
            </Link>
          </div>
        </div>
        <div
          id={`main-banner-ip-${id}`}
          className={classnames(styles.lottie, direction === 'rtl' && styles.lottie_rtl)}
        />
      </Container>
    </section>
  );
};

export default MainBanner;
