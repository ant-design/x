import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { act, fireEvent, render } from '../../../tests/utils';
import Sender from '../index';

describe('Sender Component', () => {
  mountTest(() => <Sender />);

  rtlTest(() => <Sender />);

  it('Sender supports ref', () => {
    const ref = React.createRef<any>();
    render(<Sender ref={ref} />);
    expect(ref.current).not.toBeNull();
  });

  it('loading state', () => {
    const { asFragment } = render(<Sender loading />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('action as ReactNode', () => {
    const { container } = render(<Sender suffix={<div className="bamboo" />} />);
    expect(container.querySelector('.bamboo')).toBeTruthy();
  });

  it('custom action button', () => {
    const onSubmit = jest.fn();
    const onSend = jest.fn();
    const onClear = jest.fn();
    const { container, getByText } = render(
      <Sender
        suffix={(_, info) => {
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
        suffix={(_, { components: { ClearButton } }) => <ClearButton />}
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
        fireEvent.keyDown(container.querySelector('textarea')!, { key: 'Enter', shiftKey: false });
      });
      expect(onSubmit).toHaveBeenCalledWith('bamboo');
    });

    it('shiftEnter', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender value="bamboo" onSubmit={onSubmit} submitType="shiftEnter" />,
      );
      act(() => {
        fireEvent.keyDown(container.querySelector('textarea')!, { key: 'Enter', shiftKey: true });
      });
      expect(onSubmit).toHaveBeenCalledWith('bamboo');
    });
  });

  it('Sender.Header not can be focus', () => {
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
    expect(document.activeElement).not.toEqual(container.querySelector('textarea'));
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
          footer={(_, { components }) => {
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

      expect(onPasteFile).toHaveBeenCalledWith(fileList);
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

      expect(onPasteFile).toHaveBeenCalledWith(fileList);
    });
  });
  describe('allowSpeech', () => {
    it('width allowSpeech', () => {
      const { container } = render(<Sender allowSpeech />);
      expect(container.querySelector('.ant-sender')).toBeTruthy();
    });

    it('should render speech button when allowSpeech is true', () => {
      const { container } = render(<Sender allowSpeech />);
      expect(container.querySelector('.ant-sender')).toBeTruthy();
    });

    it('should not render speech button when allowSpeech is false', () => {
      const { container } = render(<Sender allowSpeech={false} />);
      expect(container.querySelector('.ant-sender')).toBeTruthy();
    });

    it('should handle speech button click', () => {
      const { container } = render(<Sender allowSpeech />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toBeTruthy();
    });

    it('should handle speech with custom configuration', () => {
      const { container } = render(
        <Sender
          allowSpeech={{
            lang: 'zh-CN',
            continuous: true,
          }}
        />,
      );
      expect(container.querySelector('.ant-sender')).toBeTruthy();
    });
  });
});
