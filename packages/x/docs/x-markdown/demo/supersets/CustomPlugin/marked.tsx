import XMarkdown from '@ant-design/x-markdown';
import { markedEmoji } from 'marked-emoji';
import React from 'react';

const content = `
### Use [marked extensions](https://marked.js.org/using_advanced#extensions)

I :heart: XMarkdown! :tada:`;

const options = {
  emojis: {
    heart: '❤️',
    tada: '🎉',
  },
  renderer: (token: any) => token.emoji,
};

const App = () => {
  return <XMarkdown config={markedEmoji(options)}>{content}</XMarkdown>;
};

export default App;
