---
group:
  title: Migration
  order: 5
order: 0
tag: New
title: From v1 to v2
---

This document will help you upgrade from `@ant-design/x 1.x` to `@ant-design/x 2.x`.

## Upgrade Preparation

1. Please upgrade antd in your project to the latest version of 6.x first, and remove/modify related APIs according to the console warning messages.

## Incompatible Changes in 2.0

### Runtime-related tools migrated to `@ant-design/x-sdk` with comprehensive refactoring

1. Removed `useXAgent` hook for model scheduling, and upgraded `useXChat` as the conversation data management hook tool for producing data needed for page rendering. The entire implementation logic has been refactored and needs to be modified according to the new documentation.
2. Added `useXConversations` conversation list management hook, providing operations including conversation creation, deletion, update, and multi-conversation persistence capabilities.
3. Added `Chat Provider` interface implementation to provide unified request management and data format conversion for useXChat.

### Bubble

1. `messageRender` replaced with `contentRender`, and supports receiving extended parameters.

#### Migration Example

**Before (v1):**

```tsx
<Bubble
  content="Hello World"
  components={{
    header: 'Header',
    footer: 'Footer',
    avatar: <Avatar icon={<UserOutlined />} />,
    extra: <Button icon={<MoreOutlined />} />,
  }}
/>
```

**After (v2):**

```tsx
<Bubble
  content="Hello World"
  header="Header"
  footer="Footer"
  avatar={<Avatar icon={<UserOutlined />} />}
  extra={<Button icon={<MoreOutlined />} />}
/>
```

### Bubble.List

1. Scroll hosting implementation requires explicit Bubble.List height.

### Sender

1. Removed border style when focused.
2. Removed `actions` property, added `suffix` property. Suffix content displays action buttons by default. When default action buttons are not needed, you can set suffix={false}.
3. onPasteFile default callback method parameter is file list `(files: FileList) => void`.

### Attachments.FileCard

1. Removed Attachments.FileCard implementation, upgraded to FileCard component.
2. Original `size` renamed to `byte` for displaying file size (bytes).
3. `size` as card size configuration, optional values `'small' | 'default'`.

### ThoughtChain

1. Overall visual upgrade, closer to the long task execution process.
2. `items` list removed extra property.

## Encountering Issues

If you encounter problems during the upgrade process, please provide feedback at [GitHub issues](https://github.com/ant-design/x/issues). We will respond as soon as possible and make corresponding improvements to this document.
