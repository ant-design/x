import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Flex, Skeleton, Space, Switch, Typography } from 'antd';
import React, { useState } from 'react';
import { useMarkdownTheme } from '../_utils';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const { Text } = Typography;

// 简化的示例文本
const text = `# Ant Design X

Ant Design X 是一款AI应用复合工具集，融合了 UI 组件库、流式 Markdown 渲染引擎和 AI SDK，为开发者提供构建下一代 AI 驱动应用的完整工具链。

![Ant Design X](https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/0lMhRYbo0-8AAAAAQDAAAAgADlJoAQFr/original)


基于 Ant Design 设计体系的 React UI 库、专为 AI 驱动界面设计，开箱即用的智能对话组件、无缝集成 API 服务，快速搭建智能应用界面，查看详情请点击 [Ant Design X](https://github.com/ant-design/x)。
`;

// 自定义加载组件
const LoadingComponents = {
  'loading-link': () => (
    <Skeleton.Button active size="small" style={{ margin: '4px 0', width: 16, height: 16 }} />
  ),
  'loading-image': () => <Skeleton.Image active style={{ width: 60, height: 60 }} />,
};

const App: React.FC = () => {
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [enableCache, setEnableCache] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [index, setIndex] = useState(0);
  const [className] = useMarkdownTheme();
  const timer = React.useRef<any>(-1);

  const renderStream = () => {
    if (index >= text.length) {
      clearTimeout(timer.current);
      setIsStreaming(false);
      return;
    }
    timer.current = setTimeout(() => {
      setIndex((prev) => prev + 1);
      renderStream();
    }, 50);
  };

  React.useEffect(() => {
    if (index === text.length) return;
    renderStream();
    setIsStreaming(true);
    return () => {
      clearTimeout(timer.current);
    };
  }, [index]);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Flex vertical gap="middle">
        <Flex gap="small" justify="end">
          <Space>
            <Text>动画</Text>
            <Switch
              checked={enableAnimation}
              onChange={setEnableAnimation}
              checkedChildren="开"
              unCheckedChildren="关"
            />
          </Space>
          <Space>
            <Text>语法处理</Text>
            <Switch
              checked={enableCache}
              onChange={setEnableCache}
              checkedChildren="开"
              unCheckedChildren="关"
            />
          </Space>
          <Button style={{ alignSelf: 'flex-end' }} onClick={() => setIndex(0)}>
            重新渲染
          </Button>
        </Flex>

        <Bubble
          content={text.slice(0, index)}
          contentRender={(content) => (
            <XMarkdown
              className={className}
              content={content as string}
              paragraphTag="div"
              streaming={{
                hasNextChunk: isStreaming && enableCache,
                enableAnimation,
                incompleteMarkdownComponentMap: {
                  link: 'loading-link',
                  image: 'loading-image',
                },
              }}
              components={LoadingComponents}
            />
          )}
        />
      </Flex>
    </div>
  );
};

export default App;
