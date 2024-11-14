import { Button } from 'antd';
import { createStyles } from 'antd-style';
import classnames from 'classnames';
import React from 'react';

import useLocale from '../../../hooks/useLocale';
import Container from '../common/Container';

const locales = {
  cn: {
    title: '试一试 , 多种 AI 场景体验',
    desc: '提供多场景解决方案 , 帮助用户提高与 AI 协作效率',

    independent_title: 'Web 独立式',
    independent_desc: '自然语言为主 , 几乎没有界面操作',

    assistant_title: 'Web 助手式',
    assistant_desc: '自然语言和界面操作均衡配合使用',

    nest_title: 'Web 嵌入式',
    nest_desc: '界面操作为主 , 偶尔唤起AI指令',

    app_title: 'App 端',
    app_desc: '疯狂研发中 , 敬请期待',
  },
  en: {
    title: 'Multiple AI Scenario Experiences',
    desc: 'Offering multi-scenario solutions to help users enhance collaboration efficiency with AI',

    independent_title: 'Web - Independent',
    independent_desc: 'Primarily LUI',

    assistant_title: 'Web - Assistant',
    assistant_desc: 'Mix of LUI and GUI',

    nest_title: 'Web - Nest',
    nest_desc: 'Mainly UI-driven',

    app_title: 'Mobile - APP',
    app_desc: 'In development, stay tuned',
  },
};

const useStyle = createStyles(({ token, css }) => {
  return {
    container: css`
      font-family: AlibabaPuHuiTiB, ${token.fontFamily}, sans-serif;
    `,
    content: css`
      display: flex;
      width: 100%;
      margin-top: ${token.margin}px;
    `,
    tab: css`
      min-width: 280px;
      display: flex;
      flex-direction: column;
      gap: ${token.margin}px;
    `,
    tab_content: css`
      position: relative;
      width: 100%;
      height: 600px;
      border-radius: 28px;
      overflow: hidden;
    `,
    item: css`
      position: relative;
      border-radius: 20px;
      height: 86px;
      padding: ${token.padding}px;
      overflow: hidden;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      cursor: pointer;
    `,
    'item-disabled': css`
      h3,p {
        color: ${token.colorTextDisabled};
      }
    `,
    'item-active': css`
      background: #ffffff1a;

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
    item_title: css`
      font-size: ${token.fontSizeHeading4}px;
      color: #ffffff;
      font-weight: 500;
    `,
    item_desc: css`
      font-size: 14px;
      color: #ffffff;
      line-height: 22px;
      opacity: 0.65;
    `,
  };
});

const SceneBanner: React.FC = () => {
  const { styles } = useStyle();
  const [locale] = useLocale(locales);

  const tabItems = [
    {
      key: 'independent',
      title: locale.independent_title,
      desc: locale.independent_desc,
    },
    {
      key: 'assistant',
      title: locale.assistant_title,
      desc: locale.assistant_desc,
    },
    {
      key: 'nest',
      title: locale.nest_title,
      desc: locale.nest_desc,
    },
    {
      key: 'app',
      title: locale.app_title,
      desc: locale.app_desc,
      disabled: true,
    },
  ];

  const [active, setActive] = React.useState<string>(tabItems[0].key);

  const genHandleActive = (key: string) => () => setActive(key);

  return (
    <Container className={styles.container} title={locale.title} desc={locale.desc}>
      <div className={styles.content}>
        <div className={styles.tab}>
          {tabItems.map((item) => (
            <Button
              key={item.key}
              disabled={item.disabled}
              className={classnames(
                styles.item,
                active === item.key && styles['item-active'],
                item.disabled && styles['item-disabled'],
              )}
              type="text"
              onClick={genHandleActive(item.key)}
            >
              <h3 className={styles.item_title}>{item.title}</h3>
              <p className={styles.item_desc}>{item.desc}</p>
            </Button>
          ))}
        </div>
        <div className={styles.tab_content} />
      </div>
    </Container>
  );
};

export default SceneBanner;