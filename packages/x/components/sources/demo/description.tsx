import { Sources } from '@ant-design/x';
import React from 'react';

const App = () => {
  const items = [
    {
      title: '1. Ant Design X',
      url: 'https://x.ant.design/components/overview',
      description:
        'Ant Design X is a component library for building AI-driven interfaces, providing conversation, prompt and content components out of the box.',
    },
    {
      title: '2. Source citation',
      url: 'https://x.ant.design/components/sources',
      description:
        'Sources shows the address of the referenced data. Each item can carry a description, whose visible length is controlled by descriptionLines.',
    },
    {
      title: '3. Retrieval augmented generation',
      url: 'https://x.ant.design/components/sources',
      description:
        'In retrieval augmented generation, the snippets returned by the retrieval step can be rendered under each source title so users can verify the answer.',
    },
  ];

  return <Sources title={'Used 3 sources'} items={items} descriptionLines={2} />;
};

export default App;
