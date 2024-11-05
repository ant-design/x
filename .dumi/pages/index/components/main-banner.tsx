import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import lottie from 'lottie-web';
import React from 'react';

import { Link, useLocation } from 'dumi';
import useLocale from '../../../hooks/useLocale';
import { getLocalizedPathname, isZhCN } from '../../../theme/utils';

const locales = {
  cn: {
    slogan: 'AI 体验新秩序',
    desc: '基于 Ant Design 的 AGI 界面解决方案，创造更美好的智能视界',
    start: '开始使用',
    design: '设计语言',
  },
  en: {
    slogan: 'New Order of AI Experience',
    desc: 'An AGI interface solution based on Ant Design, creating a better intelligent world',
    start: 'Get Started',
    design: 'Design System',
  },
};

const useStyle = createStyles(({ token, css }) => {
  return {
    banner: css`
      width: 100vw;
      height: 100vh;

      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      font-family: AlibabaPuHuiTiB, ${token.fontFamily}, sans-serif;
    `,
    background: css`
      width: 100%;
      height: 100%;
    `,
    content: css`
      width: 100%;
      max-height: calc(100vh - ${token.headerHeight}px);
      padding: 0 120px;
      box-sizing: border-box;

      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    title: css`
    `,
    ip: css`
      width: 100%;
      max-width: 800px;
      height: auto;
      transform: translate(10%, 10%);
    `,
    slogan: css`
      font-size: 80px !important;
      color: ${token.colorText};
      font-weight: bold;
      margin: 0 0 ${token.marginLG}px 0 !important;
    `,
    desc: css`
      font-size: 18px;
      color: ${token.colorTextSecondary};
      line-height: 36px;
      letter-spacing: 0.5px;
      opacity: 0.65;
      padding-bottom: 40px;
    `,
    design: css`
      position: relative;
    `,
    starIcon: css`
      top: 0%;
      left: 50%;
      transform: translate(-50%, 50%);
      position: absolute;
      width: 24px;
      height: 24px;
      background: no-repeat center url('https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*RMOpRLHgA9wAAAAAAAAAAAAADgCCAQ/original');
      background-size: cover;

      &::before {
        content: '';
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: inherit;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        background: radial-gradient(circle, #fe8aff 0%, #fe8aff00 100%);

        filter: blur(8px);
      };
    `,
    startBtn: css`
      width: max-content;
      height: 56px;
      border: none;
      border-radius: 40px;
      padding: 0 40px;
      display: inline-block;

      background-image: linear-gradient(90deg, #c7deff 0%, #ffffffd9 76%);
      box-shadow: ${token.boxShadow};

      font-size: 18px;
      color: #14204c;
      font-weight: 600;

      cursor: pointer;
    `,
    designBtn: css`
      width: max-content;
      height: 56px;
      padding: 0 40px;
      margin: 0 0 0 20px;
      border: none;
      border-radius: 40px;

      background: #ffffff1a;
      backdrop-filter: blur(40px);
      box-shadow: ${token.boxShadow};

      font-size: 18px;
      color: ${token.colorText};
      line-height: 26px;
      font-weight: 600;

      cursor: pointer;
  `,
  };
});

const BannerBg: React.FC = () => {
  const [locale] = useLocale(locales);

  const { pathname, search } = useLocation();

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
      autoplay: false,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
      path: 'https://mdn.alipayobjects.com/huamei_k0vkmw/afts/file/A*9a6-RaC0zzYAAAAAAAAAAAAADsR-AQ',
    });

    animation.addEventListener('DOMLoaded', () => {
      animation.play();
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <div className={styles.banner}>
      <div id={`main-banner-bg-${id}`} className={styles.background} />
      <div className={styles.content}>
        <Typography className={styles.title}>
          <Typography.Title className={styles.slogan}>
            Ant Des
            <span style={{ position: 'relative' }}>
              i<span className={styles.starIcon} />
            </span>
            gn X
          </Typography.Title>
          <Typography.Title className={styles.slogan}>{locale.slogan}</Typography.Title>
          <Typography.Paragraph className={styles.desc}>{locale.desc}</Typography.Paragraph>
          <div>
            <Link to={getLocalizedPathname('components/overview', isZhCN(pathname), search)}>
              <button type="button" className={styles.startBtn}>
                {locale.start}
              </button>
            </Link>
            <Link to={getLocalizedPathname('/docs/spec/introduce', isZhCN(pathname), search)}>
              <button type="button" className={styles.designBtn}>
                {locale.design}
              </button>
            </Link>
          </div>
        </Typography>
        <div id={`main-banner-ip-${id}`} className={styles.ip} />
      </div>
    </div>
  );
};

export default BannerBg;
