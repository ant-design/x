import { Bubble } from '@ant-design/x';
import { createStyles } from 'antd-style';
import React from 'react';

import useLocale from '../../../../hooks/useLocale';
import { DESIGN_STAGE_COLOR } from '../../common/CustomizationProvider';
import Introduction, { type IntroductionItem } from '../../common/Introduction';
import SiteContext from '../SiteContext';
import {
  CustomConversations,
  CustomizationBubble,
  CustomizationPrompts,
  CustomizationSuggestion,
  CustomizationWelcome,
} from './Customization';

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
    title: 'Components Rich, Easy to Use',
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

const useStyle = createStyles(({ css }) => {
  return {
    header: css`
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
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
          <CustomizationWelcome />
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
          <CustomizationPrompts />
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
          <CustomizationSuggestion />
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
          <CustomizationBubble />
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
          <CustomConversations />
        </div>
      ),
    },
  ];

  return (
    <Introduction title={locale.title} desc={locale.desc} items={items} column={isMobile ? 1 : 3} />
  );
};

export default CompIntroduction;
