import type { xLocale, xMarkdownLocale } from '.';

const localeValues: Required<xLocale & xMarkdownLocale> = {
  locale: 'en',
  Conversations: {
    create: 'New chat',
  },
  Sender: {
    stopLoading: 'Stop loading',
    speechRecording: 'Speech recording',
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
  HighlightCode: {
    copySuccess: 'Copied',
    copy: 'Copy code',
  },
  CodeHighlighter: {
    copySuccess: 'Copied',
    copy: 'Copy code',
  },
};

export default localeValues;
