# Composition Patterns

## Pattern 1: Full Chat Page

The standard layout for an AI chat application.

```tsx
import React, { useState } from 'react';
import {
  XProvider,
  Bubble,
  Sender,
  Conversations,
  Welcome,
  Prompts,
  Actions,
  ThoughtChain,
  Think,
} from '@ant-design/x';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Flex } from 'antd';

// Role config — keep STABLE (define outside component or useMemo)
const roles = {
  assistant: {
    placement: 'start' as const,
    avatar: <Avatar icon={<RobotOutlined />} />,
  },
  user: {
    placement: 'end' as const,
    avatar: <Avatar icon={<UserOutlined />} />,
  },
};

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeKey, setActiveKey] = useState('1');
  const [value, setSenderValue] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmpty = messages.length === 0;

  return (
    <XProvider>
      <Flex style={{ height: '100vh' }}>
        {/* Sidebar */}
        <Conversations
          style={{ width: 240, borderRight: '1px solid #f0f0f0' }}
          items={conversations}
          activeKey={activeKey}
          onActiveChange={setActiveKey}
          groupable
          creation={{ label: 'New Chat', onClick: () => {} }}
        />

        {/* Main area */}
        <Flex vertical flex={1} style={{ overflow: 'hidden' }}>
          {/* Welcome screen or bubble list */}
          {isEmpty ? (
            <Flex vertical flex={1} align="center" justify="center" gap={16}>
              <Welcome
                title="Hello! How can I help?"
                description="Choose a suggestion or type your own question."
                variant="borderless"
              />
              <Prompts
                items={[
                  { key: '1', label: 'Explain quantum computing' },
                  { key: '2', label: 'Write a Python script' },
                ]}
                wrap
                onItemClick={(info) => {
                  setSenderValue(info.data.label as string);
                }}
              />
            </Flex>
          ) : (
            <Bubble.List
              style={{ flex: 1, overflow: 'auto', padding: 16 }}
              items={messages}
              roles={roles}
              autoScroll
            />
          )}

          {/* Input */}
          <Sender
            style={{ padding: 16 }}
            value={value}
            loading={loading}
            onChange={setSenderValue}
            onSubmit={(msg) => {
              setSenderValue('');
              setLoading(true);
              // dispatch to data layer (use-x-chat or custom)
            }}
            onCancel={() => setLoading(false)}
          />
        </Flex>
      </Flex>
    </XProvider>
  );
}
```

---

## Pattern 2: Bubble with Message Actions

Add copy, feedback, and retry below each assistant message.

```tsx
// Define items OUTSIDE render to keep them stable
const makeActionItems = (content: string, onRetry: () => void) => [
  {
    key: 'copy',
    actionRender: () => <Actions.Copy text={content} />,
  },
  {
    key: 'feedback',
    actionRender: () => {
      const [val, setVal] = React.useState<'like' | 'dislike' | 'default'>('default');
      return <Actions.Feedback value={val} onChange={setVal} />;
    },
  },
  {
    key: 'retry',
    label: 'Retry',
    icon: <RedoOutlined />,
    onItemClick: onRetry,
  },
];

// In roles config:
const roles = {
  assistant: {
    placement: 'start',
    footer: (content) => (
      <Actions
        items={makeActionItems(content as string, handleRetry)}
        variant="borderless"
        fadeIn
      />
    ),
  },
};
```

---

## Pattern 3: Streaming Bubble

Connect `Bubble.List` to a streaming data source.

```tsx
// With useXChat (from x-sdk):
import { useXChat } from '@ant-design/x-sdk';

const { parsedMessages, onRequest, isRequesting, abort } = useXChat({ provider });

// Map to Bubble.List items
const bubbleItems = parsedMessages.map((msg) => ({
  key: msg.id,
  role: msg.status === 'loading' ? 'assistant' : msg.role,
  content: msg.message.content,
  // streaming is true only while message is being generated
  streaming: msg.status === 'loading',
  loading: msg.status === 'loading' && !msg.message.content,
}));

<Bubble.List items={bubbleItems} roles={roles} autoScroll />
<Sender
  loading={isRequesting}
  onSubmit={(msg) => onRequest({ message: { role: 'user', content: msg } })}
  onCancel={abort}
/>
```

---

## Pattern 4: Reasoning / Thinking Display

Show a model's chain-of-thought before the final answer.

```tsx
// Single collapsible think block
const roles = {
  assistant: {
    placement: 'start',
    contentRender: (content, info) => {
      const { reasoning, answer } = content as { reasoning: string; answer: string };
      return (
        <>
          {reasoning && (
            <Think
              title="Thinking..."
              loading={info.status === 'loading'}
              blink={info.status === 'loading'}
              defaultExpanded={false}
            >
              {reasoning}
            </Think>
          )}
          <div>{answer}</div>
        </>
      );
    },
  },
};

// Multi-step tool call chain
<ThoughtChain
  items={agentSteps.map((step) => ({
    key: step.id,
    title: step.toolName,
    description: step.input,
    status: step.status, // 'loading' | 'success' | 'error'
    content: step.result,
    collapsible: true,
    blink: step.status === 'loading',
  }))}
/>;
```

---

## Pattern 5: File Attachments in Sender

Allow users to attach files to their messages.

```tsx
import { Sender, Attachments } from '@ant-design/x';
import { PaperClipOutlined } from '@ant-design/icons';
import { useState } from 'react';

const [fileList, setFileList] = useState([]);
const attachRef = useRef(null);

<Sender
  prefix={<PaperClipOutlined onClick={() => attachRef.current?.select({ multiple: true })} />}
  header={
    fileList.length > 0 && (
      <Sender.Header>
        <Attachments
          ref={attachRef}
          items={fileList}
          onChange={({ fileList: fl }) => setFileList(fl)}
          overflow="scrollX"
        />
      </Sender.Header>
    )
  }
  onSubmit={(msg) => {
    const payload = { message: msg, files: fileList };
    setFileList([]);
    handleSend(payload);
  }}
/>;
```

---

## Pattern 6: Suggestion / Slash Commands

Trigger a suggestion popup when user types `/`.

```tsx
import { Suggestion, Sender } from '@ant-design/x';

const commands = [
  { value: '/search', label: '/search — Search the web', icon: <SearchOutlined /> },
  { value: '/summarize', label: '/summarize — Summarize text', icon: <FileOutlined /> },
  { value: '/code', label: '/code — Generate code', icon: <CodeOutlined /> },
];

<Suggestion items={commands} onSelect={(val) => setValue(val + ' ')}>
  {({ onTrigger, onKeyDown }) => (
    <Sender
      value={value}
      onChange={(v) => {
        setValue(v);
        // Trigger suggestion on '/'
        if (v.endsWith('/')) {
          onTrigger({});
        } else {
          onTrigger(false);
        }
      }}
      onKeyDown={onKeyDown}
      onSubmit={handleSubmit}
    />
  )}
</Suggestion>;
```

---

## Pattern 7: Source Citations

Show which documents were referenced in an AI answer.

```tsx
const roles = {
  assistant: {
    placement: 'start',
    footer: (content, info) => {
      if (!info.sources?.length) return null;
      return (
        <Sources
          title="Sources"
          items={info.sources.map((s, i) => ({
            key: String(i),
            title: s.title,
            url: s.url,
            description: s.snippet,
          }))}
          defaultExpanded={false}
          onClick={(item) => window.open(item.url, '_blank')}
        />
      );
    },
  },
};
```

---

## Anti-patterns to Avoid

| Anti-pattern | Why it's wrong | Fix |
| --- | --- | --- |
| Mapping `Bubble` in a loop | Loses scroll anchoring, auto-scroll | Use `Bubble.List` |
| Inline `roles` object in JSX | Re-creates object every render, resets animations | Define outside component or `useMemo` |
| Leaving `streaming={true}` after stream ends | Incomplete content shown forever | Set `streaming={false}` on final chunk |
| Putting raw HTML in `content` | XSS risk, no sanitization | Use `contentRender` with `XMarkdown` |
| Multiple `XProvider` wraps | Theme/locale conflicts | Single root `XProvider` only |
| Using `onChange` as submit handler | Fires on every keystroke | Use `onSubmit` for send action |
