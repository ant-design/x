import type { xLocale } from '.';

const localeValues: Required<xLocale> = {
  locale: 'en',
  Conversations: {
    create: 'New chat',
  },
  Actions: {
    feedbackLike: 'Like',
    feedbackDislike: 'Dislike',
    audio: 'Play audio',
    audioRunning: 'Audio playing',
    audioError: 'Playback error',
    audioLoading: 'Loading audio',
  },
  Bubble: {
    editableOk: 'OK',
    editableCancel: 'Cancel',
  },
};

export default localeValues;
