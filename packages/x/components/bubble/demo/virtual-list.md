---
title: virtual-list
order: 13
---

## zh-CN

虚拟滚动。当数据量较大时（>100 条），可以通过开启 `virtual` 来启用虚拟滚动以提升性能。

## en-US

Virtual scroll. When the data volume is large (>100 items), you can enable `virtual` to turn on virtual scrolling for better performance.

```tsx
import { UserOutlined } from '@ant-design/icons';
import type { BubbleItemType } from '@ant-design/x';
import { Bubble } from '@ant-design/x';
import { Avatar } from 'antd';
import React, { useState } from 'react';

let id = 0;

const getKey = () => `bubble_${id++}`;

const genItem = (isAI: boolean): BubbleItemType => ({
  key: getKey(),
  role: isAI ? 'ai' : 'user',
  content: `${id} : ${isAI ? 'Mock AI content '.repeat(Math.floor(Math.random() * 20) + 1) : 'Mock user content.'}`,
});

const App = () => {
  const [items, setItems] = React.useState<BubbleItemType[]>(() =>
    Array.from({ length: 1000 }, (_, i) => genItem(i % 2 === 0)),
  );

  const [virtual, setVirtual] = useState(true);

  const memoRole = React.useMemo(
    () => ({
      ai: {
        avatar: () => <Avatar icon={<UserOutlined />} />,
      },
      user: {
        placement: 'end' as const,
        avatar: () => <Avatar style={{ background: '#87d068' }} icon={<UserOutlined />} />,
      },
    }),
    [],
  );

  return (
    <div style={{ height: 600, display: 'flex', flexDirection: 'column', gap: 12 }}>
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
        <span>Total items: {items.length}</span>
        <button
          type="button"
          onClick={() => {
            setItems((prev) => [...prev, genItem(prev.length % 2 === 0)]);
          }}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid #d9d9d9',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Add Item
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Bubble.List
          style={{ height: '100%' }}
          items={items}
          role={memoRole}
          virtual={virtual}
        />
      </div>
    </div>
  );
};

export default App;
```