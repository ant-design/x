import { AntDesignOutlined, CopyOutlined, SyncOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Avatar, Button, Space, theme } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';
import { BubbleListProps } from '../interface';

const locales = {
  cn: {
    root: '对话列表根节点',
    scroll: '对话列表滚动容器',
    bubble: '对话气泡容器',
    body: '对话气泡的主体容器',
    avatar: '对话气泡的头像的外层容器',
    header: '对话气泡的头部的容器',
    content: '对话气泡的聊天内容的容器',
    footer: '对话气泡的底部的容器',
    extra: '对话气泡的尾边栏容器',
    system: '系统气泡容器',
    divider: '分割线气泡容器',
  },
  en: {
    root: 'Bubble list root node',
    scroll: 'Bubble list scroll container',
    bubble: 'Bubble root',
    body: 'Bubble main body container',
    avatar: 'Bubble avatar outer container',
    header: 'Bubble header container',
    content: 'Bubble chat content container',
    footer: 'Bubble footer container',
    extra: 'Bubble sidebar container',
    system: 'Bubble.System root',
    divider: 'Bubble.Divider root',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  const { token } = theme.useToken();
  const memoRole: BubbleListProps['role'] = React.useMemo(
    () => ({
      ai: {
        typing: true,
        components: {
          header: 'AI',
          extra: <Button color="default" variant="text" size="small" icon={<CopyOutlined />} />,
          avatar: () => <Avatar icon={<AntDesignOutlined />} />,
          footer: (
            <Space size={token.paddingXXS}>
              <Button color="default" variant="text" size="small" icon={<SyncOutlined />} />
            </Space>
          ),
        },
      },
      user: () => ({
        placement: 'end',
      }),
    }),
    [],
  );
  return (
    <SemanticPreview
      componentName="Bubble.List"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'scroll', desc: locale.scroll },
        { name: 'bubble', desc: locale.bubble },
        { name: 'body', desc: locale.body },
        { name: 'avatar', desc: locale.avatar },
        { name: 'header', desc: locale.header },
        { name: 'content', desc: locale.content },
        { name: 'footer', desc: locale.footer },
        { name: 'extra', desc: locale.extra },
        { name: 'system', desc: locale.system },
        { name: 'divider', desc: locale.divider },
      ]}
    >
      <Bubble.List
        style={{
          height: 400,
        }}
        role={memoRole}
        items={[
          { role: 'system', content: 'Welcome to Ant Design X', key: 'system' },
          {
            role: 'user',
            content: 'hello, Ant Design X',
            key: 'user',
          },
          { role: 'divider', content: 'divider', key: 'divider' },
          {
            role: 'ai',
            content: 'hello, how can I help you?',
            key: 'ai',
          },
          {
            role: 'user',
            content: 'show me the code of Bubble.List demo with semantic styles',
            key: 'user2',
          },
          { role: 'ai', content: 'ok, here is the code:', key: 'ai2' },
        ]}
        onScroll={(e) => {
          console.log('scroll', (e.target as HTMLDivElement).scrollTop);
        }}
      />
    </SemanticPreview>
  );
};

export default App;
