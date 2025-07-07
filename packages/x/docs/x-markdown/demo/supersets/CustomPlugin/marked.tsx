import XMarkdown, { Token } from '@ant-design/x-markdown';
import React from 'react';
import { markedEmoji } from 'marked-emoji';

const content = `
### Use [marked extensions](https://marked.js.org/using_advanced#extensions)

I :heart: Ant Design X! :tada:


`;

import { Octokit } from '@octokit/rest';

const octokit = new Octokit();
// Get all the emojis available to use on GitHub.
const res = await octokit.rest.emojis.get();
/*
 * {
 *   ...
 *   "heart": "https://...",
 *   ...
 *   "tada": "https://...",
 *   ...
 * }
 */
const emojis = res.data;

const options = {
  emojis,
  renderer: (token: Token) =>
    `<img alt="${token.name}" src="${token.emoji}" class="marked-emoji-img" width=16>`,
};

const App = () => {
  return <XMarkdown plugins={markedEmoji(options)}>{content}</XMarkdown>;
};

export default App;
