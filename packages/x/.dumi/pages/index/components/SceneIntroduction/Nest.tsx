import { createStyles } from 'antd-style';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import { LOCALES, useCustomizationBgStyle } from '../../common/CustomizationProvider';
import CustomizationSender from '../../common/CustomizationSender';

const useStyle = createStyles(({ token, css }) => {
  return {
    container: css`
      display: flex;
      height: 100%;
      width: 100%;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: ${token.paddingLG}px;
    `,
    title: css`
      font-size: 42px;
      color: #ffffff3f;
      line-height: 50px;
      font-weight: 500;
    `,
  };
});

const NestScene: React.FC = () => {
  const { styles } = useStyle();

  const {
    styles: { background },
  } = useCustomizationBgStyle();

  const [locale] = useLocale(LOCALES);
  return (
    <div className={styles.container}>
      <div className={styles.title}>{locale.greeting_short}</div>
      <CustomizationSender
        style={{
          width: 580,
          borderRadius: 32,
        }}
        value={locale.question1}
        className={background}
      />
    </div>
  );
};

export default NestScene;
