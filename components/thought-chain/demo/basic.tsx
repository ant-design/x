import React from 'react';
import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';

const items: ThoughtChainProps['items'] = [
  {
    key: 'prompt_engineering',
    title: '提示语工程',
    description: '分析用户输入并生成模型可理解的提示语',
    // icon: '🚀',
    children: (
      <pre>
        POST /process-prompt HTTP/1.1{'\n'}
        Host: llm-api.example.com{'\n'}
        Content-Type: application/json{'\n'}
        {'\n'}
        {'{'}{'\n'}
        {"  "}input: "查询今天的天气",{'\n'}
        {"  "}processedPrompt: "What is the weather like today?"{'\n'}
        {'}'}
      </pre>
    ),
  },
  {
    key: 'model_analysis',
    title: '模型分析',
    description: '模型处理提示语并准备进行下一步操作',
    icon: '🔍',
    children: (
      <pre>
        POST /analyze HTTP/1.1{'\n'}
        Host: llm-api.example.com{'\n'}
        Content-Type: application/json{'\n'}
        {'\n'}
        {'{'}{'\n'}
        {"  "}prompt: "What is the weather like today?",{'\n'}
        {"  "}nextStep: "third_party_api_call"{'\n'}
        {'}'}
      </pre>
    ),
  },
  {
    key: 'third_party_api_call',
    title: '第三方API调用',
    description: '调用外部天气API获取最新数据',
    icon: '🌦',
    children: (
      <pre>
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
    icon: '📝',
    children: (
      <pre>
        HTTP/1.1 200 OK{'\n'}
        Content-Type: application/json{'\n'}
        {'\n'}
        {'{'}{'\n'}
        {"  "}temperature: "30°C",{'\n'}
        {"  "}condition: "Sunny",{'\n'}
        {"  "}humidity: "50%"{'\n'}
        {'}'}
      </pre>
    ),
  },
  {
    key: 'user_output',
    title: '用户输出',
    description: '将格式化的天气信息返回给用户',
    icon: '📤',
    children: (
      <pre>
        POST /send-response HTTP/1.1{'\n'}
        Host: llm-api.example.com{'\n'}
        Content-Type: application/json{'\n'}
        {'\n'}
        {'{'}{'\n'}
        {"  "}finalOutput: "北京的天气是30°C，晴朗。",{'\n'}
        {"  "}userId: "12345"{'\n'}
        {'}'}
      </pre>
    ),
  },
];

export default () => <ThoughtChain items={items} />;