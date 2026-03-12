import { Bubble } from '@ant-design/x';
import { version, type XAgentCommand_v0_9, XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import React, { useEffect, useState } from 'react';

const contentHeader =
  '哈喽～ 欢迎进店呀✨ \n\n 不管是想喝醇厚的热美式、绵密的拿铁，还是清爽解腻的冰滴，每一款都是现磨现做，选你喜欢的口感，我帮你快速安排，喝到一口直达心底的治愈感～';
const text2 = '请选择菜单上需要的项目 🙏';
type TextNode = { text: string; timestamp: number };
type CardNode = { timestamp: number; id: string };
type ContentType = {
  texts: TextNode[];
  card: CardNode[];
};
const role = {
  assistant: {
    contentRender: (content: ContentType) => {
      const contentList = [...content.texts, ...content.card].sort(
        (a, b) => a.timestamp - b.timestamp,
      );
      return contentList.map((node, index) => {
        if ('text' in node && node.text) {
          return <XMarkdown key={index}>{node.text}</XMarkdown>;
        }
        if ('id' in node && node.id) {
          return <XCard.Card key={index} id={node.id} />;
        }
        return null;
      });
    },
  },
};
const Text = () => {
  return <div>text</div>;
};
const List = () => {
  return <div>list</div>;
};

const useStreamText = (text: string) => {
  const textRef = React.useRef(0);
  const [textIndex, setTextIndex] = React.useState(textRef.current);
  const textTimestamp = React.useRef(0);
  const [streamStatus, setStreamStatus] = useState('INIT');
  const run = () => {
    const timer = setInterval(() => {
      if (textRef.current < text.length) {
        if (textTimestamp.current === 0) {
          textTimestamp.current = Date.now();
          setStreamStatus('RUNNING');
        }
        textRef.current = Math.min(textRef.current + 3, text.length);

        setTextIndex(textRef.current);
      } else {
        setStreamStatus('FINISHED');
        clearInterval(timer);
      }
    }, 100);
  };
  return { text: text.slice(0, textIndex), streamStatus, timestamp: textTimestamp.current, run };
};

const CreateCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'booking',
    catalogId: 'https://a2ui.org/specification/v0_9/basic_catalog.json',
  },
};
const UpdateCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'booking',
    components: [
      {
        id: 'title',
        component: 'Text',
        text: 'Book Your Table',
        variant: 'h1',
      },
      {
        id: 'datetime',
        component: 'DateTimeInput',
        value: { path: '/booking/date' },
        enableDate: true,
      },
      {
        id: 'submit-text',
        component: 'Text',
        text: 'Confirm',
      },
      {
        id: 'submit-btn',
        component: 'Button',
        child: 'submit-text',
        variant: 'primary',
        action: {
          event: { name: 'confirm_booking' },
        },
      },
    ],
  },
};
const UpdateModel: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateDataModel: {
    surfaceId: 'booking',
    path: '/booking',
    value: {
      date: '2025-12-16T19:00:00Z',
    },
  },
};

const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
  const [commands, setCommands] = useState<XAgentCommand_v0_9>();
  const onAgentCommand = (command: XAgentCommand_v0_9) => {
    if ('createSurface' in command) {
      setCard([
        {
          id: 'booking',
          timestamp: Date.now(),
        },
      ]);
    } else {
      setCommands(command);
    }
  };

  const {
    text: textHeader,
    streamStatus: streamStatusHeader,
    timestamp: timestampHeader,
    run: runHeader,
  } = useStreamText(contentHeader);
  const { text: textFooter, timestamp: timestampFooter, run: runFooter } = useStreamText(text2);

  useEffect(() => {
    runHeader();
  }, []);

  useEffect(() => {
    if (streamStatusHeader === 'FINISHED') {
      onAgentCommand(CreateCard);
      onAgentCommand(UpdateCard);
      runFooter();
    }
  }, [streamStatusHeader]);

  const items = [
    {
      content: {
        texts: [
          { text: textHeader, timestamp: timestampHeader },
          { text: textFooter, timestamp: timestampFooter },
        ].filter((item) => item.timestamp !== 0),
        card,
      } as ContentType,
      role: 'assistant',
      key: '1',
    },
  ];
  return (
    <div>
      {version}
      {/* <Button
      onClick={triggerTextFlow}
    >
      重新触发
    </Button> */}
      <XCard.Box
        commands={commands}
        components={{
          Text,
          List,
        }}
      >
        <Bubble.List items={items} style={{ height: 620 }} role={role} />
      </XCard.Box>
    </div>
  );
};
export default App;
