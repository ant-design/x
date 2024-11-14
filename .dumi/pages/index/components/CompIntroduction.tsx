import { Bubble, Conversations, Prompts, Sender, Suggestion, Welcome } from '@ant-design/x';
import { createStyles } from 'antd-style';
import classnames from 'classnames';
import React from 'react';

import { DeleteOutlined, EditOutlined, EnterOutlined } from '@ant-design/icons';
import useLocale from '../../../hooks/useLocale';
import Introduction, { type IntroductionItem } from '../common/Introduction';
import { DESIGN_STAGE_COLOR } from '../constants/color';
import SiteContext from './SiteContext';

const locales = {
  cn: {
    title: '组件丰富 , 选用自如',
    desc: 'Ant Design X 全新 AI 组件 , 大量实用组件满足你的需求 , 灵活定制与拓展',

    welcome_title: '欢迎组件',
    welcome_desc: '开箱即用、易于配置、极致体验的通用图表库',
    welcome_tag: '唤醒',

    prompts_title: '用户推荐',
    prompts_desc: '让首次接触AI产品的用户快速理解AI能做什么',
    prompts_tag: '唤醒',

    suggestion_title: '快捷命令',
    suggestion_desc: '开箱即用、易于配置、极致体验的通用图表库',
    suggestion_tag: '表达',

    bubble_title: '进度加载',
    bubble_desc: '开箱即用、易于配置、极致体验的通用图表库',
    bubble_tag: '确认',

    actions_title: '结果操作',
    actions_desc: '开箱即用、易于配置、极致体验的通用图表库',
    actions_tag: '反馈',

    conversations_title: '管理对话',
    conversations_desc: '开箱即用、易于配置、极致体验的通用图表库',
    conversations_tag: '通用',
  },
  en: {
    title: 'Abundant Components, Flexible Selection',
    desc: 'Ant Design X’s new AI components offer a wide range of practical options to meet your needs, with flexible customization and expansion',

    welcome_title: 'Welcome',
    welcome_desc: 'Ready to use, easy to set up, with great user experience',
    welcome_tag: 'Activate',

    prompts_title: 'User Guide',
    prompts_desc: 'Helps new users quickly understand AI capabilities',
    prompts_tag: 'Activate',

    suggestion_title: 'Quick Commands',
    suggestion_desc: 'Ready to use, easy to set up, with great user experience',
    suggestion_tag: 'Execute',

    bubble_title: 'Loading Progress',
    bubble_desc: 'Ready to use, easy to set up, with great user experience',
    bubble_tag: 'Confirm',

    actions_title: 'Results',
    actions_desc: 'Ready to use, easy to set up, with great user experience',
    actions_tag: 'Feedback',

    conversations_title: 'Manage Chats',
    conversations_desc: 'Ready to use, easy to set up, with great user experience',
    conversations_tag: 'General',
  },
};

const useStyle = createStyles(({ token, css }) => {
  return {
    header: css`
      height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    background: css`
      background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%) !important;
      overflow: hidden;

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
    welcome: css`
      height: 84px;
      width: 290px;
      display: flex;
      align-items: center;
      gap: ${token.paddingXS}px;
      position: relative;
      box-sizing: border-box;
      border-radius: 20px;

      .ant-welcome-title {
        font-size: 14px;
        font-weight: 400;
      }

      .ant-welcome-description {
        font-size: 11px;
        opacity: 0.65;        
      }
    `,
    prompts: css`
      border-radius: 20px !important;
      width: 290px;
      position: relative;

      .ant-prompts-desc {
        font-size: 12px;
        opacity: 0.9;
      }
    `,
    sender: css`
      width: 290px;
      border-radius: 40px;
    `,
    actions: css`
      width: 230px;
      display: flex;
      align-items: end;
      justify-content: end;
      gap: ${token.paddingSM}px;
      opacity: 0.65;
    `,
    conversations: css`
      width: 290px;
      padding: ${token.padding}px;
      padding-top: 0;
      border-radius: 20px;
      position: relative;

    `,
  };
});

const CompIntroduction: React.FC = () => {
  const { styles } = useStyle();
  const [locale] = useLocale(locales);
  const { isMobile } = React.useContext(SiteContext);

  const items: IntroductionItem[] = [
    {
      title: locale.welcome_title,
      desc: locale.welcome_desc,
      tag: locale.welcome_tag,
      startColor: DESIGN_STAGE_COLOR.AWAKE.START,
      endColor: DESIGN_STAGE_COLOR.AWAKE.END,
      header: (
        <div className={styles.header}>
          <Welcome
            className={classnames(styles.welcome, styles.background)}
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*7iaeT54QpcQAAAAAAAAAAAAADgCCAQ/original"
            title="我是全新 AI 产品创造助手"
            description="可以找小 X 了解任何关于 AI 组件资产的"
          />
        </div>
      ),
    },
    {
      title: locale.prompts_title,
      desc: locale.prompts_desc,
      tag: locale.prompts_tag,
      startColor: DESIGN_STAGE_COLOR.AWAKE.START,
      endColor: DESIGN_STAGE_COLOR.AWAKE.END,
      header: (
        <div className={styles.header}>
          <Prompts
            classNames={{
              item: classnames(styles.prompts, styles.background),
            }}
            items={[
              {
                key: '1',
                label: '🎉 我是全新 AI 产品创造助手',
                description: '可以找小X了解任何关于AI组件资产的',
                children: [
                  {
                    key: '1-1',
                    description: `Ant Design X 全新升级了什么？`,
                  },
                  {
                    key: '1-2',
                    description: `Ant Design X 组件资产有哪些？`,
                  },
                ],
              },
            ]}
          />
        </div>
      ),
    },
    {
      title: locale.suggestion_title,
      desc: locale.suggestion_desc,
      tag: locale.suggestion_tag,
      startColor: DESIGN_STAGE_COLOR.EXPRESS.START,
      endColor: DESIGN_STAGE_COLOR.EXPRESS.END,
      header: (
        <div className={styles.header}>
          <Suggestion items={[{ label: 'What is Ant Design X?', value: 'report' }]} block open>
            {({ onTrigger, onKeyDown }) => {
              return (
                <Sender
                  actions={[
                    <div key="send">
                      <img
                        alt="send"
                        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4e5sTY9lU3sAAAAAAAAAAAAADgCCAQ/original"
                      />
                    </div>,
                  ]}
                  value="/"
                  onChange={(nextVal) => {
                    if (nextVal === '/') {
                      onTrigger();
                    } else if (!nextVal) {
                      onTrigger(false);
                    }
                  }}
                  className={classnames(styles.sender, styles.background)}
                  onKeyDown={onKeyDown}
                  placeholder="输入 / 获取建议"
                />
              );
            }}
          </Suggestion>
        </div>
      ),
    },
    {
      title: locale.bubble_title,
      desc: locale.bubble_desc,
      tag: locale.bubble_tag,
      startColor: DESIGN_STAGE_COLOR.CONFIRM.START,
      endColor: DESIGN_STAGE_COLOR.CONFIRM.END,
      header: (
        <div className={styles.header}>
          <Bubble loading content="Loading..." />
        </div>
      ),
    },
    {
      title: locale.actions_title,
      desc: locale.actions_desc,
      tag: locale.actions_tag,
      startColor: DESIGN_STAGE_COLOR.FEEDBACK.START,
      endColor: DESIGN_STAGE_COLOR.FEEDBACK.END,
      header: (
        <div className={styles.header}>
          <Bubble
            classNames={{
              content: styles.background,
            }}
            content="Ant Design X 全新升级了什么？"
            footer={
              <div className={styles.actions}>
                <EditOutlined />
                <DeleteOutlined />
                <EnterOutlined />
              </div>
            }
          />
        </div>
      ),
    },
    {
      title: locale.conversations_title,
      desc: locale.conversations_desc,
      tag: locale.conversations_tag,
      startColor: DESIGN_STAGE_COLOR.COMMON.START,
      endColor: DESIGN_STAGE_COLOR.COMMON.END,
      header: (
        <div className={styles.header}>
          <Conversations
            className={classnames(styles.conversations, styles.background)}
            activeKey="item2"
            groupable
            items={[
              {
                group: '最近对话',
                key: 'item1',
                label: 'What is Ant Design X?',
              },
              {
                group: '最近对话',
                key: 'item2',
                label: 'What is Ant Design X?',
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <Introduction title={locale.title} desc={locale.desc} items={items} column={isMobile ? 1 : 3} />
  );
};

export default CompIntroduction;
