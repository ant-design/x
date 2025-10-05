import { AntDesignOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Sender, type SenderProps } from '@ant-design/x';
import tokenData from '@ant-design/x/es/version/token.json';
import { Button, Flex, GetRef } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import useLocale from '../../../../../hooks/useLocale';

const locales = {
  cn: {
    function: '功能',
    components: '组件',
    placeholder: '可以问我关于 Ant Design X 的任何问题',
    functionPromptPlaceholder: '请选择一个您想了解功能',
    functionPrompt_1: '请介绍',
    functionPrompt_2: '相关的功能以及写出简单的示例',
    componentsPromptPlaceholder: '请选择一个您想了解的组件',
    componentsPrompt_1: '请介绍Ant Design X 中的',
    componentsPrompt_2: '组件，相关的功能以及写出简单的示例',
  },
  en: {
    function: 'Function',
    components: 'Components',
    placeholder: 'You can ask me anything about Ant Design X',
    functionPromptPlaceholder: 'Please select a function you want to know about',
    functionPrompt_1: 'Please introduce',
    functionPrompt_2: 'the related function and provide a simple example',
    componentsPromptPlaceholder: 'Please select a component you want to know about',
    componentsPrompt_1: 'Please introduce ',
    componentsPrompt_2:
      'component in Ant Design X, its related functions and provide a simple example',
  },
};

export const useStyle = createStyles(({ css, token }) => {
  return {
    sender: css`
      box-sizing:border-box;
      background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%);
      position: relative;
      border: none;
      cursor: pointer;
      border-color:rgba(255,255,255,.1)!important;
      transition: all ${token.motionDurationMid} ${token.motionEaseInOut};
      :hover, :active,:focus-within {
        opacity: 0.85;
        border-color:rgba(255,255,255,.5)!important;
        box-shadow: 0 4px 12px 0 #bfcded33!important;
      }
      .ant-sender-input{
        caret-color:#fff!important;
      }
    `,
  };
});

const CustomizationSender: React.FC<{
  onSubmit: (text: string) => void;
  loading?: boolean;
  abort?: () => void;
  ref: React.Ref<any>;
}> = ({ onSubmit, loading, ref, abort }) => {
  const { styles } = useStyle();
  const [locale] = useLocale(locales);
  const [mergeLoading, setMergeLoading] = useState(false);
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const [activeKey, setActiveKey] = useState('text');
  const [value, setValue] = useState('');
  const options = Object.keys(tokenData) || [];
  options.push('Notification', 'XProvider');

  const SlotInfo: {
    key: string;
    icon: React.ReactNode;
    slotConfig: SenderProps['initialSlotConfig'];
  }[] = [
    {
      icon: <AppstoreOutlined />,
      key: 'function',
      slotConfig: [
        { type: 'text', value: locale.functionPrompt_1 },
        {
          type: 'select',
          key: 'search_function',
          props: {
            defaultValue: 'X-SDK',
            options: ['X-SDK', 'X-Markdown', 'X组件'],
            placeholder: locale.functionPromptPlaceholder,
          },
        },
        { type: 'text', value: locale.functionPrompt_2 },
      ],
    },
    {
      key: 'components',
      icon: <AntDesignOutlined />,
      slotConfig: [
        { type: 'text', value: locale.componentsPrompt_1 },
        {
          type: 'select',
          key: 'components',
          props: {
            options,
            defaultValue: 'Sender',
            placeholder: locale.componentsPromptPlaceholder,
          },
        },
        { type: 'text', value: locale.componentsPrompt_2 },
      ],
    },
  ];

  useImperativeHandle(ref, () => {
    return {
      setPrompt: (text: string) => {
        setActiveKey('text');
        setValue(text);
      },
    };
  });

  useEffect(() => {
    if (loading !== undefined) {
      setMergeLoading(loading);
    }
  }, [loading]);
  useEffect(() => {
    senderRef.current!.focus({
      cursor: 'end',
    });
  }, [activeKey, senderRef.current]);

  const onClick = (key: string) => {
    setActiveKey(key);
  };

  const onSubmitFn = (value: string) => {
    if (!mergeLoading) {
      setMergeLoading(true);
      onSubmit(value);
      setActiveKey('');
      setValue('');
      senderRef.current?.clear?.();
    }
  };
  return (
    <Sender
      ref={senderRef}
      value={value}
      onChange={(val) => {
        if (activeKey === 'text') {
          setValue(val);
        }
      }}
      placeholder={locale.placeholder}
      loading={mergeLoading}
      className={styles.sender}
      onCancel={abort}
      key={activeKey}
      styles={{
        input: {
          fontSize: 15,
        },
      }}
      autoSize={{ minRows: 2, maxRows: 2 }}
      onSubmit={onSubmitFn}
      initialSlotConfig={SlotInfo.find(({ key }) => key === activeKey)?.slotConfig}
      suffix={false}
      footer={(_, info) => {
        const { LoadingButton } = info.components;
        return (
          <Flex justify="space-between" align="center">
            <Flex gap="small">
              {SlotInfo.map(({ key, icon }) => (
                <Sender.Switch
                  key={key}
                  value={activeKey === key}
                  checkedChildren={locale?.[key as keyof typeof locale]}
                  unCheckedChildren={locale?.[key as keyof typeof locale]}
                  onChange={(checked: boolean) => {
                    if (checked) {
                      onClick(key);
                    } else {
                      onClick('');
                    }
                  }}
                  icon={icon}
                />
              ))}
            </Flex>
            {mergeLoading ? (
              <LoadingButton />
            ) : (
              <Button
                type="text"
                style={{ padding: 0 }}
                onClick={() => {
                  const { value } = senderRef?.current?.getValue?.() || {};
                  if (value) {
                    onSubmitFn(value);
                  }
                }}
                icon={
                  <img
                    alt="send"
                    loading="lazy"
                    src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4e5sTY9lU3sAAAAAAAAAAAAADgCCAQ/original"
                  />
                }
              />
            )}
          </Flex>
        );
      }}
    />
  );
};

export default CustomizationSender;
