import { Alert, Button, Space } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';

import useLocale from '../../../hooks/useLocale';

const useStyle = createStyles(({ token, css }) => {
  return {
    alert: css`
        height: ${token.alertHeight}px;
        width: 100%;
        position: fixed;
        top: 0px;
        z-index: 1000;
        border: none;
        border-radius: 0;
        background: linear-gradient(90deg, #fe8aff 0%, rgb(111, 179, 226) 66%, rgb(108, 87, 255) 100%);
        .ant-alert-message{
            color: #000;
            text-align: center;
        }
        .ant-btn-color-link.ant-btn-variant-link{
            padding: 0;
        }
    `,
  };
});

const locales = {
  cn: {
    content: '',
    link: '立即前往',
  },
  en: {
    content: '',
    link: 'Go to',
  },
};

const Index: React.FC<{ afterClose: () => void }> = ({ afterClose }) => {
  const { styles } = useStyle();
  const [locale] = useLocale(locales);

  return (
    <Alert
      className={styles.alert}
      closable
      afterClose={afterClose}
      message={
        <Space>
          {locale.content}
          <Button
            type="link"
            onClick={() => {
              window.open('https://weavefox.cn/?ref=seeconf2025&source=antdx', '_blank');
            }}
          >
            {locale.link}
          </Button>
        </Space>
      }
    />
  );
};

export default Index;
