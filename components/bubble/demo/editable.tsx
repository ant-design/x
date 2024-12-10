import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Button, Flex } from 'antd';
import React from 'react';
import { EditConfig } from '../interface';

const fooAvatar: React.CSSProperties = {
  color: '#f56a00',
  backgroundColor: '#fde3cf',
};

const barAvatar: React.CSSProperties = {
  color: '#fff',
  backgroundColor: '#87d068',
};

const hideAvatar: React.CSSProperties = {
  visibility: 'hidden',
};

const App = () => {
  const [editing, setEditing] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [editHistory, setEditHistory] = React.useState(['Good morning, how are you?']); // 编辑历史记录

  const triggerEdit = () => {
    setEditing((prev) => !prev);
  };

  const handleLeftClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRightClick = () => {
    if (currentIndex < editHistory.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const endEdit = (c: string) => {
    setEditing(false);
    setEditHistory((prev) => [...prev, c]);
    setCurrentIndex(editHistory.length);
  };

  const editConfig: EditConfig = {
    editing,
    onCancel: cancelEdit,
    onEnd: endEdit,
    editorTextAreaConfig: { autoSize: { minRows: 2, maxRows: 4 } },
    editorButtonConfig: [
      {
        type: 'cancel',
        text: 'Cancel',
        option: { size: 'small' },
      },
      {
        type: 'save',
        text: 'Save',
        option: { size: 'small', type: 'primary' },
      },
    ],
  };

  return (
    <Flex gap="middle" vertical>
      <Bubble
        placement="end"
        content={editHistory[currentIndex]}
        editable={editConfig}
        avatar={{ icon: <UserOutlined />, style: barAvatar }}
        header={
          editHistory.length > 1 &&
          !editing && (
            <Flex justify="end">
              <Button
                size="small"
                type="text"
                icon={<LeftOutlined />}
                onClick={handleLeftClick}
                disabled={currentIndex === 0}
              />
              <span>{`${currentIndex + 1} / ${editHistory.length}`}</span>
              <Button
                size="small"
                type="text"
                icon={<RightOutlined />}
                onClick={handleRightClick}
                disabled={currentIndex === editHistory.length - 1}
              />
            </Flex>
          )
        }
        footer={
          <Flex justify="end">
            <Button size="small" type="text" icon={<DeleteOutlined />} />
            <Button size="small" type="text" icon={<EditOutlined />} onClick={triggerEdit} />
          </Flex>
        }
      />
      <Bubble
        placement="start"
        content="Hi, good morning, I'm fine!"
        avatar={{ icon: <UserOutlined />, style: fooAvatar }}
      />
      <Bubble
        placement="start"
        content="What a beautiful day!"
        styles={{ avatar: hideAvatar }}
        avatar={{}}
      />
    </Flex>
  );
};

export default App;
