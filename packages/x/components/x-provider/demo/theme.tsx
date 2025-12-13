import {
  CommentOutlined,
  FireOutlined,
  HeartOutlined,
  OpenAIOutlined,
  ReadOutlined,
  RocketOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import {
  Conversations,
  Prompts,
  PromptsProps,
  Sender,
  type SenderProps,
  XProvider,
} from '@ant-design/x';
import { Card, ColorPicker, Divider, Flex, message, Space, Typography } from 'antd';
import React from 'react';

type ThemeData = {
  colorPrimary: string;
};

const defaultData: ThemeData = {
  colorPrimary: '#d10eef',
};

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const items: PromptsProps['items'] = [
  {
    key: '1',
    label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, 'Hot Topics'),
    description: 'What are you interested in?',
    children: [
      {
        key: '1-1',
        description: "What's new in X?",
      },
      {
        key: '1-2',
        description: "What's AGI?",
      },
      {
        key: '1-3',
        description: 'Where is the doc?',
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Design Guide'),
    description: 'How to design a good product?',
    children: [
      {
        key: '2-1',
        icon: <HeartOutlined />,
        description: 'Know the well',
      },
      {
        key: '2-2',
        icon: <SmileOutlined />,
        description: 'Set the AI role',
      },
      {
        key: '2-3',
        icon: <CommentOutlined />,
        description: 'Express the feeling',
      },
    ],
  },
  {
    key: '3',
    label: renderTitle(<RocketOutlined style={{ color: '#722ED1' }} />, 'Start Creating'),
    description: 'How to start a new project?',
    children: [
      {
        key: '3-1',
        label: 'Fast Start',
        description: 'Install Ant Design X',
      },
      {
        key: '3-2',
        label: 'Online Playground',
        description: 'Play on the web without installing',
      },
    ],
  },
];

const slotConfig: SenderProps['slotConfig'] = [
  { type: 'text', value: 'Please write an article about ' },
  {
    type: 'select',
    key: 'writing_type',
    props: {
      options: ['Campus', 'Travel', 'Reading'],
      placeholder: 'Please enter a topic',
    },
  },
  { type: 'text', value: '. The requirement is ' },
  {
    type: 'content',
    key: 'writing_num',
    props: {
      defaultValue: '800',
      placeholder: '[Please enter the number of words]',
    },
  },
  { type: 'text', value: ' words.' },
];
export default () => {
  const [data, setData] = React.useState<ThemeData>(defaultData);

  return (
    <>
      <Flex gap={12} style={{ marginBottom: 16 }} align="center">
        <Typography.Text>ColorPrimary:</Typography.Text>
        <ColorPicker
          value={data.colorPrimary}
          onChange={(value) => {
            setData((origin) => ({ ...origin, colorPrimary: value.toHexString() }));
          }}
        />
      </Flex>
      <Card>
        <XProvider
          theme={{
            token: data,
          }}
        >
          <Flex style={{ height: 500 }} gap={12}>
            <Conversations
              style={{ width: 130 }}
              creation={{
                onClick: () => {},
              }}
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: 'Conversation - 1',
                },
                {
                  key: '2',
                  label: 'Conversation - 2',
                },
              ]}
            />
            <Divider orientation="vertical" style={{ height: '100%' }} />
            <Flex justify="space-between" vertical style={{ flex: 1 }} gap={8}>
              <Prompts
                title="Do you want?"
                items={items}
                wrap
                styles={{
                  list: {
                    justifyContent: 'space-around',
                    maxWidth: 1000,
                    margin: '0 auto',
                  },
                  item: {
                    flex: 'none',
                    width: 'calc(30% - 6px)',
                    backgroundImage: 'linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)',
                    border: 0,
                  },
                  subItem: {
                    background: 'rgba(255,255,255,0.45)',
                    border: '1px solid #FFF',
                  },
                }}
                onItemClick={(info) => {
                  message.success(`You clicked a prompt: ${info.data.key}`);
                }}
              />
              <Sender
                autoSize={{
                  maxRows: 3,
                  minRows: 2,
                }}
                suffix={false}
                slotConfig={slotConfig}
                footer={(actions) => (
                  <Flex justify="space-between" align="center">
                    <Sender.Switch value={true} icon={<OpenAIOutlined />}>
                      Deep Think
                    </Sender.Switch>
                    {actions}
                  </Flex>
                )}
              />
            </Flex>
          </Flex>
        </XProvider>
      </Card>
    </>
  );
};
