import type { Locale } from './index';

const localeValues: Required<Locale> = {
  locale: 'zh-cn',
  // locales for all components
  Conversations: {
    create: '新对话',
  },
  Actions: {
    feedbackLike: '喜欢',
    feedbackDislike: '不喜欢',
  },
  Bubble: {
    editableOk: '确认',
    editableCancel: '取消',
  },
};

export default localeValues;
