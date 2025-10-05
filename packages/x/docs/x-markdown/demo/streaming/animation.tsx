import type { BubbleListProps } from '@ant-design/x';
import { Bubble, Sender } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { DefaultChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import { Button, Row } from 'antd';
import React, { useMemo, useState } from 'react';
import { mockFetch, useMarkdownTheme } from '../_utils';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const fullContent = `
# 杭州城市介绍

杭州，位于中国东南沿海、浙江省北部，地处长江三角洲南翼，钱塘江下游，是一座兼具自然风光、历史底蕴与现代活力的国家历史文化名城和重要经济中心。自古以来，杭州便以“人间天堂”之美誉闻名于世。

---

## 一、历史沿革

- **秦代**：设钱唐县，为杭州建城之始。
- **五代十国**：吴越国定都杭州，大兴佛教，保境安民。
- **南宋时期**：1129年升为“临安府”，后成为南宋实际首都，当时世界最繁华都市之一。
- **现代**：浙江省省会，长三角核心城市，国家首批历史文化名城。

---

## 二、自然与人文景观

### 1. 西湖（世界文化遗产）
- 2011年入选《世界遗产名录》
- 苏堤春晓
- 曲院风荷
- 平湖秋月
- 断桥残雪
- 花港观鱼
- 柳浪闻莺
- 三潭印月
- 双峰插云
- 雷峰夕照
- 南屏晚钟

### 2. 其他著名景点
- **西溪国家湿地公园**：城市中的天然氧吧，“城市之肾”
- **千岛湖**：水质清澈，岛屿星罗棋布
- **灵隐寺**：江南著名古刹，香火鼎盛
- **良渚古城遗址**：2019年入选世界文化遗产，实证中华五千年文明
- **宋城 & 河坊街**：体验南宋市井文化与民俗风情

---

## 三、数字经济与科技创新

杭州是中国数字经济的策源地：

- **阿里巴巴总部**所在地，带动电商、云计算、金融科技发展
- 被誉为“中国电商之都”、“移动支付第一城”
- 云栖小镇（云计算）
- 梦想小镇（创业孵化）
- 人工智能小镇
- “城市大脑”全国领先，实现“最多跑一次”、“一码通城”等智慧政务

---

## 四、美食与物产

### 杭帮菜代表：
- 东坡肉
- 西湖醋鱼
- 龙井虾仁
- 片儿川
- 葱包桧
- 定胜糕

### 名茶特产：
- **西湖龙井**：中国十大名茶之首，核心产区：
- 狮峰
- 龙井
- 云栖
- 虎跑
- 梅家坞

---

## 五、交通与城市设施

- **杭州萧山国际机场**：通航全球主要城市
- **杭州东站**：亚洲最大铁路枢纽之一
- **地铁网络**：覆盖主城区及周边，持续扩展中
- 公共自行车 + 共享单车 + 网约车，绿色出行便捷

---

## 六、国际影响力

- **2023年第19届亚洲运动会**主办城市
- 联合国“全球可持续发展样本城市”
- 连续多年入选“中国最具幸福感城市”、“新一线城市”

---

## 总结

杭州，是一座古典与现代交融、诗意与科技并存的城市：

无论你是：

- 寻找诗意的旅行者，
- 探索商机的创业者，
- 热爱生活的定居者，

杭州，都能以它的山水、文化、创新与温度，为你打开一扇通往“人间天堂”的大门。
`;

interface MessageType {
  role: 'ai' | 'user';
  content: string;
}

const roles: BubbleListProps['role'] = {
  ai: {
    placement: 'start',
  },
  user: {
    placement: 'end',
  },
};

const App = () => {
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [content, setContent] = React.useState('');
  const [className] = useMarkdownTheme();

  let chunks = '';
  const provider = useMemo(
    () =>
      new DefaultChatProvider<MessageType, MessageType, MessageType>({
        request: XRequest('https://api.example.com/chat', {
          manual: true,
          fetch: () => mockFetch(fullContent),
          transformStream: new TransformStream<string, MessageType>({
            transform(chunk, controller) {
              chunks += chunk;
              controller.enqueue({
                content: chunks,
                role: 'ai',
              });
            },
          }),
        }),
      }),
    [content],
  );

  const { onRequest, messages, isRequesting } = useXChat({
    provider: provider,
  });

  return (
    <>
      <Row justify="end" style={{ marginBottom: 24 }}>
        <Button
          onClick={() => {
            setEnableAnimation(!enableAnimation);
          }}
        >
          Animation: {enableAnimation ? 'On' : 'Off'}
        </Button>
      </Row>

      <div
        style={{
          height: 400,
          paddingBlock: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Bubble.List
          role={roles}
          items={messages.map(({ id, message, status }) => ({
            key: id,
            role: message.role,
            content: message.content,
            status,
            contentRender:
              message.role === 'user'
                ? (content) => content
                : (content) => (
                    <XMarkdown
                      className={className}
                      content={content as string}
                      streaming={{ enableAnimation }}
                    />
                  ),
          }))}
        />
        <Sender
          loading={isRequesting}
          value={content}
          onChange={setContent}
          style={{ marginTop: 48 }}
          onSubmit={(nextContent) => {
            onRequest({
              content: nextContent,
              role: 'user',
            });
            setContent('');
          }}
        />
      </div>
    </>
  );
};

export default App;
