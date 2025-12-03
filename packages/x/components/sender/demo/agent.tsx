import {
  AntDesignOutlined,
  ApiOutlined,
  CodeOutlined,
  EditOutlined,
  FileImageOutlined,
  OpenAIOutlined,
  PaperClipOutlined,
  ProfileOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Sender, SenderProps } from '@ant-design/x';
import { MenuInfo } from '@rc-component/menu/lib/interface';
import { Button, Divider, Dropdown, Flex, GetRef, MenuProps, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const Switch = Sender.Switch;

const AgentInfo: {
  [key: string]: {
    icon: React.ReactNode;
    label: string;
    zh_label: string;
    skill: SenderProps['skill'];
    zh_skill: SenderProps['skill'];
    slotConfig: SenderProps['slotConfig'];
    zh_slotConfig: SenderProps['slotConfig'];
  };
} = {
  deep_search: {
    icon: <SearchOutlined />,
    label: 'Deep Search',
    zh_label: '深度搜索',
    skill: {
      value: 'deepSearch',
      title: 'Deep Search',
      closable: true,
    },
    zh_skill: {
      value: 'deepSearch',
      title: '深度搜索',
      closable: true,
    },
    slotConfig: [
      { type: 'text', value: 'Please help me search for news about ' },
      {
        type: 'select',
        key: 'search_type',
        props: {
          options: ['AI', 'Technology', 'Entertainment'],
          placeholder: 'Please select a category',
        },
      },
      { type: 'text', key: '', value: 'Please help me search for news about ' },
    ],
    zh_slotConfig: [
      { type: 'text', value: '请帮我搜索关于' },
      {
        type: 'select',
        key: 'search_type',
        props: {
          options: ['AI', '技术', '娱乐'],
          placeholder: '请选择一个类别',
        },
      },
      { type: 'text', key: '', value: '的新闻。' },
    ],
  },
  ai_code: {
    icon: <CodeOutlined />,
    label: 'AI Code',
    zh_label: '写代码',
    skill: {
      value: 'aiCode',
      title: 'Code Assistant',
      closable: true,
    },
    zh_skill: {
      value: 'aiCode',
      title: '代码助手',
      closable: true,
    },
    slotConfig: [
      { type: 'text', value: 'Please use ' },
      {
        type: 'select',
        key: 'code_lang',
        props: {
          options: ['JS', 'C++', 'Java'],
          placeholder: 'Please select a programming language',
        },
      },
      { type: 'text', value: ' to write a mini game.' },
    ],
    zh_slotConfig: [
      { type: 'text', value: '请使用' },
      {
        type: 'select',
        key: 'code_lang',
        props: {
          options: ['JS', 'C++', 'Java'],
          placeholder: '请选择一个编程语言',
        },
      },
      { type: 'text', value: '写一个小游戏。' },
    ],
  },
  ai_writing: {
    icon: <EditOutlined />,
    label: 'Writing',
    zh_label: '帮我写作',
    skill: {
      value: 'writing',
      title: 'Writing Assistant',
      closable: true,
    },
    zh_skill: {
      value: 'writing',
      title: '写作助手',
      closable: true,
    },
    slotConfig: [
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
    ],
    zh_slotConfig: [
      { type: 'text', value: '请帮我写一篇关于' },
      {
        type: 'select',
        key: 'writing_type',
        props: {
          options: ['校园', '旅行', '阅读'],
          placeholder: '请输入主题',
        },
      },
      { type: 'text', value: '的文章。要求是' },
      {
        type: 'content',
        key: 'writing_num',
        props: {
          defaultValue: '800',
          placeholder: '[请输入字数]',
        },
      },
      { type: 'text', value: '字。' },
    ],
  },
};

const IconStyle = {
  fontSize: 16,
};

const SwitchTextStyle = {
  display: 'inline-flex',
  width: 28,
  justifyContent: 'center',
  alignItems: 'center',
};

const FileInfo: {
  [key: string]: {
    icon: React.ReactNode;
    label: string;
    zh_label: string;
  };
} = {
  file_image: {
    icon: <FileImageOutlined />,
    label: 'x-image',
    zh_label: 'x-图片',
  },
};

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [deepThink, setDeepThink] = useState<boolean>(true);
  const [activeAgentKey, setActiveAgentKey] = useState('ai_writing');

  // ======================== sender en ========================
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const agentItems: MenuProps['items'] = Object.keys(AgentInfo).map((agent) => {
    const { icon, label } = AgentInfo[agent];
    return {
      key: agent,
      icon,
      label,
    };
  });

  const zhAgentItems: MenuProps['items'] = Object.keys(AgentInfo).map((agent) => {
    const { icon, zh_label } = AgentInfo[agent];
    return {
      key: agent,
      icon,
      label: zh_label,
    };
  });

  const fileItems = Object.keys(FileInfo).map((file) => {
    const { icon, label } = FileInfo[file];
    return {
      key: file,
      icon,
      label,
    };
  });

  const zhFileItems = Object.keys(FileInfo).map((file) => {
    const { icon, zh_label } = FileInfo[file];
    return {
      key: file,
      icon,
      label: zh_label,
    };
  });

  const agentItemClick: MenuProps['onClick'] = (item) => {
    setActiveAgentKey(item.key);
  };

  // ======================== sender zh ========================

  const senderZhRef = useRef<GetRef<typeof Sender>>(null);

  const fileItemClick = (item: MenuInfo, type?: string) => {
    const { icon, label } = FileInfo[item.key];
    const sender = type !== 'zh' ? senderRef.current : senderZhRef.current;
    sender?.insert?.([
      {
        type: 'tag',
        key: `${item.key}_${Date.now()}`,
        props: {
          label: (
            <Flex gap="small">
              {icon}
              {label}
            </Flex>
          ),
          value: item.key,
        },
      },
    ]);
  };

  // Mock send message
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        message.success('Send message successfully!');
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [loading]);

  return (
    <Flex vertical gap="middle">
      <Sender
        loading={loading}
        ref={senderRef}
        skill={AgentInfo[activeAgentKey].skill}
        placeholder="Press Enter to send message"
        footer={(actionNode) => {
          return (
            <Flex justify="space-between" align="center">
              <Flex gap="small" align="center">
                <Button style={IconStyle} type="text" icon={<PaperClipOutlined />} />
                <Switch
                  value={deepThink}
                  checkedChildren={
                    <div>
                      Deep Think:<span style={SwitchTextStyle}>on</span>
                    </div>
                  }
                  unCheckedChildren={
                    <div>
                      Deep Think:<span style={SwitchTextStyle}>off</span>
                    </div>
                  }
                  onChange={(checked: boolean) => {
                    setDeepThink(checked);
                  }}
                  icon={<OpenAIOutlined />}
                />
                <Dropdown
                  menu={{
                    selectedKeys: [activeAgentKey],
                    onClick: agentItemClick,
                    items: agentItems,
                  }}
                >
                  <Switch value={false} icon={<AntDesignOutlined />}>
                    Agent
                  </Switch>
                </Dropdown>
                {fileItems?.length ? (
                  <Dropdown menu={{ onClick: fileItemClick, items: fileItems }}>
                    <Switch value={false} icon={<ProfileOutlined />}>
                      Files
                    </Switch>
                  </Dropdown>
                ) : null}
              </Flex>
              <Flex align="center">
                <Button type="text" style={IconStyle} icon={<ApiOutlined />} />
                <Divider orientation="vertical" />
                {actionNode}
              </Flex>
            </Flex>
          );
        }}
        suffix={false}
        onSubmit={(v, _, skill) => {
          setLoading(true);
          message.info(`Send message: ${skill?.value} | ${v}`);

          senderRef.current?.clear?.();
        }}
        onCancel={() => {
          setLoading(false);
          message.error('Cancel sending!');
        }}
        slotConfig={AgentInfo[activeAgentKey].slotConfig}
        autoSize={{ minRows: 3, maxRows: 6 }}
      />
      <Sender
        loading={loading}
        ref={senderZhRef}
        skill={AgentInfo[activeAgentKey].zh_skill}
        placeholder=""
        footer={(actionNode) => {
          return (
            <Flex justify="space-between" align="center">
              <Flex gap="small" align="center">
                <Button style={IconStyle} type="text" icon={<PaperClipOutlined />} />
                <Switch
                  value={deepThink}
                  checkedChildren={
                    <>
                      深度搜索：<span style={SwitchTextStyle}>开启</span>
                    </>
                  }
                  unCheckedChildren={
                    <>
                      深度搜索：<span style={SwitchTextStyle}>关闭</span>
                    </>
                  }
                  onChange={(checked: boolean) => {
                    setDeepThink(checked);
                  }}
                  icon={<OpenAIOutlined />}
                />
                <Dropdown
                  menu={{
                    selectedKeys: [activeAgentKey],
                    onClick: agentItemClick,
                    items: zhAgentItems,
                  }}
                >
                  <Switch value={false} icon={<AntDesignOutlined />}>
                    功能应用
                  </Switch>
                </Dropdown>
                {fileItems?.length ? (
                  <Dropdown
                    menu={{ onClick: (item) => fileItemClick(item, 'zh'), items: zhFileItems }}
                  >
                    <Switch value={false} icon={<ProfileOutlined />}>
                      文件引用
                    </Switch>
                  </Dropdown>
                ) : null}
              </Flex>
              <Flex align="center">
                <Button type="text" style={IconStyle} icon={<ApiOutlined />} />
                <Divider orientation="vertical" />
                {actionNode}
              </Flex>
            </Flex>
          );
        }}
        suffix={false}
        onSubmit={(v, _, skill) => {
          setLoading(true);
          message.info(`Send message: ${skill?.value} | ${v}`);
          senderZhRef.current?.clear?.();
        }}
        onCancel={() => {
          setLoading(false);
          message.error('Cancel sending!');
        }}
        slotConfig={AgentInfo[activeAgentKey].zh_slotConfig}
        autoSize={{ minRows: 3, maxRows: 6 }}
      />
    </Flex>
  );
};

export default () => <App />;
