import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender } from '@ant-design/x';
import { BubbleListProps } from '@ant-design/x/es/bubble';
import XMarkdown from '@ant-design/x-markdown';
import HighlightCode from '@ant-design/x-markdown/plugins/HighlightCode';
import { DefaultChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import React, { useMemo } from 'react';
import { mockFetch } from '../../_utils';

interface ChatInput {
  query: string;
}

const fullContent = `
Here's a Python code block example that demonstrates how to calculate Fibonacci numbers:

\`\`\` python
def fibonacci(n):
    """
    Calculate the nth Fibonacci number
    :param n: The position in the Fibonacci sequence (must be a positive integer)
    :return: The value at position n
    """
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        a, b = 0, 1
        for _ in range(2, n+1):
            a, b = b, a + b
        return b

# Example usage
if __name__ == "__main__":
    num = 10
    print(f"The {num}th Fibonacci number is: {fibonacci(num)}")
    
    # Print the first 15 Fibonacci numbers
    print("First 15 Fibonacci numbers:")
    for i in range(1, 16):
        print(fibonacci(i), end=" ")
\`\`\`

This code includes:

1. A function to compute Fibonacci numbers
2. Docstring documentation
3. Example usage in the main block
4. A loop to print the first 15 numbers

You can modify the parameters or output format as needed. The Fibonacci sequence here starts with fib(1) = 1, fib(2) = 1.
`;

const roles: BubbleListProps['role'] = {
  ai: {
    placement: 'start',
    components: {
      avatar: <UserOutlined />,
    },
  },
  local: {
    placement: 'end',
    components: {
      avatar: <UserOutlined />,
    },
  },
};

const Code = (props: { class: string; children: string }) => {
  const { class: className, children } = props;
  const lang = className?.replace('language-', '');
  return <HighlightCode lang={lang}>{children}</HighlightCode>;
};

const App = () => {
  const [content, setContent] = React.useState('');
  let chunks = '';
  const provider = useMemo(
    () =>
      new DefaultChatProvider<string, ChatInput, string>({
        request: XRequest('https://api.example.com/chat', {
          manual: true,
          fetch: () => mockFetch(fullContent),
          transformStream: new TransformStream<string, string>({
            transform(chunk, controller) {
              chunks = `${chunks}${chunk}`.replace(
                /<think.*?>([\s\S]*?)<\/think>/gi,
                (match, content) => {
                  try {
                    return `<think status="done">${content}</think>`;
                  } catch (error) {
                    console.error(error);
                    return match;
                  }
                },
              );
              controller.enqueue(chunks);
            },
          }),
        }),
      }),
    [content],
  );

  const { onRequest, messages, isRequesting } = useXChat({
    provider: provider,
    requestPlaceholder: 'Waiting...',
    requestFallback: 'Mock failed return. Please try again later.',
  });

  return (
    <div
      style={{
        height: 400,
        paddingBlock: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Bubble.List
        role={roles}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: status === 'local' ? 'local' : 'ai',
          content: message,
          contentRender:
            status === 'local'
              ? (content) => content.query
              : (content) => (
                  <XMarkdown
                    content={content as string}
                    components={{
                      code: Code,
                    }}
                  />
                ),
        }))}
      />
      <Sender
        loading={isRequesting()}
        value={content}
        onChange={setContent}
        style={{ marginTop: 48 }}
        onSubmit={(nextContent) => {
          onRequest({
            query: nextContent,
          });
          setContent('');
        }}
      />
    </div>
  );
};

export default App;
