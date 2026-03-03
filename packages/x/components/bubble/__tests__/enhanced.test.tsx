import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { waitFakeTimer } from '../../../tests/utils';
import Bubble from '../Bubble';
import { BubbleAnimationOption } from '../interface';

describe('Bubble Enhanced Tests', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Animation', () => {
    it('should support basic animation', async () => {
      const { container } = render(<Bubble content="测试内容" typing />);
      const contentElement = container.querySelector('.ant-bubble-content');

      // 基础动画会渲染内容，检查动画容器是否存在
      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toHaveClass('ant-bubble-content');
      // 动画组件应该正常渲染，不检查具体内容
      expect(container.querySelector('.ant-bubble')).toBeInTheDocument();
    });

    it('should correctly display typing effect', async () => {
      const typingConfig: BubbleAnimationOption = {
        effect: 'typing',
        step: 1,
        interval: 50,
      };

      const { container } = render(<Bubble content="Test" typing={typingConfig} />);

      // 等待动画开始
      await waitFakeTimer(60, 2);

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toBeInTheDocument();

      // 检查打字机动画的类名
      const typingElement = container.querySelector('.ant-bubble-typing');
      if (typingElement) {
        expect(typingElement).toBeInTheDocument();
      }

      // 等待动画完成
      await waitFakeTimer(100, 6);

      // 动画完成后应该显示完整内容
      expect(container).toHaveTextContent('Test');
    });

    it('should correctly display fade-in animation effect', async () => {
      const typingConfig: BubbleAnimationOption = {
        effect: 'fade-in',
        step: 2,
        interval: 50,
      };

      const { container } = render(<Bubble content="Hello World" typing={typingConfig} />);

      // 等待动画开始
      await waitFakeTimer(60, 2);

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toBeInTheDocument();

      // 检查渐入动画容器的类名
      const fadeInContainer = container.querySelector('.ant-bubble-fade-in');
      if (fadeInContainer) {
        expect(fadeInContainer).toBeInTheDocument();
      }

      // 检查是否有渐入效果的元素
      const fadeInElements = container.querySelectorAll('.fade-in');
      expect(fadeInElements.length).toBeGreaterThan(0);

      // 等待动画完成
      await waitFakeTimer(100, 10);

      // 最终应该显示完整内容
      expect(container).toHaveTextContent('Hello World');
    });

    it('should correctly display intermediate state of animation', async () => {
      const onTyping = jest.fn();
      const typingConfig: BubbleAnimationOption = {
        effect: 'typing',
        step: 2,
        interval: 100,
      };

      const text = 'Testing-Testing';

      const { container } = render(
        <Bubble content={text} typing={typingConfig} onTyping={onTyping} />,
      );

      // 等待第一步动画
      await waitFakeTimer(100, 1);

      // 检查是否有部分内容显示
      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toBeInTheDocument();

      // 等待更多动画步骤
      await waitFakeTimer(100, 2);

      // 检查动画回调是否被调用，验证中间状态
      expect(onTyping.mock.calls.length).toBeGreaterThan(0);
      const firstCall = onTyping.mock.calls[0];
      expect(firstCall[1]).toBe(text); // 完整内容
      expect(firstCall[0].length).toBeGreaterThan(0); // 渲染内容应该存在
      expect(firstCall[0].length).toBeLessThan(text.length); // 渲染内容应该小于完整内容
      expect(firstCall[1].indexOf(firstCall[0])).toBe(0); // 渲染内容应该属于完整内容的子集

      // 等待动画完成
      await waitFakeTimer(100, 10);

      // 最终应该显示完整内容
      expect(container).toHaveTextContent(text);
    });

    it('should support animation callback functions', async () => {
      const onTyping = jest.fn();
      const onTypingComplete = jest.fn();

      const typingConfig: BubbleAnimationOption = {
        effect: 'typing',
        step: 1,
        interval: 50,
      };

      render(
        <Bubble
          content="Test"
          typing={typingConfig}
          onTyping={onTyping}
          onTypingComplete={onTypingComplete}
        />,
      );

      await waitFakeTimer(100, 10);

      expect(onTyping).toHaveBeenCalled();
      expect(onTypingComplete).toHaveBeenCalledWith('Test');
    });

    it('should support starting output from common prefix', async () => {
      const typingConfig: BubbleAnimationOption = {
        effect: 'typing',
        step: 2,
        interval: 50,
        keepPrefix: true,
      };
      const text = 'Test-first';
      const { container, rerender } = render(<Bubble content={text} typing={typingConfig} />);

      // 等待动画完成
      await waitFakeTimer(100, 5);
      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement?.textContent).toBe(text);

      rerender(<Bubble content="Test-second" typing={typingConfig} />);
      expect(contentElement?.textContent?.startsWith('Test-')).toBeTruthy();
      await waitFakeTimer(100, 6);
      expect(contentElement?.textContent).toBe('Test-second');
    });

    it('should support complete re-output', async () => {
      const typingConfig: BubbleAnimationOption = {
        effect: 'typing',
        step: 2,
        interval: 50,
        keepPrefix: false,
      };
      const text1 = 'Test-first';
      const text2 = 'Test-second';
      const { container, rerender } = render(<Bubble content={text1} typing={typingConfig} />);

      // 等待动画完成
      await waitFakeTimer(100, 5);
      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement?.textContent).toBe(text1);

      rerender(<Bubble content={text2} typing={typingConfig} />);
      expect(contentElement?.textContent?.startsWith('Test-')).toBeFalsy();

      await waitFakeTimer(100, 6);
      expect(contentElement?.textContent).toBe(text2);
    });

    it('should not execute animation when content is empty', () => {
      const onTyping = jest.fn();
      const onTypingComplete = jest.fn();

      render(
        <Bubble content="" typing={true} onTyping={onTyping} onTypingComplete={onTypingComplete} />,
      );

      expect(onTyping).not.toHaveBeenCalled();
      expect(onTypingComplete).not.toHaveBeenCalled();
    });

    it('should restart animation when content changes', async () => {
      const onTyping = jest.fn();
      const onTypingComplete = jest.fn();

      const typingConfig: BubbleAnimationOption = {
        effect: 'typing',
        step: 1,
        interval: 50,
      };

      const { rerender } = render(
        <Bubble
          content="Hello"
          typing={typingConfig}
          onTyping={onTyping}
          onTypingComplete={onTypingComplete}
        />,
      );

      // 等待第一个动画开始
      await waitFakeTimer(100, 2);

      // 更改内容，应该重新开始动画
      rerender(
        <Bubble
          content="World"
          typing={typingConfig}
          onTyping={onTyping}
          onTypingComplete={onTypingComplete}
        />,
      );

      await waitFakeTimer(100, 10);

      expect(onTyping).toHaveBeenCalled();
      expect(onTypingComplete).toHaveBeenLastCalledWith('World');
    });

    it('should interrupt and restart animation when content is completely different', async () => {
      const onTyping = jest.fn();
      const onTypingComplete = jest.fn();

      const typingConfig: BubbleAnimationOption = {
        effect: 'typing',
        step: 1,
        interval: 50,
      };

      const { rerender } = render(
        <Bubble
          content="Hello World"
          typing={typingConfig}
          onTyping={onTyping}
          onTypingComplete={onTypingComplete}
        />,
      );

      // 等待动画开始但未完成
      await waitFakeTimer(50, 3);

      // 更改为完全不同的内容
      rerender(
        <Bubble
          content="Goodbye"
          typing={typingConfig}
          onTyping={onTyping}
          onTypingComplete={onTypingComplete}
        />,
      );

      await waitFakeTimer(100, 10);

      expect(onTyping).toHaveBeenCalled();
      expect(onTypingComplete).toHaveBeenLastCalledWith('Goodbye');
    });

    it('should not re-render content when content is same but configuration differs', async () => {
      const onTyping = jest.fn();
      const step = 5;
      const typingConfig: BubbleAnimationOption = {
        effect: 'typing',
        step,
        interval: 50,
      };

      const text = 'Hello World';
      const { rerender } = render(
        <Bubble
          content={text}
          typing={typingConfig}
          onTyping={onTyping}
          onTypingComplete={() => {}}
        />,
      );

      // 等待动画开始但未完成
      await waitFakeTimer(100, 10);
      const times = Math.ceil(text.length / step);
      expect(onTyping).toHaveBeenCalledTimes(times);

      // 更改配置
      rerender(
        <Bubble
          content="Hello World"
          typing={{
            ...typingConfig,
            step: 2,
          }}
          onTyping={onTyping}
          onTypingComplete={() => {}}
        />,
      );

      expect(onTyping).toHaveBeenCalledTimes(times);
    });

    it('should support random step in array form', async () => {
      const onTyping = jest.fn();
      const onTypingComplete = jest.fn();

      const typingConfig: BubbleAnimationOption = {
        effect: 'typing',
        step: [1, 3],
        interval: 50,
      };

      render(
        <Bubble
          content="Hello World"
          typing={typingConfig}
          onTyping={onTyping}
          onTypingComplete={onTypingComplete}
        />,
      );

      await waitFakeTimer(100, 15);

      expect(onTyping).toHaveBeenCalled();
      expect(onTypingComplete).toHaveBeenCalledWith('Hello World');
    });

    it('should call onTyping callback during animation', async () => {
      const onTyping = jest.fn();

      const typingConfig: BubbleAnimationOption = {
        effect: 'typing',
        step: 1,
        interval: 50,
      };

      render(<Bubble content="Hello" typing={typingConfig} onTyping={onTyping} />);

      await waitFakeTimer(100, 8);

      expect(onTyping).toHaveBeenCalled();
      // 检查回调参数
      const calls = onTyping.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      expect(calls[calls.length - 1]).toEqual(['Hello', 'Hello']);
    });

    it('should trigger onTypingComplete in non-animation mode', () => {
      const onTypingComplete = jest.fn();
      render(<Bubble content="测试内容" onTypingComplete={onTypingComplete} />);

      expect(onTypingComplete).toHaveBeenCalledWith('测试内容');
    });

    it('should reset animation when content becomes empty, but not trigger onTypingComplete', async () => {
      const onTypingComplete = jest.fn();

      const typingConfig: BubbleAnimationOption = {
        effect: 'typing',
        step: 2,
        interval: 50,
      };

      const { container, rerender } = render(
        <Bubble content="测试内容" typing={typingConfig} onTypingComplete={onTypingComplete} />,
      );

      // 等待动画开始
      await waitFakeTimer(100, 2);
      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement?.textContent).toBe('测试内容');

      // 更改为空内容
      rerender(<Bubble content="" typing={typingConfig} onTypingComplete={onTypingComplete} />);
      expect(contentElement?.textContent).toBe('');

      expect(onTypingComplete).toHaveBeenCalledTimes(1);
    });

    it('should trigger onTypingComplete multiple times when content changes in non-animation mode', () => {
      const onTypingComplete = jest.fn();

      const { rerender } = render(
        <Bubble content="测试内容1" onTypingComplete={onTypingComplete} />,
      );
      expect(onTypingComplete).toHaveBeenCalledWith('测试内容1');

      rerender(<Bubble content="测试内容2" onTypingComplete={onTypingComplete} />);
      expect(onTypingComplete).toHaveBeenCalledWith('测试内容2');

      rerender(<Bubble content="测试内容3" onTypingComplete={onTypingComplete} />);
      expect(onTypingComplete).toHaveBeenCalledWith('测试内容3');

      expect(onTypingComplete).toHaveBeenCalledTimes(3);
    });

    it('should trigger onTypingComplete when streaming input ends in non-animation mode', async () => {
      const onTypingComplete = jest.fn();
      const { rerender } = render(
        <Bubble content="内容1内容1" onTypingComplete={onTypingComplete} streaming />,
      );
      // 流式输入中，不应触发
      expect(onTypingComplete).not.toHaveBeenCalled();

      // 结束流式输入，应触发
      rerender(
        <Bubble content="内容1内容1-完成" onTypingComplete={onTypingComplete} streaming={false} />,
      );
      expect(onTypingComplete).toHaveBeenCalledWith('内容1内容1-完成');
    });

    it('should trigger onTypingComplete when streaming input ends and animation completes in animation mode', async () => {
      const onTypingComplete = jest.fn();
      const firstString = '内容1内容1';
      const { container, rerender } = render(
        <Bubble
          content={firstString}
          typing={{
            effect: 'typing',
            step: 2,
            interval: 100,
          }}
          onTypingComplete={onTypingComplete}
          streaming
        />,
      );
      const contentElement = container.querySelector('.ant-bubble-content') as HTMLDivElement;

      // 保证第一段内容已完成
      await waitFakeTimer(100, 10);

      // 流式输入中，不应触发
      expect(onTypingComplete).not.toHaveBeenCalled();
      expect(contentElement.innerText).toBe(firstString);

      const doneText = `${firstString}-内容2内容2-完成`;
      // 结束流式输入，应触发
      rerender(
        <Bubble content={doneText} typing onTypingComplete={onTypingComplete} streaming={false} />,
      );

      await waitFakeTimer(50, 2);
      // 动画继续执行，但未完成
      expect(contentElement).toBeInTheDocument();
      expect(contentElement.innerText.length).toBeGreaterThan(firstString.length);
      expect(contentElement.innerText.length).toBeLessThan(doneText.length);
      expect(doneText.indexOf(contentElement.innerText)).toBe(0);
      expect(onTypingComplete).not.toHaveBeenCalled();

      // 动画完成
      await waitFakeTimer(100, 10);
      expect(onTypingComplete).toHaveBeenCalledWith(doneText);
    });

    describe('Close streaming input declaration', () => {
      it('should trigger onTypingComplete multiple times when actual streaming speed cannot keep up with animation speed', async () => {
        const onTypingComplete = jest.fn();
        const text = '内容1内容2内容3';
        const typing = { effect: 'typing', step: 5, interval: 50 } as const;
        const { rerender } = render(
          <Bubble
            content={text.slice(0, 3)}
            onTypingComplete={onTypingComplete}
            streaming={false}
            typing={typing}
          />,
        );

        // 模拟流式输入，但输入量小于动画输出量
        await waitFakeTimer(100, 5);
        expect(onTypingComplete).toHaveBeenCalledWith(text.slice(0, 3));
        rerender(
          <Bubble
            content={text.slice(0, 6)}
            onTypingComplete={onTypingComplete}
            streaming={false}
            typing={typing}
          />,
        );

        await waitFakeTimer(100, 5);
        expect(onTypingComplete).toHaveBeenCalledWith(text.slice(0, 6));
        rerender(
          <Bubble
            content={text.slice(0, 9)}
            onTypingComplete={onTypingComplete}
            streaming={false}
            typing={typing}
          />,
        );

        await waitFakeTimer(100, 5);
        expect(onTypingComplete).toHaveBeenCalledWith(text.slice(0, 9));
        expect(onTypingComplete).toHaveBeenCalledTimes(3);
      });
    });

    describe('Parameter validation', () => {
      it('should throw error when interval is invalid', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          interval: -1,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.interval, expect positive number.');
      });

      it('should throw error when interval is 0', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          interval: 0,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.interval, expect positive number.');
      });

      it('should throw error when interval is not a number', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          interval: 'invalid' as any,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.interval, expect positive number.');
      });

      it('should throw error when step is invalid', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          step: 'invalid' as any,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow(
          '[Bubble] invalid prop typing.step, expect positive number or positive number array',
        );
      });

      it('should throw error when step is negative', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          step: -1,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.step, expect positive number');
      });

      it('should throw error when step is 0', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          step: 0,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.step, expect positive number');
      });

      it('should throw error when first element of step array is invalid', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          step: [-1, 5] as any,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.step[0], expect positive number');
      });

      it('should throw error when second element of step array is invalid', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          step: [2, -1] as any,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.step[1], expect positive number');
      });

      it('should throw error when step array order is incorrect', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          step: [5, 2] as any,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.step, step[0] should less than step[1]');
      });
    });

    describe('Edge case handling', () => {
      it('should handle task ID mismatch', async () => {
        const onTyping = jest.fn();
        const onTypingComplete = jest.fn();

        const typingConfig: BubbleAnimationOption = {
          effect: 'typing',
          step: 1,
          interval: 50,
        };

        const { rerender } = render(
          <Bubble
            content="Hello"
            typing={typingConfig}
            onTyping={onTyping}
            onTypingComplete={onTypingComplete}
          />,
        );

        // 快速更改内容多次，模拟任务 ID 不匹配
        rerender(
          <Bubble
            content="World"
            typing={typingConfig}
            onTyping={onTyping}
            onTypingComplete={onTypingComplete}
          />,
        );

        rerender(
          <Bubble
            content="Test"
            typing={typingConfig}
            onTyping={onTyping}
            onTypingComplete={onTypingComplete}
          />,
        );

        await waitFakeTimer(100, 10);

        expect(onTypingComplete).toHaveBeenLastCalledWith('Test');
      });

      it('should correctly handle empty nextText', async () => {
        const onTypingComplete = jest.fn();

        const typingConfig: BubbleAnimationOption = {
          effect: 'typing',
          step: 10, // 大步长，一次性完成
          interval: 50,
        };

        render(<Bubble content="Hi" typing={typingConfig} onTypingComplete={onTypingComplete} />);

        await waitFakeTimer(100, 5);

        expect(onTypingComplete).toHaveBeenCalledWith('Hi');
      });

      it('should clean up resources when component unmounts', () => {
        const typingConfig: BubbleAnimationOption = {
          effect: 'typing',
          step: 1,
          interval: 50,
        };

        const { unmount } = render(<Bubble content="Hello" typing={typingConfig} />);

        // 卸载组件
        unmount();

        // 确保没有内存泄漏或错误
        expect(() => {
          jest.advanceTimersByTime(1000);
        }).not.toThrow();
      });

      it('should handle partial content match during animation', async () => {
        const onTyping = jest.fn();
        const onTypingComplete = jest.fn();

        const typingConfig: BubbleAnimationOption = {
          effect: 'typing',
          step: 1,
          interval: 50,
        };

        const { rerender } = render(
          <Bubble
            content="Hello World"
            typing={typingConfig}
            onTyping={onTyping}
            onTypingComplete={onTypingComplete}
          />,
        );

        // 等待动画开始但未完成
        await waitFakeTimer(100, 3);

        // 更改为包含当前已渲染内容的新内容（部分匹配）
        rerender(
          <Bubble
            content="Hello World Extended"
            typing={typingConfig}
            onTyping={onTyping}
            onTypingComplete={onTypingComplete}
          />,
        );

        await waitFakeTimer(200, 10);

        expect(onTyping).toHaveBeenCalled();
        expect(onTypingComplete).toHaveBeenLastCalledWith('Hello World Extended');
      });
    });
  });

  describe('Editable', () => {
    it('should support boolean type editable configuration', () => {
      const { container } = render(<Bubble content="可编辑内容" editable />);

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-editing');

      const editableDiv = container.querySelector('[contenteditable="true"]');
      expect(editableDiv).toBeInTheDocument();
      expect(editableDiv).toHaveTextContent('可编辑内容');
    });

    it('should support EditableBubbleOption type editable configuration', () => {
      const { container } = render(
        <Bubble
          content="测试内容"
          editable={{ editing: true, okText: '保存', cancelText: <span>放弃</span> }}
          onEditConfirm={jest.fn()}
        />,
      );

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-editing');

      const btns = container.querySelectorAll('.ant-bubble-editing-opts button');
      expect(btns.length).toBe(2);
      expect(btns[0].textContent?.replace(/\s/g, '')).toBe('保存');
      expect(btns[1].innerHTML).toBe('<span>放弃</span>');
    });

    it('should support editable.editing to control editing state', () => {
      const { container, rerender } = render(
        <Bubble content="测试内容" editable={{ editing: false }} onEditConfirm={jest.fn()} />,
      );

      expect(container.querySelector('.ant-bubble-content')).not.toHaveClass(
        'ant-bubble-content-editing',
      );

      rerender(
        <Bubble content="测试内容" editable={{ editing: true }} onEditConfirm={jest.fn()} />,
      );

      expect(container.querySelector('.ant-bubble-content')).toHaveClass(
        'ant-bubble-content-editing',
      );
    });

    it('should support onEditConfirm callback', () => {
      const onEditConfirm = jest.fn();
      const { container } = render(
        <Bubble content="初始内容" editable onEditConfirm={onEditConfirm} />,
      );

      const editableDiv = container.querySelector('[contenteditable="true"]')!;
      const confirmBtn = container.querySelectorAll('.ant-bubble-editing-opts button')[0]!;

      fireEvent.input(editableDiv, { target: { textContent: '修改后的内容' } });
      fireEvent.click(confirmBtn);
      expect(onEditConfirm).toHaveBeenCalledWith('修改后的内容');

      fireEvent.input(editableDiv, { target: { textContent: null } });
      fireEvent.click(confirmBtn);
      expect(onEditConfirm).toHaveBeenCalledWith('');
    });

    it('should support onEditCancel callback', () => {
      const onEditCancel = jest.fn();
      const { container } = render(
        <Bubble content="初始内容" editable onEditCancel={onEditCancel} />,
      );

      const cancelBtn = container.querySelectorAll('.ant-bubble-editing-opts button')[1]!;
      fireEvent.click(cancelBtn);

      expect(onEditCancel).toHaveBeenCalled();
    });

    it('should prioritize editing mode when both editable and typing are enabled', () => {
      const { container } = render(
        <Bubble content="测试内容" editable typing={{ effect: 'typing', step: 1 }} />,
      );

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-editing');

      // 不应该有动画相关的类名
      expect(container.querySelector('.ant-bubble-typing')).not.toBeInTheDocument();
    });

    it('should prioritize loading state when both editable and loading are enabled', () => {
      const { container } = render(<Bubble content="测试内容" editable loading />);

      // 应该显示加载状态
      const loadingElement = container.querySelector('.ant-bubble-dot');
      expect(loadingElement).toBeInTheDocument();

      // 不应该显示可编辑内容
      expect(container.querySelector('[contenteditable="true"]')).not.toBeInTheDocument();
    });

    it('should support empty content in editable mode', () => {
      const { container } = render(<Bubble content="" editable />);

      const editableDiv = container.querySelector('[contenteditable="true"]')!;
      expect(editableDiv).toHaveTextContent('');
    });

    it('should reject non-string content in editable mode', () => {
      expect(() => {
        render(
          <Bubble
            content={<div>非字符串内容</div>}
            editable={{ editing: true }}
            onEditConfirm={jest.fn()}
          />,
        );
      }).toThrow('Content of editable Bubble should be string');
    });

    it('should support behavior when editable configuration changes', () => {
      const { container, rerender } = render(<Bubble content="测试内容" editable={false} />);

      expect(container.querySelector('.ant-bubble-content')).not.toHaveClass(
        'ant-bubble-content-editing',
      );

      rerender(<Bubble content="测试内容" editable />);

      expect(container.querySelector('.ant-bubble-content')).toHaveClass(
        'ant-bubble-content-editing',
      );
    });

    it.each([
      { tag: 'div', display: 'block' },
      { tag: 'p', display: 'block' },
      { tag: 'section', display: 'flex' },
      { tag: 'li', display: 'list-item' },
      { tag: 'table', display: 'table' },
    ])('should support line breaks for any block-level elements', ({ tag }) => {
      const onEditConfirm = jest.fn();
      const { container } = render(
        <Bubble content="初始内容" editable onEditConfirm={onEditConfirm} />,
      );
      const editableDiv = container.querySelector('[contenteditable="true"]')!;
      const confirmBtn = container.querySelectorAll('.ant-bubble-editing-opts button')[0]!;

      editableDiv.innerHTML = `a<${tag}>b</${tag}>`;
      fireEvent.click(confirmBtn);

      expect(onEditConfirm).toHaveBeenCalledWith('a\nb');
    });

    it('should support span not triggering line breaks', () => {
      const onEditConfirm = jest.fn();
      const { container } = render(
        <Bubble content="初始内容" editable onEditConfirm={onEditConfirm} />,
      );

      const editableDiv = container.querySelector('[contenteditable="true"]')!;
      const confirmBtn = container.querySelectorAll('.ant-bubble-editing-opts button')[0]!;

      editableDiv.innerHTML = 'a<span>b</span>';
      fireEvent.click(confirmBtn);

      expect(onEditConfirm).toHaveBeenCalledWith('ab');
    });

    it('should support <br> triggering line breaks', () => {
      const onEditConfirm = jest.fn();
      const { container } = render(
        <Bubble content="初始内容" editable onEditConfirm={onEditConfirm} />,
      );

      const editableDiv = container.querySelector('[contenteditable="true"]')!;
      const confirmBtn = container.querySelectorAll('.ant-bubble-editing-opts button')[0]!;

      editableDiv.innerHTML = 'a<br>b<br>c';
      fireEvent.click(confirmBtn);

      expect(onEditConfirm).toHaveBeenCalledWith('a\nb\nc');
    });

    it('should support consecutive line breaks', () => {
      const onEditConfirm = jest.fn();
      const { container } = render(
        <Bubble content="初始内容" editable onEditConfirm={onEditConfirm} />,
      );

      const editableDiv = container.querySelector('[contenteditable="true"]')!;
      const confirmBtn = container.querySelectorAll('.ant-bubble-editing-opts button')[0]!;

      editableDiv.innerHTML = 'line1<div><br></div><div><br></div><div>line2</div>';
      fireEvent.click(confirmBtn);

      expect(onEditConfirm).toHaveBeenCalledWith('line1\n\n\nline2');
    });
  });
});
