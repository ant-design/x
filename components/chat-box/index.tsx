import React from 'react';

export interface ChatBoxProps {
  rootClassName?: string;
}

const ChatBox = React.forwardRef<HTMLElement, ChatBoxProps>(
  ({ rootClassName }: ChatBoxProps) => (
    <div className={rootClassName}>2333</div>
  ),
);

if (process.env.NODE_ENV !== 'production') {
  ChatBox.displayName = 'ChatBox';
}

export default ChatBox;
