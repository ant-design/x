import React from 'react';
import classNames from 'classnames';

export interface ChatBoxProps {}

const ChatBox = React.forwardRef<HTMLElement, ChatBoxProps>((props, ref) => (
  <div>2333</div>
));

if (process.env.NODE_ENV !== 'production') {
  ChatBox.displayName = 'ChatBox';
}

export default ChatBox;
