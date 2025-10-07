import { createStyles } from 'antd-style';
import classnames from 'classnames';
import React, { useContext, useRef } from 'react';
import Context from '../../../../../theme/layouts/IndexLayout/Context';
import Agent from './Agent';
import Prompt from './Prompt';
import Provider from './Provider';
import StartPage from './StartPage';

const useStyle = createStyles(({ token, css }) => {
  return {
    container: css`
      display: flex;
      justify-content: space-around;
      box-sizing: border-box;
       align-items:center;
      flex-direction: column;
      height: 100%;
      width: 100%;
      z-index:1;
      min-width: 500px;
   `,
    startPage: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items:center;
    max-width: 1000px;
    padding-inline: ${token.paddingXL * 2}px;
   `,
    agentPage: css`
   height: 100%;
   width: 100%;
   `,
  };
});

const PortalScene: React.FC = () => {
  const { styles } = useStyle();
  const { setIsOnAgent, isOnAgent } = useContext(Context);
  const agentRef = useRef<{
    senderRef: any;
  }>(null);
  const onPromptClick = ({ data }: { data: any }) => {
    agentRef?.current?.senderRef.setPrompt?.(data.description as string);
  };
  console.log(isOnAgent, 'isOnAgent');

  return (
    <Provider>
      <div className={styles.container}>
        <div
          className={classnames({ [styles.startPage]: !isOnAgent, [styles.agentPage]: isOnAgent })}
        >
          {!isOnAgent && <StartPage />}
          <Agent isOnAgent={isOnAgent} setIsOnAgent={setIsOnAgent} ref={agentRef} />
          {!isOnAgent && <Prompt onClick={onPromptClick} />}
        </div>
      </div>
    </Provider>
  );
};

export default PortalScene;
