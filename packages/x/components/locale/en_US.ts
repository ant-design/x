import type { Locale } from '.';

const localeValues: Required<Locale> = {
  locale: 'en',
  Conversations: {
    create: 'New chat',
  },
  Actions: {
    feedbackLike: 'like',
    feedbackDislike: 'dislike',
  },
  Bubble: {
    editableOk: 'ok',
    editableCancel: 'cancel',
  },
};

export default localeValues;
