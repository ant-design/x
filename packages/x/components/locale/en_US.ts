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
  Folder: {
    selectFile: 'Please select a file',
    loadError: 'Failed to load file',
    noService: 'File content service not configured',
    loadFailed: 'Failed to load file',
  },
  ToolCall: {
    status: {
      pending: 'Pending',
      streaming: 'Receiving arguments',
      running: 'Running',
      completed: 'Completed',
      failed: 'Failed',
      cancelled: 'Cancelled',
    },
    retry: 'Retry',
    cancel: 'Cancel execution',
    copyResult: 'Copy result',
    expand: 'Expand details',
    collapse: 'Collapse details',
    arguments: 'Arguments',
    result: 'Result',
    error: 'Error',
    duration: 'Elapsed time',
    approval: 'Tool approval',
    approvalTitle: 'Approval required',
    awaitingApproval: 'Awaiting approval',
    approvalApproved: 'Approved',
    approvalRejected: 'Rejected',
    approveAndRun: 'Approve and run',
    reject: 'Reject',
    risk: 'Risk',
    riskLevel: {
      low: 'Low risk',
      medium: 'Medium risk',
      high: 'High risk',
    },
  },
};

export default localeValues;
