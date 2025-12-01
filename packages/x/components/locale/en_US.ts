import type { xLocale } from '.';

const localeValues: Required<xLocale> = {
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
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    zoomReset: 'Reset',
    download: 'Download',
    code: 'Code',
    image: 'Image',
  },
};

export default localeValues;
