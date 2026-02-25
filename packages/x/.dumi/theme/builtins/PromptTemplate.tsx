import { XMarkdown } from '@ant-design/x-markdown';
import { Card, Typography } from 'antd';
import { createStyles, css } from 'antd-style';
import React from 'react';
import useLocale from '../../hooks/useLocale';

const { Text } = Typography;

const useStyle = createStyles(({ token }) => ({
  container: css`
    border-radius: ${token.borderRadiusLG}px;
    border: 1px solid ${token.colorSplit};
  `,
  item: css`
    a {
      width: 100%;
    }
    cursor: pointer;
    transition: all ${token.motionDurationMid} ${token.motionEaseInOut};
    &:hover {
      background-color: ${token.colorFillQuaternary};
    }
  `,
  itemMeta: css`
    padding-inline: ${token.padding}px};
  `,
}));

const PromptTemplate: React.FC<{
  title: string;
  children: React.ReactNode;
}> = (props) => {
  console.log(props, 'props');
  // ======================== locale =========================
  const [_, lang] = useLocale();

  // ======================== style =========================

  const { styles } = useStyle();

  // ======================== Render ========================
  return (
    <Card
      title={props.title}
      extra={<Text copyable={{ text: props.children as string }} />}
      style={{ width: 300 }}
    >
      <XMarkdown content={props.children as string} />
    </Card>
  );
};

export default PromptTemplate;
