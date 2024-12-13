import { Sender } from '@ant-design/x';
import { App } from 'antd';
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface CustomContentProps {
  innerValue?: string;
  onValueChange?: (newValue: string) => void;
  onSubmit?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const waveAnimation = keyframes`
  0% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1.2);
  }
  100% {
    transform: scaleY(0.5);
  }
`;

const AudioWave = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const WaveBar = styled.div<{ delay: number }>`
  background-color: white;
  width: 6px;
  height: 24px;
  border-radius: 4px;
  animation: ${waveAnimation} 1s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

const RecordingText = styled.div`
  font-size: 14px;
  color: white;
  margin-top: 8px;
  text-align: center;
`;

const CustomSpeechBox = styled.div<{ recording: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  width: 100%;
  height: 50px;
  background: linear-gradient(180deg, #f7f7f7, #e5e5e5);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  ${({ recording }) =>
    recording &&
    `
      background: linear-gradient(180deg, #d3e5ff, #b3d4ff);
  `}
`;

const SpeechContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Dots = styled.div`
  font-size: 18px;
  color: black;
  font-weight: bold;
  text-align: center;
`;

const SpeechContentText = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: black;
  font-weight: 500;
  text-align: center;
`;

const Demo: React.FC = () => {
  const { message } = App.useApp();
  const [recording, setRecording] = useState(false);
  const [value, setValue] = useState<string>('');

  return (
    <Sender
      value={value}
      components={{
        content: ({ onValueChange, onSubmit }: CustomContentProps) => (
          <CustomSpeechBox
            recording={recording}
            onClick={() => {
              if (recording) {
                message.success('录音结束');
                onValueChange?.('');
                onSubmit?.();
              } else {
                message.info('开始录音');
                onValueChange?.('录音内容...');
              }
              setRecording(!recording);
            }}
          >
            <SpeechContent>
              {recording ? (
                <div style={{ textAlign: 'center' }}>
                  <AudioWave>
                    <WaveBar delay={0} />
                    <WaveBar delay={0.2} />
                    <WaveBar delay={0.4} />
                    <WaveBar delay={0.6} />
                    <WaveBar delay={0.8} />
                  </AudioWave>
                  <RecordingText>正在听...</RecordingText>
                </div>
              ) : (
                <>
                  <Dots>· · · ·</Dots>
                  <SpeechContentText>可以开始说话了</SpeechContentText>
                </>
              )}
            </SpeechContent>
          </CustomSpeechBox>
        ),
      }}
      actions={() => null}
      onChange={setValue}
      onSubmit={() => {
        message.success('语音消息已发送！');
      }}
    />
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
