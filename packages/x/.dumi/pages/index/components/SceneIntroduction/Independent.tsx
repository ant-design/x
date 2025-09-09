import type { BubbleData } from '@ant-design/x';
import { Bubble, Prompts, Welcome } from '@ant-design/x';
import { DefaultChatProvider, useXChat, XRequest, XRequestOptions } from '@ant-design/x-sdk';

import { type GetProp, Tag } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import CustomizationProvider, { LOCALES } from '../../common/CustomizationProvider';
import CustomizationSender from '../../common/CustomizationSender';

interface ChatInput {
  query: string;
}

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const roles: GetProp<typeof Bubble.List, 'role'> = {
  ai: {
    placement: 'start',
    typing: { effect: 'typing', step: 5, interval: 20 },
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
        background: '#3877FF',
      },
    },
    contentRender(content: any) {
      return content?.query;
    },
  },
};

const useStyle = createStyles(({ token, css }) => {
  return {
    container: css`
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      gap: ${token.padding}px;
      height: 100%;
      padding: ${token.paddingXL}px ${token.paddingLG * 2}px;
   `,
    bubble_list: css`
      flex: 1;
    `,
    placeholder_bubble: css`
      .ant-welcome {
        padding: 0;
        margin-bottom: ${token.marginSM}px;
      }

      .ant-welcome-title {
        font-size: 16px !important;
        font-weight: 500 !important;
        opacity: 0.9;
      }

      .ant-welcome-description {
        font-size: 12px;
        opacity: 0.65;
      }

      .ant-welcome-icon {
        img {
          transform: scale(1.2);
          margin-inline-end: 10px;
        }
      }

      .ant-bubble-content {
        overflow: hidden;
        background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%) !important;
        width: 100%;
        border-radius: 16px;
        padding: 24px;
      }

      .ant-prompts-content {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      .ant-tag {
        background: linear-gradient(45deg, #ffffff33 0%, #ffffff00 100%);
        border: 1px solid #ffffff4d;
        border-radius: 4px;
        margin: 0;
        width: 18px;
        height: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .ant-prompts {
        padding: 0;
      }

      .ant-prompts-desc {
        line-height: 2 !important;
      }

      .ant-prompts-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 16px;
        border: none;
        flex: 1;
        height: 100%;
      }
    `,
  };
});

const IndependentScene: React.FC = () => {
  const { styles } = useStyle();
  const [locale] = useLocale(LOCALES);
  const [content, setContent] = React.useState('');

  const [provider] = React.useState(
    new DefaultChatProvider<string, ChatInput, string>({
      request: XRequest('https://api.example.com/chat', {
        manual: true,
        fetch: async (
          _: Parameters<typeof fetch>[0],
          options: XRequestOptions<ChatInput, string>,
        ) => {
          await sleep();
          const params = options?.params;
          return Promise.resolve(
            new Response(JSON.stringify([`Mock success return. You said: ${params?.query}`]), {
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        },
      }),
    }),
  );

  const { onRequest, messages, requesting } = useXChat({
    provider,
    requestPlaceholder: 'Waiting...',
    requestFallback: 'Mock failed return. Please try again later.',
  });

  const placeholderMessage: BubbleData = {
    role: '',
    key: 'placeholder',
    variant: 'borderless',
    className: styles.placeholder_bubble,
    content: (
      <div>
        <Welcome
          icon={
            <img
              src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
              alt="Ant Design X"
            />
          }
          title={locale.greeting}
          description={locale.description}
          variant="borderless"
        />
        <Prompts
          title={locale.help_text}
          onItemClick={(item) => {
            onRequest({
              query: item.data.description as string,
            });
          }}
          styles={{
            subItem: {
              background: 'none',
              padding: '4px 0',
            },
          }}
          items={[
            {
              key: '1',
              label: locale.hot_question,
              children: [
                {
                  key: '1-1',
                  icon: <Tag>1</Tag>,
                  description: locale.question1,
                },
                {
                  key: '1-2',
                  icon: <Tag>2</Tag>,
                  description: locale.question2,
                },
                {
                  key: '1-3',
                  icon: <Tag>3</Tag>,
                  description: locale.question3,
                },
                {
                  key: '1-4',
                  icon: <Tag>4</Tag>,
                  description: locale.question4,
                },
              ],
            },
            {
              key: '2',
              label: locale.design_guide,
              children: [
                {
                  key: '2-1',
                  icon: <Tag>1</Tag>,
                  description: locale.empathy,
                },
                {
                  key: '2-2',
                  icon: <Tag>2</Tag>,
                  description: locale.persona,
                },
                {
                  key: '2-3',
                  icon: <Tag>3</Tag>,
                  description: locale.conversation,
                },
                {
                  key: '2-4',
                  icon: <Tag>4</Tag>,
                  description: locale.interface,
                },
              ],
            },
          ]}
        />
      </div>
    ),
  };

  return (
    <CustomizationProvider>
      <div className={styles.container}>
        <Bubble.List
          className={styles.bubble_list}
          role={roles}
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
          loading={requesting}
          value={content}
          onChange={setContent}
          placeholder={locale.question1}
          onSubmit={(nextContent) => {
            if (!nextContent) return;
            onRequest({
              query: nextContent,
            });
            setContent('');
          }}
        />
      </div>
    </CustomizationProvider>
  );
};

export default IndependentScene;
