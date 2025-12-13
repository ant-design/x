import { Bubble, CodeHighlighter } from '@ant-design/x';
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import { Button, Flex } from 'antd';
import React from 'react';

const text = `
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

const Code: React.FC<ComponentProps> = (props) => {
  const { className, children } = props;
  const lang = className?.match(/language-(\w+)/)?.[1] || '';

  if (typeof children !== 'string') return null;
  return <CodeHighlighter lang={lang}>{children}</CodeHighlighter>;
};

const App = () => {
  const [index, setIndex] = React.useState(0);
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (index >= text.length) return;

    timer.current = setTimeout(() => {
      setIndex(Math.min(index + 5, text.length));
    }, 20);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [index]);

  React.useEffect(() => {
    if (contentRef.current && index > 0 && index < text.length) {
      const { scrollHeight, clientHeight } = contentRef.current;
      if (scrollHeight > clientHeight) {
        contentRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [index]);

  return (
    <Flex vertical gap="small" style={{ height: 600, overflow: 'auto' }} ref={contentRef}>
      <Flex justify="flex-end">
        <Button onClick={() => setIndex(0)}>Re-Render</Button>
      </Flex>

      <Bubble
        content={text.slice(0, index)}
        contentRender={(content) => (
          <XMarkdown components={{ code: Code }} paragraphTag="div">
            {content}
          </XMarkdown>
        )}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
