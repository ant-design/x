import { theme } from 'antd';
import React from 'react';

const splitIntoChunks = (str: string, chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
};

export const mockFetch = async (fullContent: string) => {
  const chunks = splitIntoChunks(fullContent, 2);
  const response = new Response(
    new ReadableStream({
      async start(controller) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));
          for (const chunk of chunks) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            if (!controller.desiredSize) {
              // 流已满或关闭，避免写入
              return;
            }

            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (error) {
          console.log(error);
        }
      },
    }),
    {
      headers: {
        'Content-Type': 'application/x-ndjson',
      },
    },
  );

  return response;
};

export const useMarkdownTheme = () => {
  const { token } = theme.useToken();

  // 使用 Ant Design 的主题系统判断亮色还是暗色
  const isDarkMode = React.useMemo(() => {
    // 通过 token 的颜色模式判断
    return (
      token.colorBgBase === '#000' ||
      token.colorBgBase === '#141414' ||
      token.colorBgBase === '#1f1f1f'
    );
  }, [token]);

  const className = React.useMemo(() => {
    return isDarkMode ? 'x-markdown-dark' : 'x-markdown-light';
  }, [isDarkMode]);

  return [className];
};
