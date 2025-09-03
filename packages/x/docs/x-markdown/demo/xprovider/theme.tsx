import { XProvider } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import HighlightCode from '@ant-design/x-markdown/plugins/HighlightCode';
import { Card, ColorPicker, Flex, Typography } from 'antd';
import React from 'react';

type ThemeData = {
  colorBgTitle: string;
};

const defaultData: ThemeData = {
  colorBgTitle: '#d9afdf',
};

const content = `
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

const Code = (props: { class: string; children: string }) => {
  const { class: className, children } = props;
  const lang = className?.replace('language-', '');
  return <HighlightCode lang={lang}>{children}</HighlightCode>;
};

export default () => {
  const [data, setData] = React.useState<ThemeData>(defaultData);

  return (
    <>
      <Flex gap={12} style={{ marginBottom: 16 }} align="center">
        <Typography.Text>ColorBgTitle:</Typography.Text>
        <ColorPicker
          value={data.colorBgTitle}
          onChange={(value) => {
            setData((origin) => ({ ...origin, colorBgTitle: value.toHexString() }));
          }}
        />
      </Flex>
      <Card>
        <XProvider
          theme={{
            token: {
              HighlightCode: data,
            },
          }}
        >
          <Flex>
            <XMarkdown
              components={{
                code: Code,
              }}
            >
              {content}
            </XMarkdown>
          </Flex>
        </XProvider>
      </Card>
    </>
  );
};
