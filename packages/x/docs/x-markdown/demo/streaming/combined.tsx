import { SettingOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Flex, Input, Popover, Skeleton, Switch, Typography, theme } from 'antd';
import React, { useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const { Text } = Typography;

interface ToggleItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ label, checked, onChange }) => (
  <Flex align="center" justify="space-between" gap={16} style={{ minWidth: 180 }}>
    <Text style={{ fontSize: 12, margin: 0, whiteSpace: 'nowrap' }}>{label}</Text>
    <Switch size="small" checked={checked} onChange={onChange} />
  </Flex>
);

interface InputItemProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const InputItem: React.FC<InputItemProps> = ({ label, value, onChange, disabled }) => (
  <Flex align="center" justify="space-between" gap={16} style={{ minWidth: 180 }}>
    <Text style={{ fontSize: 12, margin: 0, whiteSpace: 'nowrap' }}>{label}</Text>
    <Input
      size="small"
      style={{ width: 80 }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  </Flex>
);

// 简化的示例文本
const text = `# Ant Design X

Ant Design X 是一款 AI 应用复合工具集，融合了 UI 组件库、流式 Markdown 渲染引擎和 AI SDK，为开发者提供构建下一代 AI 驱动应用的完整工具链。

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
  const [tailEnabled, setTailEnabled] = useState(false);
  const [tailContent, setTailContent] = useState('▋');
  const [isStreaming, setIsStreaming] = useState(false);
  const [index, setIndex] = useState(0);
  const { theme: antdTheme } = theme.useToken();
  const className = antdTheme.id === 0 ? 'x-markdown-light' : 'x-markdown-dark';
  const timer = React.useRef<any>(-1);

  React.useEffect(() => {
    clearTimeout(timer.current);

    if (index >= text.length) {
      setIsStreaming(false);
      return;
    }

    setIsStreaming(true);
    timer.current = setTimeout(() => {
      setIndex((prev) => Math.min(prev + 1, text.length));
    }, 50);

    return () => {
      clearTimeout(timer.current);
    };
  }, [index]);

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 800,
        margin: '0 auto',
        height: 360,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Flex vertical gap="middle" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Flex gap="small" justify="end" style={{ flexShrink: 0 }}>
          <Popover
            trigger="click"
            placement="bottomRight"
            content={
              <Flex vertical gap={10}>
                <ToggleItem
                  label="Animation"
                  checked={enableAnimation}
                  onChange={setEnableAnimation}
                />
                <ToggleItem label="Syntax Cache" checked={enableCache} onChange={setEnableCache} />
                <ToggleItem label="Tail" checked={tailEnabled} onChange={setTailEnabled} />
                <InputItem
                  label="Tail Content"
                  value={tailContent}
                  onChange={setTailContent}
                  disabled={!tailEnabled}
                />
              </Flex>
            }
          >
            <Button type="default" size="small" icon={<SettingOutlined />}>
              Config
            </Button>
          </Popover>
          <Button
            type="primary"
            size="small"
            style={{ alignSelf: 'flex-end' }}
            onClick={() => {
              setIndex(0);
              setIsStreaming(true);
            }}
          >
            Run Stream
          </Button>
        </Flex>

        <Flex style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
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
                  tail: tailEnabled ? { content: tailContent || '▋' } : false,
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
      </Flex>
    </div>
  );
};

export default App;
