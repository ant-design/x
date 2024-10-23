import { TagsOutlined } from '@ant-design/icons';
import { ThoughtChain, xStream } from '@ant-design/x';
import { Button, Splitter } from 'antd';
import React from 'react';

const sipHeaders = [
  'INVITE sip:[email protected] SIP/2.0\n',
  'Via: SIP/2.0/UDP [host];branch=123456\n',
  'Content-Type: application/sdp\n\n',
];

const sdp = [
  'v=0\n',
  'o=alice 2890844526 2890844526 IN IP4 [host]\n',
  's=\n',
  'c=IN IP4 [host]\n',
  't=0 0\n',
  'm=audio 49170 RTP/AVP 0\n',
  'a=rtpmap:0 PCMU/8000\n',
  'm=video 51372 RTP/AVP 31\n',
  'a=rtpmap:31 H261/90000\n',
  'm=video 53000 RTP/AVP 32\n',
  'a=rtpmap:32 MPV/90000\n\n',
];

function mockReadableStream() {
  return new ReadableStream({
    async start(controller) {
      for (const chunk of sipHeaders.concat(sdp)) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });
}

const App = () => {
  const [lines, setLines] = React.useState<string[]>([]);

  async function readStream() {
    // 🌟 Read the stream
    for await (const chunk of xStream({
      readableStream: mockReadableStream(),
      transformStream: new TransformStream<string, string>({
        transform(chunk, controller) {
          controller.enqueue(chunk);
        },
      }),
    })) {
      setLines((pre) => [...pre, chunk]);
    }
  }

  return (
    <Splitter>
      <Splitter.Panel>
        <Button type="primary" onClick={readStream} style={{ marginBottom: 16 }}>
          Mock Custom Protocol - SIP
        </Button>
      </Splitter.Panel>
      {/* -------------- Log -------------- */}
      <Splitter.Panel style={{ marginLeft: 16 }}>
        <ThoughtChain
          items={
            lines.length
              ? [
                  {
                    title: 'Mock Custom Protocol - Log',
                    status: 'success',
                    icon: <TagsOutlined />,
                    content: (
                      <pre style={{ overflow: 'scroll' }}>
                        <code>{lines.join('')}</code>
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
