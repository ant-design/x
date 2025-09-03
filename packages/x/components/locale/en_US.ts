import type { xLocale, xMarkdownLocale } from '.';

const localeValues: Required<xLocale & xMarkdownLocale> = {
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
  Mermaid: {
    copySuccess: 'Copied',
    copyText: 'Copy code',
    zoomInText: 'Zoom in',
    zoomOutText: 'Zoom out',
    zoomResetText: 'Reset',
    downloadText: 'Download',
  },
};

export default localeValues;
