import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';
import { Bubble } from '@ant-design/x';

const locales = {
  cn: {
    avatar: '头像的外层容器',
    content: '聊天内容的容器',
  },
  en: {
    avatar: 'Wrapper element of the avatar',
    content: 'Wrapper element of the content',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      semantics={[
        { name: 'avatar', desc: locale.avatar },
        { name: 'content', desc: locale.content },
      ]}
    >
      <Bubble
        content="Feel free to use Ant Design !"
        avatar={<Avatar size={32} icon={<UserOutlined />} />}
      />
    </SemanticPreview>
  );
};

export default App;
