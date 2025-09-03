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
    copy: 'Copy code',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    zoomReset: 'Reset',
    download: 'Download',
    code: 'Code',
    image: 'Image',
  },
};

export default localeValues;
