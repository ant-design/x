import React from 'react';
import { ThoughtChain } from '@ant-design/x';
import {
  FunctionOutlined,
  ItalicOutlined,
  DeploymentUnitOutlined,
  ReadOutlined,
  UnorderedListOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import type { ThoughtChainProps } from '@ant-design/x';
import { Card, Avatar } from 'antd';

const { Meta } = Card;

const items: ThoughtChainProps['items'] = [
  {
    key: 'prompt_engineering',
    title: '提示语工程',
    description: '分析用户输入并生成模型可理解的提示语',
    extra: <UnorderedListOutlined />,
    icon: <ReadOutlined />,
    children: (
      <pre
        style={{ background: 'rgba(0,0,0,0.1)', padding: 16, borderRadius: 8, overflow: 'auto' }}
      >
        POST /process-prompt HTTP/1.1{'\n'}
        Host: llm-api.example.com{'\n'}
        Content-Type: application/json{'\n'}
        {'\n'}
        {'{'}
        {'\n'}
        {'  '}input:
        "分析用户输入并生成模型可理解的提示语分析用户输入并生成模型可理解的提示语分析用户输入并生成模型可理解的提示语",
        {'\n'}
        {'}'}
      </pre>
    ),
  },
  {
    key: 'model_analysis',
    title: '模型分析',
    extra: <UnorderedListOutlined />,
    icon: <DeploymentUnitOutlined />,
    description: '模型处理提示语并准备进行下一步操作',
    children: (
      <Card
        style={{ width: 300 }}
        cover={
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
          title="Card title"
          description="This is the description"
        />
      </Card>
    ),
  },
  {
    key: 'third_party_api_call',
    title: '第三方API调用',
    extra: <UnorderedListOutlined />,
    description: '调用外部天气API获取最新数据',
    icon: <ApiOutlined />,
    children: (
      <pre
        style={{ background: 'rgba(0,0,0,0.1)', padding: 16, borderRadius: 8, overflow: 'auto' }}
      >
        POST /weather HTTP/1.1{'\n'}
        Host: api.moji.com{'\n'}
        Content-Type: application/json{'\n'}
        {'\n'}
        {'{'}{'\n'}
        {"  "}location: "Beijing",{'\n'}
        {"  "}date: "2024-08-15"{'\n'}
        {'}'}
      </pre>
    ),
  },
  {
    key: 'model_response_processing',
    title: '模型响应处理',
    description: '处理API响应并整理为用户可读格式',
    icon: <FunctionOutlined />,
    extra: <UnorderedListOutlined />,
    children: (
      <pre
        style={{ background: 'rgba(0,0,0,0.1)', padding: 16, borderRadius: 8, overflow: 'auto' }}
      >
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
    ),
  },
  {
    key: 'user_output',
    title: '用户输出',
    description: '将格式化的天气信息返回给用户',
    icon: <ItalicOutlined />,
    children: (
      <pre
        style={{ background: 'rgba(0,0,0,0.1)', padding: 16, borderRadius: 8, overflow: 'auto' }}
      >
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
    ),
  },
];

export default () => (
  <div
    style={{
      width: 500,
    }}
  >
    <ThoughtChain items={items} />
  </div>
);
