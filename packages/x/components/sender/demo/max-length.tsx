import { Sender } from '@ant-design/x';
import { Typography } from 'antd';
import React from 'react';

const { Paragraph, Text } = Typography;

const App = () => {
  const [value, setValue] = React.useState('');

  return (
    <div>
      <Paragraph>Sender with Length Limit</Paragraph>
      <Sender
        value={value}
        onChange={setValue}
        maxLength={50}
        showCount
        placeholder="Please enter content, max 50 characters..."
        onSubmit={(msg) => {
          console.log('Submit:', msg);
          setValue('');
        }}
      />
      <Paragraph style={{ marginTop: 40 }}>Custom Count Display</Paragraph>
      <Sender
        value={value}
        onChange={setValue}
        maxLength={50}
        showCount={({ count, maxLength }) => (
          <Text
            style={{
              position: 'absolute',
              color: maxLength && count > maxLength * 0.8 ? 'red' : '#ccc',
              fontSize: 10,
              marginBottom: 4,
            }}
          >
            {maxLength
              ? `Entered ${count} characters, limit ${maxLength} characters`
              : `Entered ${count} characters`}
          </Text>
        )}
        placeholder="Custom count display..."
        onSubmit={(msg) => {
          console.log('Submit:', msg);
          setValue('');
        }}
      />
      <Paragraph style={{ marginTop: 40 }}>Count Only, No Length Limit</Paragraph>
      <Sender
        value={value}
        onChange={setValue}
        showCount
        placeholder="Character count only, no length limit..."
        onSubmit={(msg) => {
          console.log('Submit:', msg);
          setValue('');
        }}
      />
    </div>
  );
};

export default App;
