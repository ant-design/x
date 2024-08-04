import React from 'react';
import { Prompts } from '@ant-design/x';
import type { PromptsProps } from '@ant-design/x';

const data: PromptsProps['data'] = [
  {
    key: '1',
    label: 'prompt 1',
  },
  {
    key: '2',
    label: 'prompt 2',
  },
];

const App = () => <Prompts data={data} />;

export default App;
