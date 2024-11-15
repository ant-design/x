import { Bubble, Prompts, Welcome, useXAgent, useXChat } from '@ant-design/x';
import { createStyles } from 'antd-style';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import CustomizationProvider, {
  useCustomizationBgStyle,
  LOCALES,
} from '../../common/CustomizationProvider';
import CustomizationSender from '../../common/CustomizationSender';

import { Flex, type GetProp, Tag } from 'antd';

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
      box-sizing: border-box;
      flex-direction: column;
      gap: ${token.padding}px;
      height: 100%;
      padding: ${token.paddingXL}px;
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

const IndependentScene: React.FC = () => {
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

  const placeholderMessage = {
    key: 'placeholder',
    classNames: {
      content: background,
    },
    styles: {
      content: {
        width: '100%',
        borderRadius: 16,
        padding: 24,
      },
    },
    content: (
      <Flex vertical gap={16}>
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
          title={<div style={{ fontSize: 16 }}>{locale.greeting}</div>}
          description={locale.description}
          variant="borderless"
          styles={{
            description: {
              fontSize: 14,
            },
          }}
        />
        <Prompts
          title={locale.help_text}
          className={styles.prompts}
          onItemClick={(item) => {
            onRequest(item.data.description as string);
          }}
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
              padding: 16,
              border: 'none',
              width: '50%',
            },
          }}
          items={[
            {
              key: '1',
              label: locale.hot_question,
              children: [
                {
                  key: '1-1',
                  description: (
                    <span>
                      <Tag>1</Tag>
                      {locale.question1}
                    </span>
                  ),
                },
                {
                  key: '1-2',
                  description: (
                    <span>
                      <Tag>2</Tag>
                      {locale.question2}
                    </span>
                  ),
                },
                {
                  key: '1-3',
                  description: (
                    <span>
                      <Tag>3</Tag>
                      {locale.question3}
                    </span>
                  ),
                },
                {
                  key: '1-4',
                  description: (
                    <span>
                      <Tag>4</Tag>
                      {locale.question4}
                    </span>
                  ),
                },
              ],
            },
            {
              key: '2',
              label: locale.design_guide,
              children: [
                {
                  key: '2-1',
                  description: (
                    <span>
                      <Tag>1</Tag>
                      {locale.empathy}
                    </span>
                  ),
                },
                {
                  key: '2-2',
                  description: (
                    <span>
                      <Tag>2</Tag>
                      {locale.persona}
                    </span>
                  ),
                },
                {
                  key: '2-3',
                  description: (
                    <span>
                      <Tag>3</Tag>
                      {locale.conversation}
                    </span>
                  ),
                },
                {
                  key: '2-4',
                  description: (
                    <span>
                      <Tag>4</Tag>
                      {locale.interface}
                    </span>
                  ),
                },
              ],
            },
          ]}
        />
      </Flex>
    ),
  };

  return (
    <CustomizationProvider>
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
          placeholder={locale.question1}
          onSubmit={(nextContent) => {
            if (!nextContent) return;
            onRequest(nextContent);
            setContent('');
          }}
        />
      </div>
    </CustomizationProvider>
  );
};

export default IndependentScene;
