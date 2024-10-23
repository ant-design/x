import { TagsOutlined } from '@ant-design/icons';
import { Bubble, ThoughtChain, xStream } from '@ant-design/x';
import { Button, Splitter } from 'antd';
import React from 'react';

const contentChunks = ['He', 'llo', ', w', 'or', 'ld!'];

function mockReadableStream() {
  const sseChunks: string[] = [];

  for (let i = 0; i < contentChunks.length; i++) {
    const sseEventPart = `event: message\ndata: {"id":"${i}","content":"${contentChunks[i]}"}\n\n`;
    sseChunks.push(sseEventPart);
  }

  return new ReadableStream({
    async start(controller) {
      for (const chunk of sseChunks) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });
}

const App = () => {
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);
  const content = lines.map((line) => JSON.parse(line.data).content).join('');

  async function readStream() {
    // 🌟 Read the stream
    for await (const chunk of xStream({
      readableStream: mockReadableStream(),
    })) {
      console.log(chunk);
      setLines((pre) => [...pre, chunk]);
    }
  }

  return (
    <Splitter>
      <Splitter.Panel>
        {/* -------------- Emit -------------- */}
        <Button type="primary" onClick={readStream} style={{ marginBottom: 16 }}>
          Mock Default Protocol - SSE
        </Button>
        {/* -------------- Content Concat -------------- */}
        {content && <Bubble content={content} />}
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
