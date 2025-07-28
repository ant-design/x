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
import { Button, Divider, Dropdown, Flex, GetRef, MenuProps, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const Switch = Sender.Switch;

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
  };
} = {
  file_image: {
    icon: <FileImageOutlined />,
    label: 'x-image',
  },
};
const defaultSlotConfig: SenderProps['defaultSlotConfig'] = [
  { type: 'text', value: 'I want to go to ' },
  {
    type: 'select',
    key: 'destination',
    props: {
      defaultValue: 'Beijing',
      options: ['Beijing', 'Shanghai', 'Guangzhou'],
      placeholder: 'Please select a destination',
    },
  },
];

const App: React.FC = () => {
  const [value, setValue] = useState<string>('Hello? this is X!');
  const [loading, setLoading] = useState<boolean>(false);
  const [deepThink, setDeepThink] = useState<boolean>(true);
  const [slotConfigValue, setSlotConfigValue] = useState<SenderProps['defaultSlotConfig']>([]);

  const [fileList, setFileList] = useState<AttachmentsProps['items']>([]);
  const agentItems: MenuProps['items'] = Object.keys(AgentInfo).map((agent) => {
    const { icon, label } = AgentInfo[agent];
    return {
      key: agent,
      icon,
      label,
      disabled: !!slotConfigValue?.find((config) => config.key === agent),
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

  const senderRef = useRef<GetRef<typeof Sender>>(null);

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
                <Button style={IconStyle} type="text" icon={<PaperClipOutlined />} />
                <Switch
                  value={deepThink}
                  checkedChildren={
                    <>
                      Deep Think:<span style={SwitchTextStyle}>on</span>
                    </>
                  }
                  unCheckedChildren={
                    <>
                      Deep Think:<span style={SwitchTextStyle}>off</span>{' '}
                    </>
                  }
                  onChange={(checked: boolean) => {
                    setDeepThink(checked);
                  }}
                  icon={<OpenAIOutlined />}
                />
                <Dropdown menu={{ onClick: agentItemClick, items: agentItems }}>
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
        onChange={(v, _, config) => {
          setSlotConfigValue(config);
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
        defaultSlotConfig={defaultSlotConfig}
        autoSize={{ minRows: 3, maxRows: 6 }}
      />
    </Flex>
  );
};

export default () => <App />;
