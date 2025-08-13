import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { Actions, Bubble } from '@ant-design/x';
import { Avatar, Flex } from 'antd';
import React, { useState } from 'react';

const App = () => {
  const [editable, setEditable] = useState([
    false,
    { editing: false, okText: '确认', cancelText: <span>取消</span> },
  ]);
  const [content, setContent] = useState(['editable bubble 1', 'editable bubble 2']);

  return (
    <Flex vertical gap="small" style={{ minHeight: 200 }}>
      <Flex>
        <Bubble
          editable={editable[0]}
          content={content[0]}
          components={{
            avatar: <Avatar icon={<UserOutlined />} />,
            footer: (
              <Actions
                items={[
                  {
                    key: 'edit',
                    icon: <EditOutlined />,
                    label: 'edit',
                  },
                ]}
                onClick={({ key }) => setEditable([key === 'edit', editable[1]])}
              />
            ),
          }}
          onEditCancle={() => setEditable([false, editable[1]])}
          onEditConfirm={(val) => {
             setContent([val, content[1]]);
             setEditable([false, editable[1]])
          }}
        />
      </Flex>
      <Flex>
        <Bubble
          style={{ width: '100%' }}
          placement="end"
          editable={editable[1]}
          content={content[1]}
          components={{
            avatar: <Avatar icon={<UserOutlined />} />,
            footer: (
              <Actions
                items={[
                  {
                    key: 'edit',
                    icon: <EditOutlined />,
                    label: 'edit',
                  },
                ]}
                onClick={({ key }) =>
                  setEditable([editable[0], { ...(editable[1] as any), editing: key === 'edit' }])
                }
              />
            ),
          }}
          onEditCancle={() => setEditable([editable[0], false])}
          onEditConfirm={(val) => {
            setContent([content[0], val]);
            setEditable([editable[0], { ...(editable[1] as any), editing: false }])
          }
          }
        />
      </Flex>
    </Flex>
  );
};

export default App;
