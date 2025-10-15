import type { xLocale, xMarkdownLocale } from './index';

const localeValues: Required<xLocale & xMarkdownLocale> = {
  locale: 'zh-cn',
  Conversations: {
    create: '新对话',
  },
  Sender: {
    stopLoading: '停止请求',
    speechRecording: '正在录音',
  },
  Actions: {
    feedbackLike: '喜欢',
    feedbackDislike: '不喜欢',
    audio: '播放语音',
    audioRunning: '语音播放中',
    audioError: '播放出错了',
    audioLoading: '正在加载语音',
  },
  Bubble: {
    editableOk: '确认',
    editableCancel: '取消',
  },
  Mermaid: {
    copySuccess: '复制成功',
    copy: '复制代码',
    zoomIn: '缩小',
    zoomOut: '放大',
    zoomReset: '重置',
    download: '下载',
    code: '代码',
    image: '图片',
  },
  HighlightCode: {
    copySuccess: '复制成功',
    copy: '复制代码',
  },
};

export default localeValues;
