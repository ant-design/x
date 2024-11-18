import { Bubble, Conversations, Prompts, Suggestion, Welcome } from '@ant-design/x';
import { createStyles } from 'antd-style';
import React from 'react';

import { DeleteOutlined, EditOutlined, EnterOutlined } from '@ant-design/icons';
import type { BubbleProps, ConversationsProps, PromptsProps, WelcomeProps } from '@ant-design/x';
import useLocale from '../../../../hooks/useLocale';
import { LOCALES, useCustomizationBgStyle } from '../../common/CustomizationProvider';
import CustomizationSender from '../../common/CustomizationSender';

const useStyle = createStyles(({ token, css }) => {
  return {
    actions: css`
      width: 230px;
      display: flex;
      align-items: end;
      justify-content: end;
      gap: ${token.paddingSM}px;
      opacity: 0.65;
    `,
  };
});

export const CustomizationWelcome: React.FC<WelcomeProps> = (props) => {
  const [locale] = useLocale(LOCALES);

  const {
    styles: { background },
  } = useCustomizationBgStyle();

  return (
    <Welcome
      style={{
        width: 290,
      }}
      icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*7iaeT54QpcQAAAAAAAAAAAAADgCCAQ/original"
      title={locale.greeting_short}
      description={locale.description_short}
      className={background}
      {...props}
    />
  );
};

export const CustomizationPrompts: React.FC<PromptsProps> = (props) => {
  const [locale] = useLocale(LOCALES);

  const {
    styles: { background },
  } = useCustomizationBgStyle();

  return (
    <Prompts
      styles={{
        item: {
          width: 290,
          borderRadius: 20,
        },
        list: {
          borderRadius: 20,
        },
      }}
      classNames={{
        item: background,
      }}
      items={[
        {
          key: '1',
          label: `🎉 ${locale.greeting}`,
          description: locale.description,
          children: [
            {
              key: '1-1',
              description: locale.question1,
            },
            {
              key: '1-2',
              description: locale.question4,
            },
          ],
        },
      ]}
      {...props}
    />
  );
};

export const CustomizationSuggestion: React.FC = () => {
  const [locale] = useLocale(LOCALES);

  return (
    <Suggestion
      items={[
        { label: locale.question3, value: '3' },
        { label: locale.question4, value: '4' },
      ]}
      block
      open
    >
      {({ onTrigger, onKeyDown }) => {
        return (
          <CustomizationSender
            style={{ width: 290 }}
            onChange={(nextVal) => {
              if (nextVal === '/') {
                onTrigger();
              } else if (!nextVal) {
                onTrigger(false);
              }
            }}
            onKeyDown={onKeyDown}
            value="/"
            placeholder={locale.send_placeholder}
          />
        );
      }}
    </Suggestion>
  );
};

export const CustomizationBubble: React.FC<BubbleProps> = (props) => {
  const { styles } = useStyle();
  const [locale] = useLocale(LOCALES);

  const {
    styles: { background },
  } = useCustomizationBgStyle();

  return (
    <Bubble
      content={locale.question1}
      classNames={{
        content: background,
      }}
      footer={
        <div className={styles.actions}>
          <EditOutlined />
          <DeleteOutlined />
          <EnterOutlined />
        </div>
      }
      {...props}
    />
  );
};

export const CustomConversations: React.FC<ConversationsProps> = (props) => {
  const [locale] = useLocale(LOCALES);

  return (
    <Conversations
      style={{ width: 290 }}
      activeKey="item2"
      groupable
      items={[
        {
          key: 'item1',
          group: locale.conversations_group,
          label: locale.question1,
        },
        {
          key: 'item2',
          group: locale.conversations_group,
          label: locale.question2,
        },
      ]}
      {...props}
    />
  );
};
