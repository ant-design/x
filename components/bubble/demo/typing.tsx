import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';

const sentences = ['Feel free to use Ant Design !', '欢迎使用 Ant Design！'];

const useLoopSentence = () => {
  const [index, setIndex] = React.useState<number>(0);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();
  React.useEffect(() => {
    timerRef.current = setTimeout(
      () => setIndex((prevState) => (prevState ? 0 : 1)),
      sentences[index].length * 100 + 1000,
    );
    return () => clearTimeout(timerRef.current);
  }, [index]);
  return sentences[index];
};

const App = () => {
  const content = useLoopSentence();
  return (
    <Bubble
      content={content}
      typing={{ step: 1, interval: 100 }}
      avatar={{ icon: <UserOutlined /> }}
    />
  );
};

export default App;
