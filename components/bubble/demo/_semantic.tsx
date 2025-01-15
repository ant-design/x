import { CopyOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Avatar, Button, Space, theme } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    avatar: '头像的外层容器',
    header: '头部的容器',
    content: '聊天内容的容器',
    footer: '底部的容器',
  },
  en: {
    avatar: 'Wrapper element of the avatar',
    header: 'Wrapper element of the header',
    content: 'Wrapper element of the content',
    footer: 'Wrapper element of the footer',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  const { token } = theme.useToken();

  return (
    <SemanticPreview
      semantics={[
        { name: 'avatar', desc: locale.avatar },
        { name: 'header', desc: locale.header },
        { name: 'content', desc: locale.content },
        { name: 'footer', desc: locale.footer },
      ]}
    >
      <Bubble
        content="Feel free to use Ant Design !"
        avatar={<Avatar size={32} icon={<UserOutlined />} />}
        header="Ant Design X"
        footer={
          <Space size={token.paddingXXS}>
            <Button color="default" variant="text" size="small" icon={<SyncOutlined />} />
            <Button color="default" variant="text" size="small" icon={<CopyOutlined />} />
          </Space>
        }
      />
    </SemanticPreview>
  );
};

export default App;
