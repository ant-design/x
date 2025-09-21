import type { BubbleProps } from '@ant-design/x';
import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Avatar, Flex, Slider, Space, Typography } from 'antd';
import React from 'react';
import { useMarkdownTheme } from '../_utils';

const { Text } = Typography;

const text = `
乌镇是中国著名的江南水乡古镇，位于浙江省嘉兴市桐乡市，地处杭嘉湖平原，距离杭州约80公里。以下是关于乌镇的详细介绍：

---
### **1. 地理位置**
- **区域**：长三角中心地带，东临上海，南接杭州，北靠苏州，交通便利。
- **水系**：京杭大运河支流穿镇而过，河道纵横，典型的"小桥流水人家"风貌。
---
### **2. 历史文化**
- **建镇历史**：距今1300多年，明清时期因丝绸业繁盛成为商业重镇。
- **文化特色**：
  - **茅盾故居**：中国现代文学巨匠茅盾的出生地，现为纪念馆。
  - **传统民俗**：保留蓝印花布制作、高杆船表演等非遗技艺。
- **世界互联网大会**：2014年起成为永久会址，被誉为"东方达沃斯"。
---
### **3. 景区划分**
- **东栅**：以原住民生活和传统作坊为主，更具烟火气。
  - 必看景点：茅盾故居、江南百床馆、宏源泰染坊。
- **西栅**：经过保护性开发，夜景绝美，商业设施完善。
  - 推荐体验：摇橹船夜游、木心美术馆、昭明书院。
---
### **4. 特色体验**
- **乘船游览**：木船穿梭水道，感受水乡韵味。
- **夜宿乌镇**：西栅的民宿临水而建，清晨静谧如画。
- **节庆活动**：
  - **乌镇戏剧节**（每年10月）：国内外戏剧团队齐聚。
  - **春节水灯会**：传统花灯映照水面。
---
### **5. 美食与特产**
- **小吃**：定胜糕、姑嫂饼、羊肉面、萝卜丝饼。
- **三白酒**：本地米酒，醇香甘冽。
- **手工制品**：蓝印花布、竹编工艺品。
---
### **6. 旅游贴士**
- **最佳时间**：春秋季（避开梅雨季）；冬季游客少，别有韵味。
- **门票**：
  - 东栅110元，西栅150元，联票190元（建议分两天游玩）。
- **交通**：
  - **高铁**：至桐乡站，转公交K282直达。
  - **自驾**：杭州/上海出发约1.5-2小时。
---
乌镇完美融合了古典水乡风情与现代文化活力，无论是追寻历史，还是享受慢生活，都是理想之选！如果想了解具体景点或行程规划，欢迎继续提问~ 🚣‍♀️
`;

const RenderMarkdown: BubbleProps['contentRender'] = (content) => {
  const [className] = useMarkdownTheme();

  return <XMarkdown className={className}>{content}</XMarkdown>;
};

const App: React.FC = () => {
  const [value, setValue] = React.useState(1);

  return (
    <Flex vertical gap="middle">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text strong>Render step</Text>
        <Slider max={50} min={1} onChange={setValue} value={value} />
      </Space>

      <Bubble
        typing={{ effect: 'typing', step: value, interval: 150 }}
        content={text}
        contentRender={RenderMarkdown}
        components={{
          avatar: (
            <Avatar src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2Q5LRJ3LFPUAAAAAAAAAAAAADmJ7AQ/fmt.webp" />
          ),
        }}
      />
    </Flex>
  );
};

export default App;
