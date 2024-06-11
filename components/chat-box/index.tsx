import React from 'react';

export interface ChatBoxProps {}

const ChatBox = React.forwardRef<HTMLElement, ChatBoxProps>(() => (
  <div>2333</div>
));

if (process.env.NODE_ENV !== 'production') {
  ChatBox.displayName = 'ChatBox';
}

export default ChatBox;
