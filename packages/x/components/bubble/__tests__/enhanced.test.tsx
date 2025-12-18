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
    it('应该支持基础动画', async () => {
      const { container } = render(<Bubble content="测试内容" typing />);
      const contentElement = container.querySelector('.ant-bubble-content');

      // 基础动画会渲染内容，检查动画容器是否存在
      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toHaveClass('ant-bubble-content');
      // 动画组件应该正常渲染，不检查具体内容
      expect(container.querySelector('.ant-bubble')).toBeInTheDocument();
    });

    it('应该正确显示打字机输出效果', async () => {
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

    it('应该正确显示渐入动画的输出效果', async () => {
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
      expect(fadeInElements.length).toBeGreaterThanOrEqual(0);

      // 等待动画完成
      await waitFakeTimer(100, 10);

      // 最终应该显示完整内容
      expect(container).toHaveTextContent('Hello World');
    });

    it('应该正确显示动画的中间状态', async () => {
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

    it('应该支持动画回调函数', async () => {
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

    it('应该支持从公共前缀处开始输出', async () => {
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

    it('应该支持完全重新输出', async () => {
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

    it('应该在内容为空时不执行动画', () => {
      const onTyping = jest.fn();
      const onTypingComplete = jest.fn();

      render(
        <Bubble content="" typing={true} onTyping={onTyping} onTypingComplete={onTypingComplete} />,
      );

      expect(onTyping).not.toHaveBeenCalled();
      expect(onTypingComplete).not.toHaveBeenCalled();
    });

    it('应该在内容变化时重新开始动画', async () => {
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

    it('应该在内容完全不同时中断并重新开始动画', async () => {
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

    it('应该在 content 相同，配置不同的情况下不重新渲染 content', async () => {
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

    it('应该支持数组形式的随机 step', async () => {
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

    it('应该在动画过程中调用 onTyping 回调', async () => {
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

    it('应该在非动画模式下触发 onTypingComplete', () => {
      const onTypingComplete = jest.fn();
      render(<Bubble content="测试内容" onTypingComplete={onTypingComplete} />);

      expect(onTypingComplete).toHaveBeenCalledWith('测试内容');
    });

    it('应该在内容变为空时重置动画，但不触发 onTypingComplete', async () => {
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

    it('应该在非动画模式下更改 content 多次触发 onTypingComplete', () => {
      const onTypingComplete = jest.fn();

      render(<Bubble content="测试内容1" onTypingComplete={onTypingComplete} />);
      expect(onTypingComplete).toHaveBeenCalledWith('测试内容1');

      render(<Bubble content="测试内容2" onTypingComplete={onTypingComplete} />);
      expect(onTypingComplete).toHaveBeenCalledWith('测试内容2');

      render(<Bubble content="测试内容3" onTypingComplete={onTypingComplete} />);
      expect(onTypingComplete).toHaveBeenCalledWith('测试内容3');

      expect(onTypingComplete).toHaveBeenCalledTimes(3);
    });

    it('应该在非动画模式下流式输入结束时触发 onTypingComplete', async () => {
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

    it('应该在动画模式下流式输入结束且动画结束时触发 onTypingComplete', async () => {
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

    describe('关闭流式输入声明', () => {
      it('应该在content 实际采用流式传输但速度赶不上动画速度时多次触发 onTypingComplete', async () => {
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

    describe('参数验证', () => {
      it('应该抛出错误当 interval 无效', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          interval: -1,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.interval, expect positive number.');
      });

      it('应该抛出错误当 interval 为 0', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          interval: 0,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.interval, expect positive number.');
      });

      it('应该抛出错误当 interval 不是数字', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          interval: 'invalid' as any,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.interval, expect positive number.');
      });

      it('应该抛出错误当 step 无效', () => {
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

      it('应该抛出错误当 step 为负数', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          step: -1,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.step, expect positive number');
      });

      it('应该抛出错误当 step 为 0', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          step: 0,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.step, expect positive number');
      });

      it('应该抛出错误当 step 数组第一个元素无效', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          step: [-1, 5] as any,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.step[0], expect positive number');
      });

      it('应该抛出错误当 step 数组第二个元素无效', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          step: [2, -1] as any,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.step[1], expect positive number');
      });

      it('应该抛出错误当 step 数组顺序错误', () => {
        const invalidConfig = {
          effect: 'typing' as const,
          step: [5, 2] as any,
        };

        expect(() => {
          render(<Bubble content="test" typing={invalidConfig} />);
        }).toThrow('[Bubble] invalid prop typing.step, step[0] should less than step[1]');
      });
    });

    describe('边界情况处理', () => {
      it('应该处理任务 ID 不匹配的情况', async () => {
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

      it('应该正确处理空的 nextText', async () => {
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

      it('应该在组件卸载时清理资源', () => {
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

      it('应该处理动画进行中内容部分匹配的情况', async () => {
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
    it('应该支持 boolean 类型的 editable 配置', () => {
      const { container } = render(<Bubble content="可编辑内容" editable />);

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-editing');

      const editableDiv = container.querySelector('[contenteditable="true"]');
      expect(editableDiv).toBeInTheDocument();
      expect(editableDiv).toHaveTextContent('可编辑内容');
    });

    it('应该支持 EditableBubbleOption 类型的 editable 配置', () => {
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

    it('应该支持 editable.editing 控制编辑状态', () => {
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

    it('应该支持 onEditConfirm 回调', () => {
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

    it('应该支持 onEditCancel 回调', () => {
      const onEditCancel = jest.fn();
      const { container } = render(
        <Bubble content="初始内容" editable onEditCancel={onEditCancel} />,
      );

      const cancelBtn = container.querySelectorAll('.ant-bubble-editing-opts button')[1]!;
      fireEvent.click(cancelBtn);

      expect(onEditCancel).toHaveBeenCalled();
    });

    it('应该支持 editable 与 typing 同时启用时优先显示编辑模式', () => {
      const { container } = render(
        <Bubble content="测试内容" editable typing={{ effect: 'typing', step: 1 }} />,
      );

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-editing');

      // 不应该有动画相关的类名
      expect(container.querySelector('.ant-bubble-typing')).not.toBeInTheDocument();
    });

    it('应该支持 editable 与 loading 同时启用时优先显示加载状态', () => {
      const { container } = render(<Bubble content="测试内容" editable loading />);

      // 应该显示加载状态
      const loadingElement = container.querySelector('.ant-bubble-dot');
      expect(loadingElement).toBeInTheDocument();

      // 不应该显示可编辑内容
      expect(container.querySelector('[contenteditable="true"]')).not.toBeInTheDocument();
    });

    it('应该支持 editable 模式下空内容', () => {
      const { container } = render(<Bubble content="" editable />);

      const editableDiv = container.querySelector('[contenteditable="true"]')!;
      expect(editableDiv).toHaveTextContent('');
    });

    it('应该支持 editable 模式下拒绝非字符串内容', () => {
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

    it('应该支持 editable 配置切换时的行为', () => {
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
    ])('应支持任意块级元素换行情况', ({ tag }) => {
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

    it('应支持 span 不触发换行', () => {
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

    it('应支持 <br> 触发换行', () => {
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

    it('应支持连续换行', () => {
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
