import React from 'react';
import { Suggestion } from '@ant-design/x';
import { Select } from 'antd';

let uuid = 0;

const Demo: React.FC = () => {
  const [tags, setTags] = React.useState<string[]>([]);
  const [value, setValue] = React.useState('');

  return (
    <Suggestion<string>
      items={(info) => [{ label: `Trigger by '${info}'`, value: String(info) }]}
      onSelect={(info) => {
        uuid += 1;
        setTags([...tags, `Cell_${uuid}`]);
        setValue(value.replace(info, ''));
      }}
    >
      {({ onTrigger, onKeyDown }) => {
        return (
          <Select
            value={tags}
            style={{ width: '100%' }}
            mode="tags"
            open={false}
            searchValue={value}
            onChange={(nextTags) => {
              if (nextTags.length < tags.length) {
                setTags(nextTags);
              }
            }}
            onSearch={(nextVal) => {
              setValue(nextVal);
            }}
            onKeyDown={(e) => {
              if (e.key === '/' || e.key === '#') {
                onTrigger(e.key);
              }
              onKeyDown(e);
            }}
            placeholder="可任意输入 / 与 # 多次获取建议"
          />
        );
      }}
    </Suggestion>
  );
};

export default Demo;
