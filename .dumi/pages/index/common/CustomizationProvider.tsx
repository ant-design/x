import { XProvider } from '@ant-design/x';
import { createStyles } from 'antd-style';
import classnames from 'classnames';
import React from 'react';

export const useCustomizationBgStyle = createStyles(({ token, css }) => {
  return {
    background: css`
      background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%) !important;
      overflow: hidden;

      &::after {
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
        padding: ${token.lineWidth}px;
        background: linear-gradient(180deg, #ffffff26 0%, #ffffff00 100%);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
      };
    `,
  };
});

export const LOCALES = {
  cn: {
    greeting: '你好, 我是全新 AI 产品创造助手',
    greeting_short: '你好, 我是 Ant Design X',
    description: '基于 Ant Design 的 AGI 产品智能解决方案, 创造更美好的智能视界',
    description_short: '基于 Ant Design 的 AGI 产品智能解决方案, 创造更美好的智能视界',
    help_text: '我可以帮您: ',

    conversations_group: '最近对话',
    send_placeholder: '输入 / 获取建议',

    hot_question: '热门话题',

    question1: 'Ant Design X 全新升级了什么? ',
    question2: 'Ant Design X 推出全新 RICH 设计规范 ',
    question3: 'Ant Design X 组件资产有哪些? ',
    question4: '快来了解全新AI时代的设计范式! ',

    design_guide: 'Rich 设计指南',

    empathy: 'AI 理解用户诉求并解决',
    persona: 'AI 对外的人设及形象',
    conversation: 'AI 如何表达用户能听懂',
    interface: 'AI 兼顾“chat” & “do” 行为',
  },
  en: {
    greeting: 'Hello, I am your AI Product Design Assistant',
    greeting_short: 'Hello, I am Ant Design X',
    description:
      "Powered by Ant Design's AGI solution to enhance intelligent, aesthetic visual experiences",
    description_short: 'Aesthetic visual experiences',
    help_text: 'I can assist you with:',

    conversations_group: 'History',
    send_placeholder: 'Type / to get suggestions',

    hot_question: 'Hot Topics',

    question1: 'What are the new upgrades in X?',
    question2: 'X has introduced the new RICH design guide.',
    question3: 'What are the component assets in X?',
    question4: 'Discover new design for the AI!',

    design_guide: 'Rich Design Guidelines',

    empathy: 'AI that understands and addresses user needs',
    persona: "Defining AI's persona and presentation",
    conversation: 'Ensuring AI communicates clearly',
    interface: "Balancing 'chat' & 'do' functionalities",
  },
};

export const DESIGN_STAGE_COLOR = {
  AWAKE: {
    START: '#6fb3e2',
    END: '#6c57ff',
  },
  EXPRESS: {
    START: '#6dd6f5',
    END: '#108c44',
  },
  CONFIRM: {
    START: '#48d0b6',
    END: '#acf75b',
  },
  FEEDBACK: {
    START: '#f7c348',
    END: '#f75972',
  },
  COMMON: {
    START: '#d857ff',
    END: '#8594ff',
  },
};

const useStyle = createStyles(({ token, css }) => {
  const borderRadius = 20;

  return {
    welcome: css`
      display: flex;
      align-items: center;
      gap: ${token.paddingXS}px;
      position: relative;
      box-sizing: border-box;
      border-radius: ${borderRadius}px;

      .ant-welcome-title {
        font-size: ${token.fontSize}px;
        font-weight: 400;
      }

      .ant-welcome-description {
        font-size: ${token.fontSizeSM - 1}px;
        opacity: 0.65;        
      }
    `,
    prompts: css`
      border-radius: ${borderRadius}px !important;
      position: relative;

      .ant-prompts-desc {
        font-size: ${token.fontSizeSM}px !important;
        opacity: 0.9;
      }
      .ant-prompts-label {
        font-size: ${token.fontSize}px !important;
        font-weight: 400;
      }

      .ant-prompts-title {
        font-size: ${token.fontSize}px !important;
        padding-bottom: ${token.paddingXS}px;
      }
    `,
    sender: css`
      border-radius: ${borderRadius * 2}px;
    `,
    conversations: css`
      padding: ${token.padding}px;
      padding-top: 0;
      border-radius: ${borderRadius}px;
      position: relative;
    `,
    suggestion: css`
      border-radius: ${borderRadius}px;
      position: relative;
    `,
  };
});

const CustomizationProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const { styles } = useStyle();
  const {
    styles: { background },
  } = useCustomizationBgStyle();

  return (
    <XProvider
      conversations={{
        className: classnames(styles.conversations, background),
      }}
      sender={{
        className: classnames(styles.sender, background),
      }}
      prompts={{
        className: classnames(styles.prompts),
      }}
      welcome={{
        className: classnames(styles.welcome),
      }}
      suggestion={{
        className: classnames(styles.suggestion),
      }}
    >
      {props.children}
    </XProvider>
  );
};

export default CustomizationProvider;
