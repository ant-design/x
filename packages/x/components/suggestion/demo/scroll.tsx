import { Sender, Suggestion } from '@ant-design/x';
import React, { useState } from 'react';

// Generate 25+ items to demonstrate scrolling
const suggestions = Array.from({ length: 25 }, (_, i) => ({
  label: `Option ${i + 1}`,
  value: `option-${i + 1}`,
}));

const Demo: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Suggestion
      items={suggestions}
      onSelect={(itemVal) => {
        setValue(`[${itemVal}]:`);
      }}
    >
      {({ onTrigger, onKeyDown }) => (
        <Sender
          value={value}
          onSubmit={(value) => {
            console.log(value);
            setValue('');
          }}
          onChange={(nextVal) => {
            if (nextVal === '/') {
              onTrigger();
            } else if (!nextVal) {
              onTrigger(false);
            }
            setValue(nextVal);
          }}
          onKeyDown={onKeyDown}
          placeholder="输入 / 获取建议"
        />
      )}
    </Suggestion>
  );
};

export default Demo;