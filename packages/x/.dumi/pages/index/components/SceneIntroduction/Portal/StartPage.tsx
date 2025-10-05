import { Button, Carousel } from 'antd';
import { createStyles } from 'antd-style';
import classnames from 'classnames';
import { useLocation } from 'dumi';
import React from 'react';
import useLocale from '../../../../../hooks/useLocale';
import Link from '../../../../../theme/common/Link';
import { getLocalizedPathname, isZhCN } from '../../../../../theme/utils';

const locales = {
  cn: {
    slogan: 'AI 体验新秩序',
    subTitle: '我能帮上什么忙？',
    desc: 'Ant Design 团队匠心呈现 RICH 设计范式，打造卓越 AI 界面解决方案，引领智能新体验。',
    start: '开始使用',
    design: '设计语言',
  },
  en: {
    slogan: 'New AI Experience',
    subTitle: 'What can I help with?',
    desc: 'The Ant Design team presents the RICH paradigm, crafting superior AI interface solutions and pioneering intelligent experiences.',
    start: 'Get Started',
    design: 'Get Design',
  },
};

const useStyle = createStyles(({ token, css }) => {
  return {
    container: css`
        text-align: center;
        display: flex;
        flex-direction: column;
        min-height: 30%;
        justify-content: space-around;
        `,
    x: css`
        transition: rotate ${token.motionDurationMid};
        width:68px;
        margin-left: -5px;
        display: inline-flex;
        justify-content:center;    
        font-size: 68px; 
        `,
    title: css`
        top: 50%;
      
        
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
    name: css`
      font-size: 64px !important;
      white-space: nowrap;
      line-height: 1.3;
      color: ${token.colorText};
      font-weight: bold;

      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
        font-size: 54px !important;
      }
    `,
    carouselItem: css`
     height: 80px;
     box-sizing:border-box;
     line-height: 80px;

    `,
    subTitle: css`
         font-weight: 500;
         font-size: 32px;
    `,
    desc: css`
      font-size: ${token.fontSizeHeading5}px;
      font-weight: 400;
      white-space: nowrap;
      color: ${token.colorText};
    `,
    slogan: css`
      font-size: 32px;
      font-weight: 500;
      white-space: nowrap;
      color: ${token.colorText};
    `,
    iAlphabet: css`
      position: relative;
      font-size: 50px;
      display: inline-block;
      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
        transform: scale(0.7);
        top: 6px;
      }
    `,
    iAlphabetStar: css`
      position: absolute;
      top: -8px;
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
      width: 100%;
      justify-content: center;
    `,
    btn: css`
      height: 40px;
      border: none;
      border-radius: ${token.borderRadius}px;
      padding: 0 26px;
      display: inline-block;
      font-size: 16px;
      cursor: pointer;
      font-weight: 500;
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
      box-sizing: border-box;
      border: none!important;
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

const StartPage: React.FC = () => {
  const [locale] = useLocale(locales);
  const { styles } = useStyle();
  const { pathname, search } = useLocation();
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1 className={styles.name}>
          Ant Des
          <span className={styles.iAlphabet}>
            I<span className={styles.iAlphabetStar} />
          </span>
          gn <div className={classnames(styles.x, 'x-hover')}>X</div>
        </h1>
      </div>
      <Carousel
        autoplay
        style={{
          marginBlock: 20,
        }}
        dots={false}
        dotPosition="left"
      >
        <div className={classnames(styles.carouselItem, styles.subTitle)}>{locale.subTitle}</div>
        <div className={classnames(styles.carouselItem, styles.slogan)}>{locale.slogan}</div>
        <div className={classnames(styles.carouselItem, styles.desc)}>{locale.desc}</div>
      </Carousel>
      <div className={styles.content}>
        <Link to={getLocalizedPathname('components/overview', isZhCN(pathname), search)}>
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
  );
};

export default StartPage;
