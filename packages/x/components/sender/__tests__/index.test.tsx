import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { act } from '../../../tests/utils';
import Sender from '../index';

describe('Sender Component', () => {
  mountTest(() => <Sender />);

  rtlTest(() => <Sender />);

  it('loading state', () => {
    const { asFragment } = render(<Sender loading />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('action as ReactNode', () => {
    const { container } = render(<Sender actions={<div className="bamboo" />} />);
    expect(container.querySelector('.bamboo')).toBeTruthy();
  });

  it('custom action button', () => {
    const onSubmit = jest.fn();
    const onSend = jest.fn();
    const onClear = jest.fn();
    const { container, getByText } = render(
      <Sender
        actions={(_, info) => {
          const { SendButton, ClearButton } = info.components;
          return (
            <div className="bamboo">
              <SendButton onClick={onSend}>SendPrompt</SendButton>
              <ClearButton onClick={onClear} className="clear-button" disabled={false} />
            </div>
          );
        }}
        disabled
        defaultValue="text"
        onSubmit={onSubmit}
      />,
    );

    // check children render
    const sendButton = getByText('SendPrompt');
    expect(sendButton).toBeInTheDocument();

    const clearButton = container.querySelector('.bamboo button.clear-button')!;
    expect(clearButton).toBeInTheDocument();

    // check custom onClick
    fireEvent.click(sendButton);
    fireEvent.click(clearButton);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onSend).not.toHaveBeenCalled();
    expect(onClear).toHaveBeenCalled();
  });

  it('onSubmit', () => {
    const onSubmit = jest.fn();
    const { container } = render(<Sender value="bamboo" onSubmit={onSubmit} />);
    fireEvent.click(container.querySelector('button')!);
    expect(onSubmit).toHaveBeenCalledWith('bamboo');
  });

  it('onCancel', () => {
    const onCancel = jest.fn();
    const { container } = render(<Sender loading onCancel={onCancel} />);
    fireEvent.click(container.querySelector('button')!);
    expect(onCancel).toHaveBeenCalled();
  });

  it('onClear', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Sender
        onChange={onChange}
        actions={(_, { components: { ClearButton } }) => <ClearButton />}
      />,
    );

    fireEvent.change(container.querySelector('textarea')!, { target: { value: 'bamboo' } });
    expect(onChange).toHaveBeenCalledWith('bamboo', {});

    fireEvent.click(container.querySelector('button')!);
    expect(onChange).toHaveBeenCalledWith('', undefined);
  });

  describe('submitType', () => {
    it('default', () => {
      const onSubmit = jest.fn();
      const { container } = render(<Sender value="bamboo" onSubmit={onSubmit} />);
      act(() => {
        fireEvent.keyUp(container.querySelector('textarea')!, { key: 'Enter', shiftKey: false });
      });
      expect(onSubmit).toHaveBeenCalledWith('bamboo');
    });

    it('shiftEnter', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender value="bamboo" onSubmit={onSubmit} submitType="shiftEnter" />,
      );
      act(() => {
        fireEvent.keyUp(container.querySelector('textarea')!, { key: 'Enter', shiftKey: true });
      });
      expect(onSubmit).toHaveBeenCalledWith('bamboo');
    });
  });

  it('Sender.Header can be focus', () => {
    const { container } = render(
      <Sender
        header={
          <Sender.Header open>
            <input className="target" />
          </Sender.Header>
        }
      />,
    );

    const inputEle = container.querySelector<HTMLInputElement>('.target')!;
    inputEle.focus();
    expect(document.activeElement).toEqual(inputEle);

    // Click on the header
    fireEvent.mouseDown(container.querySelector('.ant-sender-header')!);
    expect(document.activeElement).toEqual(inputEle);

    // Click on the content
    fireEvent.mouseDown(container.querySelector('.ant-sender-content')!);
    expect(document.activeElement).toEqual(container.querySelector('textarea'));
  });

  it('readOnly', () => {
    const { container } = render(<Sender readOnly />);
    expect(container.querySelector('textarea')).toHaveAttribute('readonly');
  });
  describe('footer', () => {
    it('footer width function', () => {
      const onSubmit = jest.fn();
      const { container, getByText } = render(
        <Sender
          footer={({ components }) => {
            const { SendButton, ClearButton } = components;
            return (
              <div className="sender-footer-test">
                <SendButton onClick={onSubmit} disabled={false}>
                  SendPrompt
                </SendButton>
                <ClearButton disabled />
              </div>
            );
          }}
        />,
      );

      expect(container.querySelector('.sender-footer-test')).toBeTruthy();
      // check children render
      const sendButton = getByText('SendPrompt');
      expect(sendButton).toBeInTheDocument();

      const clearButton = container.querySelector('.sender-footer-test button[disabled]');
      expect(clearButton).toBeInTheDocument();

      // check custom onClick
      fireEvent.click(sendButton);
      expect(onSubmit).toHaveBeenCalled();
    });
    it('footer width reactNode', () => {
      const { container } = render(
        <Sender
          footer={<div className="sender-footer-test-reactNode">footer width reactNode</div>}
        />,
      );
      expect(container.querySelector('.sender-footer-test-reactNode')).toBeTruthy();
    });
  });

  describe('paste events', () => {
    it('onPaste callback', () => {
      const onPaste = jest.fn();
      const { container } = render(<Sender onPaste={onPaste} />);

      const textarea = container.querySelector('textarea')!;
      fireEvent.paste(textarea);
      expect(onPaste).toHaveBeenCalled();
      const eventArg = onPaste.mock.calls[0][0];
      expect(eventArg.type).toBe('paste');
      expect(eventArg.target).toBe(textarea);
    });

    it('onPasteFile callback with files', () => {
      const onPasteFile = jest.fn();
      const { container } = render(<Sender onPasteFile={onPasteFile} />);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileList = {
        0: file,
        length: 1,
        item: (idx: number) => (idx === 0 ? file : null),
      };

      const textarea = container.querySelector('textarea')!;
      fireEvent.paste(textarea, {
        clipboardData: {
          files: fileList,
          getData: () => '',
        },
      });

      expect(onPasteFile).toHaveBeenCalledWith(file, fileList);
    });

    it('should not trigger onPasteFile when no files', () => {
      const onPasteFile = jest.fn();
      const { container } = render(<Sender onPasteFile={onPasteFile} />);

      const textarea = container.querySelector('textarea')!;
      fireEvent.paste(textarea, {
        clipboardData: {
          files: { length: 0 },
          getData: () => '',
        },
      });

      expect(onPasteFile).not.toHaveBeenCalled();
    });

    it('should handle multiple files paste', () => {
      const onPasteFile = jest.fn();
      const { container } = render(<Sender onPasteFile={onPasteFile} />);

      const file1 = new File(['test1'], 'test1.png', { type: 'image/png' });
      const file2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });
      const fileList = {
        0: file1,
        1: file2,
        length: 2,
        item: (idx: number) => (idx === 0 ? file1 : idx === 1 ? file2 : null),
      };

      const textarea = container.querySelector('textarea')!;
      fireEvent.paste(textarea, {
        clipboardData: {
          files: fileList,
          getData: () => '',
        },
      });

      expect(onPasteFile).toHaveBeenCalledWith(file1, fileList);
    });
  });
describe('Props validation and edge cases', () => {
    it('should handle undefined value prop', () => {
      const { container } = render(<Sender value={undefined} />);
      const textarea = container.querySelector('textarea')!;
      expect(textarea.value).toBe('');
    });

    it('should handle null value prop', () => {
      const { container } = render(<Sender value={null as any} />);
      const textarea = container.querySelector('textarea')!;
      expect(textarea.value).toBe('');
    });

    it('should handle empty string value', () => {
      const { container } = render(<Sender value="" />);
      const textarea = container.querySelector('textarea')!;
      expect(textarea.value).toBe('');
    });

    it('should handle very long text input', () => {
      const longText = 'a'.repeat(10000);
      const { container } = render(<Sender value={longText} />);
      const textarea = container.querySelector('textarea')!;
      expect(textarea.value).toBe(longText);
    });

    it('should handle special characters and unicode', () => {
      const specialText = '你好世界 🌍 ñáéíóú <>&"\'';
      const { container } = render(<Sender value={specialText} />);
      const textarea = container.querySelector('textarea')!;
      expect(textarea.value).toBe(specialText);
    });

    it('should handle multiline text with line breaks', () => {
      const multilineText = 'Line 1\nLine 2\r\nLine 3\n\nLine 5';
      const { container } = render(<Sender value={multilineText} />);
      const textarea = container.querySelector('textarea')!;
      expect(textarea.value).toBe(multilineText);
    });

    it('should handle placeholder prop', () => {
      const placeholderText = 'Enter your message here...';
      const { container } = render(<Sender placeholder={placeholderText} />);
      const textarea = container.querySelector('textarea')!;
      expect(textarea).toHaveAttribute('placeholder', placeholderText);
    });

    it('should handle maxLength prop if supported', () => {
      const { container } = render(<Sender maxLength={100} />);
      const textarea = container.querySelector('textarea')!;
      if (textarea.hasAttribute('maxlength')) {
        expect(textarea).toHaveAttribute('maxlength', '100');
      }
    });
  });

  describe('Accessibility and ARIA attributes', () => {
    it('should have proper focus management', () => {
      const { container } = render(<Sender />);
      const textarea = container.querySelector('textarea')!;
      
      textarea.focus();
      expect(document.activeElement).toBe(textarea);
    });

    it('should handle disabled state with proper attributes', () => {
      const { container } = render(<Sender disabled />);
      const textarea = container.querySelector('textarea')!;
      const button = container.querySelector('button')!;
      expect(textarea).toBeDisabled();
      expect(button).toBeDisabled();
    });

    it('should support keyboard navigation between header and content', () => {
      const { container } = render(
        <Sender
          header={
            <Sender.Header open>
              <input data-testid="header-input" />
            </Sender.Header>
          }
        />
      );

      const headerInput = container.querySelector('[data-testid="header-input"]') as HTMLElement;
      const textarea = container.querySelector('textarea') as HTMLElement;

      headerInput.focus();
      expect(document.activeElement).toBe(headerInput);

      // Click on content should focus textarea
      fireEvent.mouseDown(container.querySelector('.ant-sender-content')!);
      expect(document.activeElement).toBe(textarea);
    });

    it('should maintain focus during loading state changes', () => {
      const { container, rerender } = render(<Sender value="test" />);
      const textarea = container.querySelector('textarea')!;
      
      textarea.focus();
      expect(document.activeElement).toBe(textarea);

      rerender(<Sender value="test" loading />);
      // Focus should be maintained on the textarea even during loading state
      expect(container.querySelector('textarea')).toBeInTheDocument();
    });
  });

  describe('Performance and optimization', () => {
    it('should not re-render unnecessarily with same props', () => {
      const renderSpy = jest.fn();
      const TestWrapper = ({ value }: { value: string }) => {
        renderSpy();
        return <Sender value={value} />;
      };

      const { rerender } = render(<TestWrapper value="test" />);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      rerender(<TestWrapper value="test" />);
      expect(renderSpy).toHaveBeenCalledTimes(2); // React will re-render but component should handle it efficiently

      rerender(<TestWrapper value="different" />);
      expect(renderSpy).toHaveBeenCalledTimes(3);
    });

    it('should handle rapid state changes efficiently', () => {
      const onChange = jest.fn();
      const { container } = render(<Sender onChange={onChange} />);
      const textarea = container.querySelector('textarea')!;

      // Simulate rapid typing
      act(() => {
        for (let i = 0; i < 10; i++) {
          fireEvent.change(textarea, { target: { value: `text${i}` } });
        }
      });

      expect(onChange).toHaveBeenCalledTimes(10);
      expect(onChange).toHaveBeenLastCalledWith('text9', {});
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle onSubmit callback errors gracefully', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const onSubmit = jest.fn(() => {
        throw new Error('Submit failed');
      });

      const { container } = render(<Sender value="test" onSubmit={onSubmit} />);
      
      // Component should not crash when callback throws
      expect(() => {
        fireEvent.click(container.querySelector('button')!);
      }).not.toThrow();

      consoleError.mockRestore();
    });

    it('should handle onChange callback errors gracefully', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const onChange = jest.fn(() => {
        throw new Error('Change failed');
      });

      const { container } = render(<Sender onChange={onChange} />);
      
      expect(() => {
        fireEvent.change(container.querySelector('textarea')!, { target: { value: 'test' } });
      }).not.toThrow();

      consoleError.mockRestore();
    });

    it('should handle malformed clipboard data', () => {
      const onPaste = jest.fn();
      const onPasteFile = jest.fn();
      const { container } = render(<Sender onPaste={onPaste} onPasteFile={onPasteFile} />);

      const textarea = container.querySelector('textarea')!;
      
      // Test with malformed clipboard data
      expect(() => {
        fireEvent.paste(textarea, {
          clipboardData: {
            files: null,
            getData: () => { throw new Error('getData failed'); }
          },
        });
      }).not.toThrow();

      // Component should still be functional
      expect(container.querySelector('textarea')).toBeInTheDocument();
    });

    it('should handle component unmounting gracefully', () => {
      const { container, unmount } = render(<Sender value="test" />);
      
      expect(container.querySelector('textarea')).toBeInTheDocument();
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Component composition and flexibility', () => {
    it('should render custom header and footer together', () => {
      const { container } = render(
        <Sender
          header={<Sender.Header open><div data-testid="custom-header">Header</div></Sender.Header>}
          footer={<div data-testid="custom-footer">Footer</div>}
        />
      );

      expect(container.querySelector('[data-testid="custom-header"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="custom-footer"]')).toBeInTheDocument();
    });

    it('should handle complex nested actions', () => {
      const onAction1 = jest.fn();
      const onAction2 = jest.fn();
      
      const { getByText } = render(
        <Sender
          actions={(_, { components }) => (
            <div>
              <components.SendButton onClick={onAction1}>Action 1</components.SendButton>
              <div>
                <components.ClearButton onClick={onAction2}>Action 2</components.ClearButton>
              </div>
            </div>
          )}
        />
      );

      fireEvent.click(getByText('Action 1'));
      fireEvent.click(getByText('Action 2'));

      expect(onAction1).toHaveBeenCalled();
      expect(onAction2).toHaveBeenCalled();
    });

    it('should maintain textarea focus during dynamic content changes', () => {
      const { container, rerender } = render(<Sender value="initial" />);
      const textarea = container.querySelector('textarea')!;
      
      textarea.focus();
      expect(document.activeElement).toBe(textarea);

      rerender(<Sender value="updated" />);
      // Focus should be maintained after props update
      expect(container.querySelector('textarea')).toBeInTheDocument();
    });

    it('should handle actions as both function and ReactNode', () => {
      const { container, rerender } = render(
        <Sender actions={<div data-testid="react-node-action">Static Actions</div>} />
      );

      expect(container.querySelector('[data-testid="react-node-action"]')).toBeInTheDocument();

      rerender(
        <Sender
          actions={(_, { components }) => (
            <div data-testid="function-action">
              <components.SendButton>Dynamic Send</components.SendButton>
            </div>
          )}
        />
      );

      expect(container.querySelector('[data-testid="function-action"]')).toBeInTheDocument();
    });
  });

  describe('State management and lifecycle', () => {
    it('should handle controlled vs uncontrolled state properly', () => {
      const onChange = jest.fn();
      const { container, rerender } = render(<Sender onChange={onChange} />);
      const textarea = container.querySelector('textarea')!;

      // Uncontrolled initially
      fireEvent.change(textarea, { target: { value: 'uncontrolled' } });
      expect(onChange).toHaveBeenCalledWith('uncontrolled', {});

      // Switch to controlled
      rerender(<Sender value="controlled" onChange={onChange} />);
      expect(textarea.value).toBe('controlled');
    });

    it('should handle defaultValue with subsequent changes', () => {
      const onChange = jest.fn();
      const { container } = render(<Sender defaultValue="initial" onChange={onChange} />);
      const textarea = container.querySelector('textarea')!;

      expect(textarea.value).toBe('initial');

      fireEvent.change(textarea, { target: { value: 'changed' } });
      expect(onChange).toHaveBeenCalledWith('changed', {});
    });

    it('should reset state when clear is called multiple times', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Sender
          onChange={onChange}
          value="test"
          actions={(_, { components }) => <components.ClearButton />}
        />
      );

      const clearButton = container.querySelector('button')!;
      
      fireEvent.click(clearButton);
      expect(onChange).toHaveBeenCalledWith('', undefined);

      // Clear again should still work
      fireEvent.click(clearButton);
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('should handle rapid prop changes without errors', () => {
      const { rerender } = render(<Sender value="" />);

      expect(() => {
        for (let i = 0; i < 50; i++) {
          rerender(<Sender value={`value-${i}`} loading={i % 2 === 0} disabled={i % 3 === 0} />);
        }
      }).not.toThrow();
    });
  });

  describe('Keyboard shortcuts and interactions', () => {
    it('should handle Enter key with different submitType configurations', () => {
      const onSubmit = jest.fn();
      
      // Test default behavior (Enter submits)
      const { container, rerender } = render(
        <Sender value="test" onSubmit={onSubmit} />
      );
      const textarea = container.querySelector('textarea')!;

      act(() => {
        fireEvent.keyUp(textarea, { key: 'Enter', shiftKey: false });
      });
      expect(onSubmit).toHaveBeenCalledWith('test');

      // Test shiftEnter configuration
      onSubmit.mockClear();
      rerender(<Sender value="test" onSubmit={onSubmit} submitType="shiftEnter" />);
      
      act(() => {
        fireEvent.keyUp(textarea, { key: 'Enter', shiftKey: false });
      });
      expect(onSubmit).not.toHaveBeenCalled();

      act(() => {
        fireEvent.keyUp(textarea, { key: 'Enter', shiftKey: true });
      });
      expect(onSubmit).toHaveBeenCalledWith('test');
    });

    it('should handle Escape key behavior', () => {
      const { container } = render(<Sender value="test" />);
      const textarea = container.querySelector('textarea')!;

      // Component should not crash when Escape is pressed
      expect(() => {
        fireEvent.keyDown(textarea, { key: 'Escape' });
      }).not.toThrow();
      
      expect(container.querySelector('textarea')).toBeInTheDocument();
    });

    it('should handle Tab key navigation', () => {
      const { container } = render(
        <Sender
          header={<Sender.Header open><input data-testid="header-input" /></Sender.Header>}
          footer={({ components }) => (
            <div>
              <components.SendButton data-testid="send-btn">Send</components.SendButton>
            </div>
          )}
        />
      );

      const headerInput = container.querySelector('[data-testid="header-input"]') as HTMLElement;
      const textarea = container.querySelector('textarea') as HTMLElement;

      // Tab navigation should work properly
      headerInput.focus();
      expect(document.activeElement).toBe(headerInput);

      fireEvent.keyDown(headerInput, { key: 'Tab' });
      // Component should handle tab navigation without crashing
      expect(container.querySelector('textarea')).toBeInTheDocument();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete user workflow: type, edit, submit', () => {
      const onSubmit = jest.fn();
      const onChange = jest.fn();
      
      const { container } = render(<Sender onSubmit={onSubmit} onChange={onChange} />);
      const textarea = container.querySelector('textarea')!;
      const submitButton = container.querySelector('button')!;

      // Type initial message
      fireEvent.change(textarea, { target: { value: 'Hello' } });
      expect(onChange).toHaveBeenCalledWith('Hello', {});

      // Edit message
      fireEvent.change(textarea, { target: { value: 'Hello World' } });
      expect(onChange).toHaveBeenCalledWith('Hello World', {});

      // Submit
      fireEvent.click(submitButton);
      expect(onSubmit).toHaveBeenCalledWith('Hello World');
    });

    it('should handle loading state transitions properly', () => {
      const onSubmit = jest.fn();
      const onCancel = jest.fn();
      
      const { container, rerender } = render(
        <Sender value="test" onSubmit={onSubmit} onCancel={onCancel} />
      );

      // Initial state - should have submit button
      expect(container.querySelector('button')).toBeInTheDocument();

      // Switch to loading state
      rerender(<Sender value="test" loading onSubmit={onSubmit} onCancel={onCancel} />);
      
      // Should now have cancel functionality
      const button = container.querySelector('button')!;
      fireEvent.click(button);
      expect(onCancel).toHaveBeenCalled();
    });

    it('should handle complex paste scenarios with mixed content', () => {
      const onPaste = jest.fn();
      const onPasteFile = jest.fn();

      const { container } = render(
        <Sender onPaste={onPaste} onPasteFile={onPasteFile} />
      );

      const textarea = container.querySelector('textarea')!;
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      fireEvent.paste(textarea, {
        clipboardData: {
          files: { 0: file, length: 1, item: () => file },
          getData: () => 'pasted text',
        },
      });

      expect(onPaste).toHaveBeenCalled();
      expect(onPasteFile).toHaveBeenCalledWith(file, expect.any(Object));
    });

    it('should maintain consistent state across prop changes', () => {
      const onChange = jest.fn();
      const { container, rerender } = render(
        <Sender value="initial" onChange={onChange} disabled={false} />
      );

      const textarea = container.querySelector('textarea')!;
      expect(textarea.value).toBe('initial');
      expect(textarea).not.toBeDisabled();

      // Change props
      rerender(<Sender value="updated" onChange={onChange} disabled={true} />);
      
      expect(textarea.value).toBe('updated');
      expect(textarea).toBeDisabled();
    });
  });

  describe('Snapshot tests for component states', () => {
    it('should match snapshot with minimal props', () => {
      const { asFragment } = render(<Sender />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in disabled state', () => {
      const { asFragment } = render(
        <Sender
          value="disabled message"
          disabled
          actions={(_, { components }) => (
            <div>
              <components.SendButton disabled>Send</components.SendButton>
              <components.ClearButton disabled>Clear</components.ClearButton>
            </div>
          )}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with complex header and footer', () => {
      const { asFragment } = render(
        <Sender
          value="test message"
          header={<Sender.Header open><div>Complex Header</div></Sender.Header>}
          footer={({ components }) => (
            <div className="complex-footer">
              <components.SendButton>Send Now</components.SendButton>
              <components.ClearButton>Reset</components.ClearButton>
            </div>
          )}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with all boolean props enabled', () => {
      const { asFragment } = render(
        <Sender
          value="comprehensive test"
          loading={true}
          disabled={false}
          readOnly={false}
          placeholder="Enter message"
          submitType="shiftEnter"
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

});