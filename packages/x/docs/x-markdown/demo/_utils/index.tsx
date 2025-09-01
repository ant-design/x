const splitIntoChunks = (str: string, chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
};

export const mockFetch = async (fullContent: string) => {
  const chunks = splitIntoChunks(fullContent, 10);
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
