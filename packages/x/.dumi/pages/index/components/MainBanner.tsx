import { createStyles } from 'antd-style';
import React, { useContext } from 'react';
import useLottie from '../../../hooks/useLottie';
import Context from '../../../theme/layouts/IndexLayout/Context';
import Portal from './SceneIntroduction/Portal';

const useStyle = createStyles(({ token, css }, isOnAgent: boolean) => {
  return {
    banner: css`
      width: 100vw;
      height: calc(100vh - ${isOnAgent ? 80 : 235}px);
      min-height: 700px;
      margin-block-start: 64px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
      @media only screen and (max-width: ${token.mobileMaxWidth}px) {
      height: calc(100vh - ${token.paddingLG}px);
      }
      &:hover .x-hover{
        rotate: -90deg;
        color: transparent;
        background-repeat:no-repeat;
        background-size:contain;
        background-position:center;
        background-image:url('https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/MGdkQ6iLuXEAAAAAQDAAAAgADtFMAQFr/original')
        }
    `,
    background: css`
      width: 100%;
      height: 100%;
      position: absolute;
      filter: blur(50px);
      z-index:0;
      background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%);
    `,
  };
});

const MainBanner: React.FC = () => {
  const { isOnAgent } = useContext(Context);
  const { styles } = useStyle(isOnAgent);
  const [bgLottieRef, bgAnimation] = useLottie({
    renderer: 'svg',
    loop: false,
    autoplay: false,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
    path: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*3QcuQpaOguQAAAAAAAAAAAAADgCCAQ',
  });

  React.useEffect(() => {
    if (!bgAnimation) return;

    let isReverse = false;

    function playAnimation() {
      if (!bgAnimation) return;

      if (isReverse) {
        bgAnimation.setDirection(-1);
        bgAnimation.goToAndPlay(bgAnimation.totalFrames - 1, true);
      } else {
        bgAnimation.setDirection(1);
        bgAnimation.goToAndPlay(0, true);
      }
      isReverse = !isReverse;
    }

    bgAnimation.addEventListener('data_ready', playAnimation);
    playAnimation();
    return () => {
      bgAnimation.destroy();
    };
  }, [!!bgAnimation]);

  return (
    <section className={styles.banner}>
      <div ref={bgLottieRef} className={styles.background} />
      <Portal />
    </section>
  );
};

export default MainBanner;
