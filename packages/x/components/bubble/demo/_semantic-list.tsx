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
    bubble: '对话气泡容器',
    body: '对话气泡的主体容器',
    avatar: '对话气泡的头像的外层容器',
    header: '对话气泡的头部的容器',
    content: '对话气泡的聊天内容的容器',
    footer: '对话气泡的底部的容器',
    extra: '对话气泡的尾边栏容器',
  },
  en: {
    root: 'Bubble list root node',
    bubble: 'Bubble container',
    body: 'Bubble main body container',
    avatar: 'Bubble avatar outer container',
    header: 'Bubble header container',
    content: 'Bubble chat content container',
    footer: 'Bubble footer container',
    extra: 'Bubble sidebar container',
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
      reference: {
        variant: 'borderless',
        // 16px for list item gap
        styles: { root: { margin: 0, marginBottom: -12 } },
        components: { avatar: () => '' },
      },
    }),
    [],
  );
  return (
    <SemanticPreview
      componentName="Bubble.List"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'bubble', desc: locale.bubble },
        { name: 'body', desc: locale.body },
        { name: 'avatar', desc: locale.avatar },
        { name: 'header', desc: locale.header },
        { name: 'content', desc: locale.content },
        { name: 'footer', desc: locale.footer },
        { name: 'extra', desc: locale.extra },
      ]}
    >
      <Bubble.List
        role={memoRole}
        items={[
          {
            role: 'user',
            content: 'hello, Ant Design X',
            key: 'user',
          },
          {
            role: 'ai',
            content: 'hello',
            key: 'ai',
          },
        ]}
        onScroll={(e) => {
          console.log('scroll', (e.target as HTMLDivElement).scrollTop);
        }}
      />
    </SemanticPreview>
  );
};

export default App;
