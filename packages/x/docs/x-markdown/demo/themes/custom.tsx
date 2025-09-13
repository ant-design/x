import { XMarkdown } from '@ant-design/x-markdown';
import { createStyles, css } from 'antd-style';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import { useIntl } from 'react-intl';
import { Adx_Markdown_En, Adx_Markdown_Zh } from '../_utils/adx-markdown';

const useStyles = createStyles(({ token }) => ({
  customMarkdown: css`
    /* 覆盖HTML标签样式 */
    h1 {
      color: ${token.colorPrimary};
      font-size: 32px;
      margin-bottom: 24px;
      text-align: center;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, ${token.colorPrimary}, ${token.colorPrimaryHover});
        border-radius: 2px;
      }
    }

    h2 {
      color: ${token.colorTextHeading};
      font-size: 24px;
      margin: 32px 0 16px;
      padding-left: 12px;
      border-left: 4px solid ${token.colorPrimary};
    }

    h3 {
      color: ${token.colorText};
      font-size: 20px;
      margin: 24px 0 12px;
    }

    p {
      color: ${token.colorTextSecondary};
      line-height: 1.8;
      margin-bottom: 16px;
    }

    ul,
    ol {
      color: ${token.colorTextSecondary};
      line-height: 1.8;
      margin-bottom: 16px;

      li {
        margin-bottom: 8px;
        position: relative;

        &::before {
          color: ${token.colorPrimary};
          font-weight: bold;
        }
      }
    }

    ul li::before {
      content: '• ';
    }

    ol li::before {
      content: counter(list-item) '. ';
    }
  `,
}));

const App = () => {
  const { styles } = useStyles();
  const { locale } = useIntl();
  const content = locale === 'zh-CN' ? Adx_Markdown_Zh : Adx_Markdown_En;
  return (
    <div style={{ padding: 24 }}>
      <XMarkdown content={content} className={styles.customMarkdown} />
    </div>
  );
};

export default App;
