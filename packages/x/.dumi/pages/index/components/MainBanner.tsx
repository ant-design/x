import { Button } from 'antd';
import { createStyles } from 'antd-style';
import classnames from 'classnames';
import { useLocation } from 'dumi';
import type { AnimationDirection, AnimationItem } from 'lottie-web';
import React, { lazy, Suspense, useRef } from 'react';
import useLocale from '../../../hooks/useLocale';
import Link from '../../../theme/common/Link';
import { getLocalizedPathname, isZhCN } from '../../../theme/utils';
import Container from '../common/Container';
import type { SiteContextProps } from './SiteContext';
import SiteContext from './SiteContext';

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
      height: calc(100vh - 160px);
      min-height: 600px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
        height: calc(100vh - ${token.paddingLG}px);
      }
    `,
    background: css`
      width: 100%;
      height: 100vh;
      position: absolute;
      filter: blur(50px);
      background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%);
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

      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: ${token.paddingXS}px;
      }
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
      position: relative;

      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
        padding: 0 ${token.paddingLG}px;
      }
    `,
    startBtn: css`
      background: linear-gradient(90deg, #c7deff 0%, #ffffffd9 76%);
      color: #14204c;
      position: relative;

      ::after {
        content: '';
        position: absolute;
        border-radius: 40px;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.5);
        opacity: 0;
        z-index: -1;
        transition: opacity 0.2s;
      }

      :hover::after {
        opacity: 1;
      }
    `,
    designBtn: css`
      background: #ffffff1a;
      backdrop-filter: blur(40px);

      &::after {
        content: '';
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: inherit;

        position: absolute;
        top: 0;
        bottom: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;

        padding: ${token.lineWidth}px;
        background: linear-gradient(180deg, #ffffff26 0%, #ffffff00 100%);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
      };
  `,
  };
});

const MainBanner: React.FC = () => {
  const [locale] = useLocale(locales);

  const { pathname, search } = useLocation();

  const { direction, isMobile } = React.useContext<SiteContextProps>(SiteContext);

  const { styles } = useStyle();

  const LottieComponent = lazy(() => import('./Lottie'));

  const animationDirection = useRef<AnimationDirection>(1);

  const onLoad = (animation: AnimationItem) => {
    animation?.addEventListener('complete', () => {
      animation.loop = true;
      animation.setSpeed(0.7);
      animation.playSegments([100, 150], false);
    });
  };
  const onBackgroundLoad = (animation: AnimationItem) => {
    animation?.addEventListener('complete', () => {
      animationDirection.current = animationDirection.current === -1 ? 1 : -1;
      animation.setDirection(animationDirection.current);
      animation.setSpeed(0.6);
      animation.play();
    });
  };

  return (
    <section className={styles.banner}>
      <Suspense>
        <LottieComponent
          onLoad={onBackgroundLoad}
          className={styles.background}
          path="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*3QcuQpaOguQAAAAAAAAAAAAADgCCAQ"
        />
      </Suspense>
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
            <Link to={getLocalizedPathname('components/introduce', isZhCN(pathname), search)}>
              <button type="button" className={classnames(styles.btn, styles.startBtn)}>
                {locale.start}
              </button>
            </Link>
            <Link to={getLocalizedPathname('/docs/spec/introduce', isZhCN(pathname), search)}>
              <Button type="text" className={classnames(styles.btn, styles.designBtn)}>
                {locale.design}
              </Button>
            </Link>
          </div>
        </div>
        {!isMobile && (
          <Suspense>
            <LottieComponent
              onLoad={onLoad}
              className={classnames(styles.lottie, direction === 'rtl' && styles.lottie_rtl)}
              path="https://mdn.alipayobjects.com/huamei_lkxviz/afts/file/fy4QS4amXA4AAAAAQPAAAAgADtFMAQFr"
            />
          </Suspense>
        )}
      </Container>
    </section>
  );
};

export default MainBanner;
