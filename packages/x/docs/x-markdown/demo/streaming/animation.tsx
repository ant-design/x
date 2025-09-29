import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Flex, Space, Switch, Typography } from 'antd';
import React, { useState } from 'react';
import { useMarkdownTheme } from '../_utils';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const { Text } = Typography;

const text = `
# 《诗经》之美：千年风雅颂

> **关关雎鸠，在河之洲。窈窕淑女，君子好逑。**
> 
> ——《诗经·周南·关雎》

## 📜 风雅颂三体

### 🎵 **风** - 民间歌谣
《诗经》中的**国风**共160篇，收录了十五个诸侯国的民间歌谣：

- **周南**：《关雎》、《葛覃》、《卷耳》
- **召南**：《鹊巢》、《采蘩》、《草虫》
- **秦风**：《蒹葭》、《无衣》、《渭阳》

> **蒹葭苍苍，白露为霜。所谓伊人，在水一方。**
>
> 这首《蒹葭》以其朦胧唯美的意境，成为中国古典诗歌中描写爱情的千古绝唱。

### 现代演绎

### ️ **雅** - 朝廷正音
分为**大雅**31篇和**小雅**74篇，多为贵族宴饮、朝会之作：

#### 大雅代表
- **《文王》**：歌颂周文王的圣德
- **《生民》**：记述周人始祖后稷的传说
- **《板》**：讽刺周厉王的暴政

#### 小雅代表
- **《鹿鸣》**："呦呦鹿鸣，食野之苹"，宴饮诗的开篇
- **《采薇》**："昔我往矣，杨柳依依"，戍边将士的思乡之作
- **《车攻》**：描写周宣王田猎的壮观场面

### 🙏 **颂** - 宗庙祭祀
共40篇，包括：

| 类别 | 数量 | 用途 |
|------|------|------|
| **周颂** | 31篇 | 周王室宗庙祭祀 |
| **鲁颂** | 4篇 | 鲁国宗庙祭祀 |
| **商颂** | 5篇 | 宋国宗庙祭祀 |

## 🎨 艺术特色

### 表现手法
1. **赋** - 直陈其事
2. **比** - 比喻比拟
3. **兴** - 先言他物以引起所咏之词

### 语言特色
- **重章叠句**：增强节奏感和音乐美
- **比兴手法**：含蓄蕴藉，意境深远
- **四言为主**：整齐划一，朗朗上口

## 🌸 经典篇章赏析

### 《关雎》
> **关关雎鸠，在河之洲。**
> **窈窕淑女，君子好逑。**

**赏析**：以水鸟和鸣起兴，引出男女爱情的美好，语言清新，意境优美。

### 《蒹葭》
> **蒹葭苍苍，白露为霜。**
> **所谓伊人，在水一方。**

**赏析**：营造了一种可望不可即的朦胧美感，表达了对理想人物的向往与追求。

### 《氓》
> **氓之蚩蚩，抱布贸丝。**
> **匪来贸丝，来即我谋。**

**赏析**：叙述了一个完整的爱情故事，从相识、相爱到婚变、决绝，是中国最早的叙事长诗之一。

## 📚 历史影响

### 文学价值
- **现实主义源头**：开创了中国现实主义文学传统
- **比兴手法**：成为后世诗歌创作的重要技法
- **四言诗体**：影响了汉魏六朝的诗体发展

### 文化意义
- **儒家经典**：被列为"五经"之一
- **教育功能**：古代士人必读之书
- **语言宝库**：保存了大量上古汉语词汇

## 🎭 现代传承

### 当代应用
- **教育领域**：中小学语文教材必选篇目
- **艺术创作**：音乐、舞蹈、戏剧的灵感源泉
- **文化传播**：向世界展示中华文化的瑰宝

### 国际影响
- **翻译传播**：被译成多种语言在世界各地传播
- **学术研究**：成为国际汉学研究的重要对象
- **文化交流**：增进中外文化交流的桥梁

---

> **《诗经》如一条文化长河，流淌着中华民族的精神血脉，滋养着一代又一代华夏儿女的心灵。**
> 
> 在快节奏的现代生活中，让我们重新聆听这些来自远古的声音，感受那份跨越千年的情感共鸣。
`;

const App = () => {
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [className] = useMarkdownTheme();
  const [index, setIndex] = React.useState(0);
  const timer = React.useRef<any>(-1);

  const renderStream = () => {
    if (index >= text.length) {
      clearTimeout(timer.current);
      return;
    }
    timer.current = setTimeout(() => {
      setIndex((prev) => prev + 2);
      renderStream();
    }, 80);
  };

  React.useEffect(() => {
    if (index === text.length) return;
    renderStream();
    return () => {
      clearTimeout(timer.current);
    };
  }, [index]);

  return (
    <Flex vertical gap="small">
      <Space align="center" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Space>
          <Text>Animation</Text>
          <Switch checked={enableAnimation} onChange={setEnableAnimation} />
        </Space>

        <Button onClick={() => setIndex(0)}>Re-Render</Button>
      </Space>

      <Bubble
        content={text.slice(0, index)}
        className={className}
        contentRender={(content) => (
          <XMarkdown streaming={{ enableAnimation }}>{content}</XMarkdown>
        )}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
