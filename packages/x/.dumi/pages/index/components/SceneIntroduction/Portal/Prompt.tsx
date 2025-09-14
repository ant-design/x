import type { PromptProps, PromptsProps } from '@ant-design/x';
import { Prompts } from '@ant-design/x';
import { createStyles } from 'antd-style';
import React from 'react';
import useLocale from '../../../../../hooks/useLocale';

const locales = {
  cn: {
    slogan: 'AI 体验新秩序',
    subTitle: '我能帮上什么忙？',
    desc: 'Ant Design 团队匠心呈现 RICH 设计范式，打造卓越 AI 界面解决方案，引领智能新体验。',
    start: '开始使用',
    design: '设计语言',
    prompt_label_1: 'Ant Design X 2.0 升级了什么？',
    prompt_description_1: '哪些组件有升级、新增了那些能力、组件怎么使用。',
    prompt_label_2: 'X Markdown 有哪些特性？',
    prompt_description_2: 'X Markdown 支持环境、是否可定制组件渲染、插件丰富吗？',
    prompt_label_3: 'X SDK 做了全面升级具体体现在哪里？',
    prompt_description_3: 'X SDK 支持那些场景？是否支持自定义数据转化',
    prompt_label_4: '有没有大模型和智能体完整的样板间可以试用？',
    prompt_description_4:
      '开发一个完整的智能体应用，搭建智能体有没有推荐的应用，有没有开箱即用的脚手架。',
    prompt_label_5: 'Ant Design X 推出全新 RICH 设计规范！',
    prompt_description_5: '什么是RICH 设计，有没有设计资产？',
  },
  en: {
    slogan: 'New AI Experience',
    subTitle: 'What can I help with?',
    desc: 'The Ant Design team presents the RICH paradigm, crafting superior AI interface solutions and pioneering intelligent experiences.',
    start: 'Get Started',
    design: 'Get Design',
    prompt_label_1: 'What has been upgraded in Ant Design X 2.0?',
    prompt_description_1:
      'Which components have been upgraded, what new capabilities are added, and how to use the components.',
    prompt_label_2: 'What are the features of X Markdown?',
    prompt_description_2:
      'Does X Markdown support environments, customizable component rendering, and is it rich in plugins?',
    prompt_label_3: 'What are the comprehensive upgrades in X SDK?',
    prompt_description_3:
      'What scenarios does X SDK support? Does it support custom data transformation?',
    prompt_label_4: 'Are there any complete templates for LLMs and agents to try?',
    prompt_description_4:
      'Need to develop a complete agent application. Are there recommended applications for building agents, and is there a ready-to-use scaffold for building a complete application?',
    prompt_label_5: 'Ant Design X introduces the new RICH design specification!',
    prompt_description_5: 'What is RICH design, and are there design assets available?',
  },
};

const useStyle = createStyles(({ token, css }) => {
  return {
    container: css`
      text-align: center;
      padding-block-end: ${token.paddingXL * 1.5}px;
        `,
    prompts: css`
        width: 100%;
        `,
    promptsList: css`
        width: 100%;
        justify-content: space-between;
        `,
    promptsItem: css`
      .ant-prompts-desc{
      max-height: ${token.lineHeight * token.fontSize * 5}px;
      overflow: hidden;
       display: -webkit-box;
      -webkit-line-clamp: 5; 
      -webkit-box-orient: vertical;
    overflow: hidden;
      }
       position: relative;
       width: 18%;
       border: none!important;
       max-height: 200px!important;
       transition: all ${token.motionDurationMid} ${token.motionEaseInOut}!important;
       background: linear-gradient(135deg, #ffffff26 29%, #ffffff0d 80%) !important;
       &:hover{
         transform: scale(0.96);
       }
       &::after{
        content: '';
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: inherit;
        pointer-events: none;
        position: absolute;
        top: 0;
        bottom: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        padding: 1px;
        background: linear-gradient(180deg, #ffffff26 0%, #ffffff00 100%);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        }
        `,
  };
});

const Prompt: React.FC<{ onClick: (info: { data: PromptProps }) => void }> = ({ onClick }) => {
  const [locale] = useLocale(locales);
  const items: PromptsProps['items'] = new Array(5).fill(1).map((_, index) => ({
    key: `${index}`,
    label: locale[`prompt_label_${index + 1}` as keyof typeof locale],
    description: locale[`prompt_description_${index + 1}` as keyof typeof locale],
  }));
  const { styles } = useStyle();
  return (
    <div className={styles.container}>
      <Prompts
        onItemClick={onClick}
        items={items}
        className={styles.prompts}
        classNames={{
          item: styles.promptsItem,
          list: styles.promptsList,
        }}
      />
    </div>
  );
};

export default Prompt;
