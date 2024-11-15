import { Bubble, Prompts, Welcome, useXAgent, useXChat } from '@ant-design/x';
import { createStyles } from 'antd-style';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import CustomizationProvider, {
  useCustomizationBgStyle,
  LOCALES,
} from '../../common/CustomizationProvider';
import CustomizationSender from '../../common/CustomizationSender';

import { BubbleDataType } from '@ant-design/x/es/bubble/BubbleList';
import { Flex, type GetProp, Skeleton } from 'antd';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600,
    },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  local: {
    placement: 'end',
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
};

let mockSuccess = false;

const useStyle = createStyles(({ token, css }) => {
  return {
    container: css`
      display: flex;
      padding: ${token.paddingXL}px ${token.padding}px;
      box-sizing: border-box;
      flex-direction: column;
      gap: ${token.padding}px;
      height: 100%;
      width: 350px;
      background: #0000001a;
   `,
    content: css`
      padding: ${token.paddingXL}px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: ${token.padding}px;
    `,
    bubble_list: css`
      flex: 1;
    `,
    prompts: css`
      .ant-tag {
        background: linear-gradient(45deg, #ffffff33 0%, #ffffff00 100%);
        border: 1px solid #ffffff4d;
        border-radius: 4px;
      }
    `,
  };
});

const AssistantScene: React.FC = () => {
  const { styles } = useStyle();
  const [locale] = useLocale(LOCALES);

  const {
    styles: { background },
  } = useCustomizationBgStyle();

  const [content, setContent] = React.useState('');

  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onError }) => {
      await sleep();

      mockSuccess = !mockSuccess;

      if (mockSuccess) {
        onSuccess(`Mock success return. You said: ${message}`);
      }

      onError(new Error('Mock request failed'));
    },
  });

  // Chat messages
  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: 'Waiting...',
    requestFallback: 'Mock failed return. Please try again later.',
  });

  const placeholderMessage: BubbleDataType = {
    key: 'placeholder',
    variant: 'borderless',
    content: (
      <Welcome
        icon={
          <img
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*7iaeT54QpcQAAAAAAAAAAAAADgCCAQ/original"
            alt="Ant Design X"
            style={{
              transform: 'scale(1.2)',
              marginInlineEnd: 10,
            }}
          />
        }
        className={background}
        title={<div style={{ fontSize: 16 }}>{locale.greeting_short}</div>}
        description={locale.description_short}
        styles={{
          description: {
            fontSize: 14,
          },
        }}
      />
    ),
    footer: (
      <Prompts
        title={locale.help_text}
        className={styles.prompts}
        onItemClick={(item) => {
          onRequest(item.data.description as string);
        }}
        vertical
        styles={{
          subItem: {
            background: 'none',
            padding: '4px 0',
          },
          list: {
            width: '100%',
          },
          item: {
            background: 'rgba(255, 255, 255, 0.05)',
          },
        }}
        items={[
          {
            key: '1-1',
            description: locale.question1,
          },
          {
            key: '1-2',
            description: locale.question2,
          },
          {
            key: '1-3',
            description: locale.question3,
          },
          {
            key: '1-4',
            description: locale.question4,
          },
        ]}
      />
    ),
  };

  return (
    <CustomizationProvider>
      <Flex justify="space-between" style={{ height: '100%' }}>
        <div className={styles.content}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
        <div className={styles.container}>
          <Bubble.List
            className={styles.bubble_list}
            roles={roles}
            items={[
              placeholderMessage,
              ...messages.map(({ id, message, status }) => ({
                key: id,
                loading: status === 'loading',
                role: status === 'local' ? 'local' : 'ai',
                content: message,
              })),
            ]}
          />
          <CustomizationSender
            loading={agent.isRequesting()}
            value={content}
            onChange={setContent}
            placeholder={locale.send_placeholder}
            onSubmit={(nextContent) => {
              if (!nextContent) return;
              onRequest(nextContent);
              setContent('');
            }}
          />
        </div>
      </Flex>
    </CustomizationProvider>
  );
};

export default AssistantScene;
