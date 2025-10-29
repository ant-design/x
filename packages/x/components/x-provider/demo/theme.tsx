import {
  CommentOutlined,
  FireOutlined,
  HeartOutlined,
  OpenAIOutlined,
  ReadOutlined,
  RocketOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Conversations, Prompts, PromptsProps, Sender, Suggestion, XProvider } from '@ant-design/x';
import { Card, ColorPicker, Divider, Flex, message, Slider, Space, Typography } from 'antd';
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

              <Suggestion items={[{ label: 'Write a report', value: 'report' }]}>
                {({ onTrigger, onKeyDown }) => (
                  <Sender
                    autoSize={{
                      maxRows: 3,
                      minRows: 2,
                    }}
                    suffix={false}
                    slotConfig={[
                      { type: 'text', value: 'I want to go to' },
                      {
                        type: 'select',
                        key: 'destination',
                        props: {
                          defaultValue: 'Beijing',
                          options: ['Beijing', 'Shanghai', 'Guangzhou'],
                          placeholder: 'Please select a destination',
                        },
                      },
                      { type: 'text', value: 'for a trip with ' },
                      { type: 'tag', key: 'tag', props: { label: '@ Chuck', value: 'a man' } },
                      { type: 'text', value: ', the date is ' },
                      {
                        type: 'input',
                        key: 'date',
                        props: {
                          placeholder: 'Please enter a date',
                        },
                      },
                      { type: 'text', value: ', and the price should be ' },
                      {
                        type: 'custom',
                        key: 'priceRange',
                        props: {
                          defaultValue: [20, 50],
                        },
                        customRender: (value: any, onChange: (value: any) => void, props) => {
                          return (
                            <div style={{ width: '100px' }}>
                              <Slider
                                {...props}
                                style={{ margin: 0 }}
                                range
                                value={value}
                                onChange={onChange}
                              />
                            </div>
                          );
                        },
                        formatResult: (value: any) => {
                          return `between ${value[0]} and ${value[1]} RMB.`;
                        },
                      },
                    ]}
                    onChange={(nextVal) => {
                      if (nextVal === '/') {
                        onTrigger();
                      } else if (!nextVal) {
                        onTrigger(false);
                      }
                    }}
                    footer={(actions) => (
                      <Flex justify="space-between" align="center">
                        <Sender.Switch value={true} icon={<OpenAIOutlined />}>
                          Deep Think
                        </Sender.Switch>
                        {actions}
                      </Flex>
                    )}
                    onKeyDown={onKeyDown}
                    placeholder='Type "/" to trigger suggestion'
                  />
                )}
              </Suggestion>
            </Flex>
          </Flex>
        </XProvider>
      </Card>
    </>
  );
};
