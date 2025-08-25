import type { xLocale } from './index';

const localeValues: Required<xLocale> = {
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
};

export default localeValues;
