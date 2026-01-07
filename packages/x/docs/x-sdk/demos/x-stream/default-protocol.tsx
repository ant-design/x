import { TagsOutlined } from '@ant-design/icons';
import { Bubble, ThoughtChain } from '@ant-design/x';
import { XStream } from '@ant-design/x-sdk';
import { Button, Flex, Radio, Splitter } from 'antd';
import React from 'react';

const contentChunks = ['Hello', ' ', 'I', ' ', 'am', ' ', 'Ant', ' ', 'Design', ' ', 'X', '!'];
function createRealisticStream(partSeparator: string, streamSeparator: string) {
  let index = 0;

  return new ReadableStream({
    async pull(controller) {
      if (index >= contentChunks.length) {
        controller.close();
        return;
      }

      // 随机延迟模拟网络延迟
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 100 + 50));

      const chunk = contentChunks[index];
      const sseData = `event:message${partSeparator}data:{"id":"${index}","content":"${chunk}"}${streamSeparator}`;

      controller.enqueue(new TextEncoder().encode(sseData));
      index++;
    },
  });
}

// 保持向后兼容
function mockReadableStream(partSeparator: string, streamSeparator: string) {
  return createRealisticStream(partSeparator, streamSeparator);
}

const App = () => {
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);
  const content = lines.map((line) => JSON.parse(line?.data || '{}').content).join('');
  const [partSeparator, setPartSeparator] = React.useState('\n');
  const [streamSeparator, setStreamSeparator] = React.useState('\n\n');
  async function readStream() {
    setLines([]);
    for await (const chunk of XStream({
      readableStream: mockReadableStream(partSeparator, streamSeparator),
      partSeparator,
      streamSeparator,
    })) {
      setLines((pre) => [...pre, chunk]);
    }
  }
  return (
    <Splitter>
      <Splitter.Panel>
        <Flex vertical gap="small">
          <Flex gap="small">
            partSeparator:
            <Radio.Group
              value={partSeparator}
              onChange={(e) => setPartSeparator(e.target.value)}
              options={[
                { value: '\n', label: '\\n (default)' },
                { value: '\r\n', label: '\\r\\n' },
              ]}
            />
          </Flex>
          <Flex gap="small">
            streamSeparator:
            <Radio.Group
              value={streamSeparator}
              onChange={(e) => setStreamSeparator(e.target.value)}
              options={[
                { value: '\n\n', label: '\\n\\n (default)' },
                { value: '\r\n', label: '\\r\\n' },
              ]}
            />
          </Flex>

          {/* -------------- Emit -------------- */}
          <Button type="primary" onClick={readStream} style={{ marginBottom: 16 }}>
            Mock Default Protocol - SSE
          </Button>
        </Flex>
        lines: {JSON.stringify(lines)}
        {/* -------------- Content Concat -------------- */}
        content: {content ? <Bubble content={content} /> : 'no content'}
      </Splitter.Panel>
      {/* -------------- Log -------------- */}
      <Splitter.Panel style={{ marginLeft: 16 }}>
        <ThoughtChain
          items={
            lines.length
              ? [
                  {
                    title: 'Mock Default Protocol - Log',
                    status: 'success',
                    icon: <TagsOutlined />,
                    content: (
                      <pre style={{ overflow: 'scroll' }}>
                        {lines.map((i) => (
                          <code key={i.data}>{i.data}</code>
                        ))}
                      </pre>
                    ),
                  },
                ]
              : []
          }
        />
      </Splitter.Panel>
    </Splitter>
  );
};

export default App;
