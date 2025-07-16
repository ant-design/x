import type { Locale } from './index';

const localeValues: Required<Locale> = {
  locale: 'zh-cn',
  // locales for all components
  Conversations: {
    create: '新对话',
  },
  Actions: {
    feedbackLike: '点赞',
    feedbackDislike: '点踩',
  },
};

export default localeValues;
