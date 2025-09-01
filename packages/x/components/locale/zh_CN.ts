import type { xLocale, xMarkdownLocale } from './index';

const localeValues: Required<xLocale & xMarkdownLocale> = {
  locale: 'zh-cn',
  Conversations: {
    create: '新对话',
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
    copyText: '复制代码',
    zoomInText: '缩小',
    zoomOutText: '放大',
    zoomResetText: '重置',
    downloadText: '下载',
  },
};

export default localeValues;
