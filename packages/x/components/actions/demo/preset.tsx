import { CheckOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Actions } from '@ant-design/x';
import type { ActionsFeedbackProps, ActionsItemProps } from '@ant-design/x';
import { message, Pagination } from 'antd';
import React, { useState } from 'react';


const App: React.FC = () => {


  // pagination
  const [curPage, setCurPage] = useState(1);
  // feedback
  const [feedbackStatus, setFeedbackStatus] = useState<ActionsFeedbackProps['value']>('default');

  // audio
  const [audioStatus, setAudioStatus] = useState<ActionsItemProps['status']>('default');
  // share
  const [shareStatus, setShareStatus] = useState<ActionsItemProps['status']>('default');


  const onClick = (type: 'share' | 'audio') => {
    let timer: NodeJS.Timeout | null = null;
    const dispatchFN = type === 'share' ? setShareStatus : setAudioStatus
    switch (shareStatus) {
      case 'default':
        dispatchFN('loading')
        timer = setTimeout(() => {
          timer && clearTimeout(timer);
          dispatchFN('running');
        }, 1500);
        break;
      case 'running':
        dispatchFN('loading');
        timer = setTimeout(() => {
          timer && clearTimeout(timer);
          dispatchFN('default')
        }, 1500);
        break;
    }
  }

  const items = [
    {
      key: 'pagination',
      actionRender: () => (
        <Pagination
          simple
          current={curPage}
          onChange={(page) => setCurPage(page)}
          total={5}
          pageSize={1}
        />
      ),
    },
    {
      key: 'feedback',
      actionRender: () => (
        <Actions.Feedback
          value={feedbackStatus}
          onChange={(val) => {
            setFeedbackStatus(val);
            message.success(`Change feedback value to: ${val}`);
          }}
          key="feedback"
        />
      ),
    },
    {
      key: 'copy',
      label: 'copy',
      actionRender: () => {
        return <Actions.Copy text='copy value' />
      }
    },
    {
      key: 'audio',
      label: 'audio',
      actionRender: () => {
        return <Actions.Audio onClick={() => onClick('audio')} status={audioStatus} />
      }
    },
    {
      key: 'share',
      label: 'share',
      actionRender: () => {
        return <Actions.Item onClick={() => onClick('share')} label={shareStatus} status={shareStatus} defaultIcon={<ShareAltOutlined />} runningIcon={<CheckOutlined />} />
      }
    },
  ];

  return <Actions items={items} />;
};

export default App;
