import { Bubble } from '@ant-design/x';
import { App, Button, Flex, type GetProps, type GetRef, Select } from 'antd';
import React from 'react';

type BubbleListItems = Required<GetProps<typeof Bubble.List>>['items'];

const Demo = () => {
  const { message } = App.useApp();

  const [bubbleList, setBubbleList] = React.useState<BubbleListItems>([
    {
      id: '0',
      key: '0',
      content: `#0 - message content`,
      typing: true,
    },
  ]);

  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);

  // add a new bubble to the beginning of the list
  function unshiftBubble() {
    const firstId = bubbleList[0]?.id;

    const id = `${firstId !== undefined ? Number(firstId) - 1 : 0}`;

    setBubbleList((preList) => [
      {
        id,
        key: id,
        content: `#${id} - message content`,
      },
      ...preList,
    ]);

    message.success(`#${id} message rendered!`);
  }

  // add a new bubble to the end of the list
  function pushBubble() {
    const lastId = bubbleList[bubbleList.length - 1]?.id;

    const id = `${lastId !== undefined ? Number(lastId) + 1 : 0}`;

    setBubbleList((preList) => [
      ...preList,
      {
        id,
        key: id,
        content: `#${id} - message content`,
        typing: true,
      },
    ]);

    message.success(`#${id} message rendered!`);
  }

  // remove a bubble from the list
  function deleteBubble(id: string) {
    setBubbleList((preList) => preList.filter((item) => item.id !== id));

    message.success(`#${id} message deleted!`);
  }

  function scrollTo(id: number) {
    listRef.current?.scrollTo?.({ key: id, block: 'nearest' });

    message.success(`scroll to #${id} message!`);
  }

  const selectOptions = React.useMemo(
    () =>
      bubbleList.map((item) => ({
        value: item.id,
        label: item.content,
      })),
    [bubbleList],
  );

  return (
    <Flex vertical gap={16}>
      <Flex gap={16}>
        <Button onClick={unshiftBubble}>unshift bubble</Button>
        <Button onClick={pushBubble}>push bubble</Button>
        <Select
          placeholder="delete bubble"
          style={{ width: 200 }}
          onChange={deleteBubble}
          options={selectOptions}
        />
        <Select
          placeholder="scroll to"
          style={{ width: 200 }}
          onChange={scrollTo}
          options={selectOptions}
        />
      </Flex>
      <Bubble.List style={{ height: 300, overflow: 'auto' }} items={bubbleList} ref={listRef} />
    </Flex>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
