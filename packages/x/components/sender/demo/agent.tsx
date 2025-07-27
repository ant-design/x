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
import { Attachments, AttachmentsProps, Sender, SenderProps } from '@ant-design/x';
import { Button, Divider, Dropdown, Flex, GetRef, MenuProps, message, theme } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const AgentInfo: {
  [key: string]: {
    icon: React.ReactNode;
    label: string;
  };
} = {
  deep_search: {
    icon: <SearchOutlined />,
    label: 'Deep Search',
  },
  ai_code: {
    icon: <CodeOutlined />,
    label: 'AI Code',
  },
  ai_writing: {
    icon: <EditOutlined />,
    label: 'Writing',
  },
};

const FileInfo: {
  [key: string]: {
    icon: React.ReactNode;
    label: string;
  };
} = {
  file_image: {
    icon: <FileImageOutlined />,
    label: 'x-image',
  },
};

const App: React.FC = () => {
  const [value, setValue] = useState<string>('Hello? this is X!');
  const [loading, setLoading] = useState<boolean>(false);
  const [deepThink, setDeepThink] = useState<boolean>(false);
  const { token } = theme.useToken();
  const [slotConfig, setSlotConfig] = useState<SenderProps['slotConfig']>([]);

  const [fileList, setFileList] = useState<AttachmentsProps['items']>([]);
  const agentItems: MenuProps['items'] = Object.keys(AgentInfo).map((agent) => {
    const { icon, label } = AgentInfo[agent];
    return {
      key: agent,
      icon,
      label,
      disabled: !!slotConfig?.find((config) => config.key === agent),
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

  const iconStyle = {
    fontSize: 16,
    color: token.colorText,
  };

  const senderRef = useRef<GetRef<typeof Sender>['SlotTextAreaRef']>(null);
  const agentItemClick: MenuProps['onClick'] = (item) => {
    const { icon, label } = AgentInfo[item.key];
    senderRef.current?.insert?.([
      {
        type: 'tag',
        key: item.key,
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
  const fileItemClick: MenuProps['onClick'] = (item) => {
    const { icon, label } = FileInfo[item.key];
    senderRef.current?.insert?.([
      {
        type: 'tag',
        key: item.key + Date.now(),
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

  const [open, setOpen] = React.useState(false);
  const attachmentsRef = React.useRef<GetRef<typeof Attachments>>(null);

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      styles={{
        content: {
          padding: 0,
        },
      }}
      open={open}
      onOpenChange={setOpen}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        // Mock not real upload file
        beforeUpload={() => false}
        items={fileList}
        onChange={({ fileList }) => setFileList(fileList)}
        getDropContainer={() => senderRef.current?.nativeElement}
      />
    </Sender.Header>
  );

  return (
    <Flex vertical gap="middle">
      <Sender
        loading={loading}
        value={value}
        ref={senderRef}
        placeholder="Press Enter to send message"
        header={senderHeader}
        footer={(actionNode) => {
          return (
            <Flex justify="space-between" align="center">
              <Flex gap="small" align="center">
                <Button style={iconStyle} type="text" icon={<PaperClipOutlined />} />
                <Button
                  color={deepThink ? 'primary' : 'default'}
                  variant={deepThink ? 'solid' : 'outlined'}
                  onClick={() => setDeepThink((ori) => !ori)}
                  icon={<OpenAIOutlined />}
                >
                  Deep Think
                </Button>
                <Dropdown menu={{ onClick: agentItemClick, items: agentItems }}>
                  <Button icon={<AntDesignOutlined />}>Agents</Button>
                </Dropdown>
                {fileItems?.length ? (
                  <Dropdown menu={{ onClick: fileItemClick, items: fileItems }}>
                    <Button icon={<ProfileOutlined />}>Files</Button>
                  </Dropdown>
                ) : null}
              </Flex>
              <Flex align="center">
                <Button type="text" style={iconStyle} icon={<ApiOutlined />} />
                <Divider orientation="vertical" />
                {actionNode}
              </Flex>
            </Flex>
          );
        }}
        suffix={false}
        onChange={(v, _, config) => {
          setSlotConfig(config);
          setValue(v);
        }}
        onSubmit={() => {
          setValue('');
          setLoading(true);
          message.info('Send message!');
        }}
        onCancel={() => {
          setLoading(false);
          message.error('Cancel sending!');
        }}
        slotConfig={[]}
        autoSize={{ minRows: 3, maxRows: 6 }}
      />
    </Flex>
  );
};

export default () => <App />;
