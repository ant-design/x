# Component Guide

## Bubble

**Purpose**: Display a single chat message — AI reply or user message.

**Key decision**: Use `Bubble.List` when rendering multiple messages. Use `Bubble` only for a standalone single message.

```tsx
import { Bubble } from '@ant-design/x';

// Basic
<Bubble content="Hello!" />

// With avatar, header, footer
<Bubble
  content="Hello!"
  placement="start"
  avatar={<Avatar icon={<UserOutlined />} />}
  header={<span>Assistant</span>}
  footer={(content) => <Actions items={[...]} />}
/>

// Streaming mode — set streaming=false on final chunk
<Bubble
  content={streamContent}
  streaming={!isDone}
  typing={{ effect: 'typing', step: 5, interval: 50 }}
/>
```

**Key props**:

| Prop                | Purpose                                                              |
| ------------------- | -------------------------------------------------------------------- | ----------------------------------------- |
| `placement`         | `'start'` (left, AI) or `'end'` (right, user)                        |
| `content`           | Message content (`string`, `ReactNode`, or custom type)              |
| `streaming`         | `true` while streaming, `false` on last chunk                        |
| `typing`            | Typing animation — `false` to disable, `{ effect: 'typing'           | 'fade-in', step, interval }` to configure |
| `loading`           | Show loading skeleton                                                |
| `header` / `footer` | Slot for metadata or action buttons                                  |
| `avatar`            | Slot for avatar                                                      |
| `variant`           | `'filled'` (default) \| `'outlined'` \| `'shadow'` \| `'borderless'` |
| `shape`             | `'default'` \| `'round'` \| `'corner'`                               |
| `contentRender`     | Custom renderer for `content` — use for Markdown or chart components |
| `editable`          | Enable inline content editing                                        |

**`Bubble.List` — the preferred multi-message component**:

```tsx
import { Bubble } from '@ant-design/x';

const roles = {
  assistant: {
    placement: 'start',
    avatar: <Avatar icon={<RobotOutlined />} />,
  },
  user: {
    placement: 'end',
    avatar: <Avatar icon={<UserOutlined />} />,
  },
};

<Bubble.List
  items={messages.map((msg) => ({
    key: msg.id,
    role: msg.role, // maps to roles object above
    content: msg.content,
    loading: msg.loading,
  }))}
  role={roles}
  autoScroll
/>;
```

`Bubble.List` key props:

| Prop         | Purpose                                                                    |
| ------------ | -------------------------------------------------------------------------- |
| `items`      | Array of bubble items with `key`, `role`, `content`, and any `Bubble` prop |
| `role`       | Map of role name → default props for that role                             |
| `autoScroll` | Auto-scroll to bottom on new messages                                      |

---

## Sender

**Purpose**: Chat input box — text entry, file attachment, voice input, submit.

```tsx
import { Sender } from '@ant-design/x';
import { useState } from 'react';

const [value, setValue] = useState('');
const [loading, setLoading] = useState(false);

<Sender
  value={value}
  loading={loading}
  onChange={(v) => setValue(v)}
  onSubmit={(msg) => {
    setValue('');
    setLoading(true);
    // send msg...
  }}
  onCancel={() => setLoading(false)}
  placeholder="Ask anything..."
/>;
```

**Key props**:

| Prop                    | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `value` / `onChange`    | Controlled input                                             |
| `loading`               | Show cancel button instead of send                           |
| `onSubmit`              | Called when user sends (Enter or button)                     |
| `onCancel`              | Called when user cancels a loading send                      |
| `submitType`            | `'enter'` (default) \| `'shiftEnter'` — what triggers submit |
| `allowSpeech`           | Enable voice input (`boolean` or `SpeechConfig`)             |
| `header`                | Expand panel above input (e.g. attachment preview area)      |
| `prefix`                | Prefix slot (e.g. attachment button)                         |
| `suffix`                | Replace default send button area                             |
| `footer`                | Below-input content                                          |
| `autoSize`              | `{ minRows, maxRows }` for textarea auto-resize              |
| `disabled` / `readOnly` | Prevent input                                                |
| `actions`               | Custom action items in the default suffix area               |

**Combining with Attachments**:

```tsx
const [attachments, setAttachments] = useState([]);

<Sender
  header={
    <Sender.Header>
      <Attachments items={attachments} onChange={({ fileList }) => setAttachments(fileList)} />
    </Sender.Header>
  }
  prefix={<Attachments.UploadBtn onChange={({ fileList }) => setAttachments(fileList)} />}
/>;
```

---

## Conversations

**Purpose**: Sidebar list for switching between multiple chat sessions.

```tsx
import { Conversations } from '@ant-design/x';

<Conversations
  items={[
    { key: '1', label: 'Chat with Assistant', icon: <MessageOutlined /> },
    { key: '2', label: 'Code Review', group: 'Today' },
  ]}
  activeKey={activeKey}
  onActiveChange={(key) => setActiveKey(key)}
  groupable
  creation={{
    label: 'New Chat',
    onClick: () => createNewConversation(),
  }}
  menu={(conversation) => ({
    items: [
      { key: 'rename', label: 'Rename' },
      { key: 'delete', label: 'Delete', danger: true },
    ],
    onClick: ({ key }) => handleMenu(key, conversation),
  })}
/>;
```

**Key props**:

| Prop | Purpose |
| --- | --- |
| `items` | Array of `ConversationItemType` — `key`, `label`, `icon`, `group`, `disabled` |
| `activeKey` / `onActiveChange` | Controlled selection |
| `groupable` | Group items by `item.group` field |
| `creation` | Config for "New Chat" button |
| `menu` | Per-item dropdown menu (rename, delete, etc.) |

---

## Welcome + Prompts

**Purpose**: Onboarding screen shown before the first message.

```tsx
import { Welcome, Prompts } from '@ant-design/x';

<Welcome
  title="Hello, I'm your AI Assistant"
  description="Ask me anything, or pick a suggestion below."
  icon={<img src={logo} />}
  variant="borderless"
/>

<Prompts
  title="What would you like to explore?"
  items={[
    { key: '1', icon: <SearchOutlined />, label: 'Search the web' },
    { key: '2', icon: <CodeOutlined />, label: 'Write code' },
    { key: '3', icon: <FileOutlined />, label: 'Summarize a document' },
  ]}
  wrap
  onItemClick={(info) => handlePromptClick(info.data.label)}
/>
```

**Welcome props**:

| Prop                    | Purpose                                |
| ----------------------- | -------------------------------------- |
| `title` / `description` | Main content                           |
| `icon`                  | App icon / avatar                      |
| `extra`                 | Extra actions (top-right)              |
| `variant`               | `'filled'` (default) \| `'borderless'` |

**Prompts props**:

| Prop | Purpose |
| --- | --- |
| `items` | Array of `PromptProps` — `key`, `label`, `description`, `icon`, `disabled`, `children` |
| `title` | Section heading |
| `wrap` | Wrap on overflow |
| `vertical` | Stack vertically |
| `onItemClick` | Called with `{ data: PromptProps }` |
| `fadeIn` / `fadeInLeft` | Entrance animation |

---

## ThoughtChain / Think

### ThoughtChain

**Purpose**: Visualize a multi-step agent reasoning chain — tool calls, searches, sub-tasks.

```tsx
import { ThoughtChain } from '@ant-design/x';

<ThoughtChain
  items={[
    {
      key: '1',
      title: 'Search the web',
      description: 'query: "React hooks"',
      status: 'success',
      content: <pre>{searchResults}</pre>,
      collapsible: true,
    },
    {
      key: '2',
      title: 'Generating answer',
      status: 'loading',
      blink: true,
    },
  ]}
  expandedKeys={expandedKeys}
  onExpand={setExpandedKeys}
/>;
```

**ThoughtChainItemType**:

| Prop          | Purpose                                              |
| ------------- | ---------------------------------------------------- |
| `key`         | Unique identifier                                    |
| `title`       | Step name                                            |
| `description` | Short description                                    |
| `content`     | Expandable body                                      |
| `status`      | `'loading'` \| `'success'` \| `'error'` \| `'abort'` |
| `icon`        | Custom icon (`false` to hide)                        |
| `collapsible` | Allow collapse/expand                                |
| `blink`       | Animated blink (for in-progress steps)               |

### Think

**Purpose**: Collapsible "deep thinking" block — for models that expose a reasoning step.

```tsx
import { Think } from '@ant-design/x';

<Think title="Thinking..." loading={isStreaming} blink={isStreaming} defaultExpanded={false}>
  {reasoningContent}
</Think>;
```

**ThinkProps**:

| Prop                                        | Purpose                                           |
| ------------------------------------------- | ------------------------------------------------- |
| `title`                                     | Header text                                       |
| `loading`                                   | Show loading indicator (`boolean` or custom node) |
| `expanded` / `defaultExpanded` / `onExpand` | Controlled/uncontrolled expand                    |
| `blink`                                     | Animated blink while streaming                    |
| `children`                                  | Body content                                      |
| `icon`                                      | Custom icon                                       |

---

## Actions

**Purpose**: Feedback/control buttons below an AI message — copy, thumbs up/down, retry, audio.

```tsx
import { Actions } from '@ant-design/x';

<Actions
  items={[
    {
      key: 'copy',
      actionRender: () => <Actions.Copy text={messageContent} />,
    },
    {
      key: 'feedback',
      actionRender: () => <Actions.Feedback value={feedbackValue} onChange={setFeedbackValue} />,
    },
    {
      key: 'retry',
      icon: <RedoOutlined />,
      label: 'Retry',
      onItemClick: () => handleRetry(),
    },
    {
      key: 'more',
      icon: <MoreOutlined />,
      subItems: [
        { key: 'edit', label: 'Edit' },
        { key: 'delete', label: 'Delete', danger: true },
      ],
    },
  ]}
  variant="borderless"
/>;
```

**Built-in sub-components**:

| Component          | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| `Actions.Copy`     | Copy-to-clipboard button — prop `text`          |
| `Actions.Feedback` | Like/dislike toggle — props `value`, `onChange` |
| `Actions.Audio`    | Play/loading/error audio button — prop `status` |
| `Actions.Item`     | Generic item with `status`, `label`             |

**ActionsProps**:

| Prop                    | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| `items`                 | Array of action items                                  |
| `onClick`               | Global click handler                                   |
| `variant`               | `'borderless'` (default) \| `'outlined'` \| `'filled'` |
| `fadeIn` / `fadeInLeft` | Entrance animation                                     |

---

## Attachments

**Purpose**: File attachment list with drag-drop, paste, and overflow support — used in `Sender.Header`.

```tsx
import { Attachments } from '@ant-design/x';
import { useState, useRef } from 'react';

const [fileList, setFileList] = useState([]);
const attachRef = useRef(null);

<Attachments
  ref={attachRef}
  items={fileList}
  onChange={({ fileList: newList }) => setFileList(newList)}
  overflow="scrollX"
  placeholder={{
    icon: <PaperClipOutlined />,
    title: 'Drop files here',
    description: 'Or click to browse',
  }}
/>;

// Programmatically open file picker:
attachRef.current?.select({ accept: 'image/*', multiple: true });
```

**AttachmentsProps**: Extends antd `Upload` props, key additions:

| Prop               | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| `items`            | Controlled file list (same as Upload `fileList`) |
| `overflow`         | `'wrap'` \| `'scrollX'` \| `'scrollY'`           |
| `placeholder`      | Shown when list is empty                         |
| `getDropContainer` | Configure drop zone element                      |
| `maxCount`         | Max files                                        |

---

## Sources

**Purpose**: Show reference citations (URLs) used in an AI answer.

```tsx
import { Sources } from '@ant-design/x';

<Sources
  title="References"
  items={[
    { key: '1', title: 'React Docs', url: 'https://react.dev', description: 'Official docs' },
    { key: '2', title: 'MDN', url: 'https://developer.mozilla.org' },
  ]}
  defaultExpanded
  onClick={(item) => window.open(item.url)}
/>;
```

**SourcesProps**:

| Prop | Purpose |
| --- | --- |
| `items` | Array of `SourcesItem` — `key`, `title`, `url`, `icon`, `description` |
| `title` | Section heading |
| `expanded` / `defaultExpanded` / `onExpand` | Controlled expand |
| `inline` | Compact inline mode with popover |
| `onClick` | Callback when source is clicked |
| `expandIconPosition` | `'start'` (default) \| `'end'` |

---

## Suggestion

**Purpose**: Slash-command or trigger-based suggestion popup in the Sender.

```tsx
import { Suggestion, Sender } from '@ant-design/x';

<Suggestion
  items={[
    { value: '/search', label: '/search', icon: <SearchOutlined /> },
    { value: '/help', label: '/help', icon: <QuestionOutlined /> },
  ]}
  onSelect={(value) => console.log('Selected:', value)}
>
  {({ onTrigger, onKeyDown }) => (
    <Sender
      onChange={(v) => {
        if (v === '/') onTrigger({});
        else onTrigger(false);
      }}
      onKeyDown={onKeyDown}
    />
  )}
</Suggestion>;
```

**SuggestionProps**:

| Prop | Purpose |
| --- | --- |
| `items` | Array of `SuggestionItem` or render function `(info) => SuggestionItem[]` |
| `children` | Render prop — `({ onTrigger, onKeyDown }) => ReactElement` |
| `onSelect` | Called with selected `value` and options path |
| `open` / `onOpenChange` | Controlled panel visibility |
| `block` | Full-width mode |

---

## FileCard

**Purpose**: Display a file attachment card in a bubble (sent/received file).

```tsx
import { FileCard } from '@ant-design/x';

<FileCard
  item={{
    uid: '1',
    name: 'report.pdf',
    size: 1024000,
    status: 'done',
    url: '/files/report.pdf',
  }}
/>

// List of file cards
<FileCard.List items={fileItems} />
```

---

## CodeHighlighter

**Purpose**: Syntax-highlighted code block in a bubble or message.

```tsx
import { CodeHighlighter } from '@ant-design/x';

<CodeHighlighter language="typescript" content={`const x = 1;`} />;
```

> Tip: When rendering code from Markdown, prefer `@ant-design/x-markdown` with a custom code block component mapping.

---

## Mermaid

**Purpose**: Render Mermaid diagrams inside chat messages.

```tsx
import { Mermaid } from '@ant-design/x';

<Mermaid
  content={`graph TD
  A --> B
  B --> C`}
/>;
```

> Tip: Use inside `Bubble` `contentRender` or as a Markdown code block component for `language="mermaid"`.

---

## Folder

**Purpose**: Display a hierarchical file/folder tree with optional file preview — useful in AI coding assistant scenarios.

```tsx
import { Folder } from '@ant-design/x';

<Folder
  treeData={[
    {
      title: 'src',
      path: 'src',
      children: [
        { title: 'index.tsx', path: 'src/index.tsx', content: 'export default () => null;' },
        { title: 'App.tsx', path: 'src/App.tsx', content: 'const App = () => <div />;' },
      ],
    },
  ]}
  defaultExpandAll
  onSelectedFileChange={(file) => console.log(file.path, file.content)}
/>;
```

**Dynamic content loading via service**:

```tsx
<Folder
  treeData={treeData}
  fileContentService={{
    loadFileContent: async (filePath) => {
      const res = await fetch(`/api/file?path=${filePath}`);
      return res.text();
    },
  }}
/>
```

**Key props**:

| Prop | Purpose |
| --- | --- |
| `treeData` | Tree structure — `FolderTreeData[]` with `title`, `path`, `content`, `children` |
| `selectedFile` / `defaultSelectedFile` | Controlled/uncontrolled selected file paths |
| `onSelectedFileChange` | Called with `{ path, name, content }` on file select |
| `expandedPaths` / `defaultExpandedPaths` | Controlled/uncontrolled expanded paths |
| `defaultExpandAll` | Expand all nodes by default (`true`) |
| `fileContentService` | Async service for loading file content on demand |
| `previewRender` | Custom file preview renderer |
| `directoryTitle` | Title above the tree (`false` to hide) |
| `directoryIcons` | Custom icons per file type (`false` to hide all icons) |
| `selectable` | Enable file selection (`true` by default) |
| `emptyRender` | Empty state content |

---

## XProvider

**Purpose**: Global configuration wrapper — replaces `antd`'s `ConfigProvider`.

```tsx
import { XProvider } from '@ant-design/x';
import zhCN from 'antd/locale/zh_CN';
import zhCN_X from '@ant-design/x/locale/zh_CN';

<XProvider
  locale={{ ...zhCN, ...zhCN_X }}
  theme={{
    token: { colorPrimary: '#1677ff' },
  }}
  direction="ltr"
>
  <App />
</XProvider>;
```

- Fully extends `antd`'s `ConfigProvider` — all antd config props are valid.
- Adds x-specific locale strings via `@ant-design/x/locale/zh_CN` (or `en_US`).
- Place **once at the app root** — do not nest multiple `XProvider` instances unnecessarily.

---

## Notification

**Purpose**: Imperative notification messages (non-bubble, global alerts).

```tsx
import { notification } from '@ant-design/x';

notification.open({
  title: 'Connection lost',
  description: 'Reconnecting...',
  type: 'error',
});
```

Use when you need to surface errors or events outside the chat bubble flow.
