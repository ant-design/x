---
title: virtual-list
order: 12
---

## zh-CN

虚拟滚动。当会话数量较大时（>100 条），可以通过开启 `virtual` 来启用虚拟滚动以提升性能。

## en-US

Virtual scroll. When the number of conversations is large (>100 items), you can enable `virtual` to turn on virtual scrolling for better performance.

```tsx
import type { ConversationItemType } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import React, { useState } from 'react';

const generateMockData = (count: number): ConversationItemType[] => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return Array.from({ length: count }, (_, i) => {
    const isToday = i < count / 3;
    const isYesterday = i >= count / 3 && i < (count / 3) * 2;

    return {
      key: String(i),
      label: `Conversation ${i + 1}`,
      timestamp: isToday
        ? now - i * 3600000
        : isYesterday
          ? now - day - (i - Math.floor(count / 3)) * 3600000
          : now - 2 * day - (i - Math.floor((count / 3) * 2)) * 3600000,
      group: isToday ? 'Today' : isYesterday ? 'Yesterday' : 'Earlier',
    } as ConversationItemType;
  });
};

const App = () => {
  const [items] = React.useState(() => generateMockData(1000));
  const [activeKey, setActiveKey] = useState('0');
  const [virtual, setVirtual] = useState(true);

  return (
    <div
      style={{
        height: 600,
        width: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => setVirtual((v) => !v)}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid #d9d9d9',
            background: virtual ? '#1677ff' : '#fff',
            color: virtual ? '#fff' : '#1677ff',
            cursor: 'pointer',
          }}
        >
          Virtual: {virtual ? 'ON' : 'OFF'}
        </button>
        <span>Total: {items.length}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Conversations
          items={items}
          activeKey={activeKey}
          onActiveChange={setActiveKey}
          groupable
          virtual={virtual}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};

export default App;
```