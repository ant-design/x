import React from 'react';
import { ThoughtChain } from '@ant-design/x';
import { FunctionOutlined, ReadOutlined, MessageOutlined, ApiOutlined } from '@ant-design/icons';
import type { ThoughtChainProps } from '@ant-design/x';
import { Tooltip, Tag, Card } from 'antd';

const items: ThoughtChainProps['items'] = [
  {
    key: 'prompt_engineering',
    title: '提示语工程',
    status: 'success',
    description: '分析用户输入并生成模型可理解的提示语',
    icon: <ReadOutlined />,
    content: (
      <Card>
        <pre>
          POST /process-prompt HTTP/1.1{'\n'}
          Host: llm-api.example.com{'\n'}
          Content-Type: application/json{'\n'}
          {'\n'}
          {'{'}
          {'\n'}
          {'  '}input: "分析用户输入并生成模型可理解的提示语",
          {'\n'}
          {'}'}
        </pre>
      </Card>
    ),
    footer: (
      <div>
        <Tag color="green">已完成</Tag>
        <Tooltip title="所有提示语已经成功生成并通过验证">
          <a href="#">查看详细信息</a>
        </Tooltip>
      </div>
    ),
  },
  {
    key: 'model_response_processing',
    title: '模型响应处理',
    description: '处理API响应并整理为用户可读格式',
    icon: <FunctionOutlined />,
    content: (
      <Card>
        <pre>
          HTTP/1.1 200 OK{'\n'}
          Content-Type: application/json{'\n'}
          {'\n'}
          {'{'}
          {'\n'}
          {'  '}temperature: "30°C",{'\n'}
          {'  '}condition: "Sunny",{'\n'}
          {'  '}humidity: "50%"{'\n'}
          {'}'}
        </pre>
      </Card>
    ),
  },
  {
    key: 'third_party_api_call',
    title: '第三方API调用',
    status: 'error',
    description: '调用外部天气API获取最新数据',
    icon: <ApiOutlined />,
    content: (
      <Card>
        <pre>
          POST /weather HTTP/1.1{'\n'}
          Host: api.moji.com{'\n'}
          Content-Type: application/json{'\n'}
          {'\n'}
          {'{'}
          {'\n'}
          {'  '}location: "Beijing",{'\n'}
          {'  '}date: "2024-08-15"{'\n'}
          {'}'}
        </pre>
      </Card>
    ),
    footer: (
      <div>
        <Tag color="red">出现错误</Tag>
        <Tooltip title="API调用失败，请检查API配置和网络连接">
          <a href="#">查看错误详情</a>
        </Tooltip>
      </div>
    ),
  },

  {
    key: 'user_output',
    title: '用户输出',
    status: 'pending',
    description: '将格式化的天气信息返回给用户',
    icon: <MessageOutlined />,
    content: (
      <Card>
        <pre>
          POST /send-response HTTP/1.1{'\n'}
          Host: llm-api.example.com{'\n'}
          Content-Type: application/json{'\n'}
          {'\n'}
          {'{'}
          {'\n'}
          {'  '}finalOutput: "北京的天气是30°C，晴朗。",{'\n'}
          {'  '}userId: "12345"{'\n'}
          {'}'}
        </pre>
      </Card>
    ),
    footer: (
      <div>
        <Tag color="orange">处理中</Tag>
        <Tooltip title="待处理的输出项，用户信息即将发送">
          <a href="#">查看待处理项</a>
        </Tooltip>
      </div>
    ),
  },
];

export default () => (
  <div
    style={{
      width: 600,
      padding: 20,
    }}
  >
    <ThoughtChain items={items} />
  </div>
);
