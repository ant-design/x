import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import Sender from '../index';

describe('Sender Component', () => {
  mountTest(() => <Sender />);

  rtlTest(() => <Sender />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

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
    const { container, getByText } = render(
      <Sender
        actions={(_, info) => {
          const { SendButton, ClearButton } = info.components;
          return (
            <div className="bamboo">
              <SendButton onClick={onSubmit} disabled={false}>
                SendPrompt
              </SendButton>
              <ClearButton disabled />
            </div>
          );
        }}
      />,
    );

    // check children render
    const sendButton = getByText('SendPrompt');
    expect(sendButton).toBeInTheDocument();

    const clearButton = container.querySelector('.bamboo button[disabled]');
    expect(clearButton).toBeInTheDocument();

    // check custom onClick
    fireEvent.click(sendButton);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should not trigger action when button is disabled', () => {
    const onSubmit = jest.fn();
    const onClick = jest.fn();
    const { container } = render(
      <Sender
        actions={(_, info) => {
          const { SendButton } = info.components;
          return (
            <SendButton onClick={onClick} disabled>
              SendPrompt
            </SendButton>
          );
        }}
        onSubmit={onSubmit}
      />,
    );

    const button = container.querySelector('button')!;
    fireEvent.click(button);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
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
      const onPressKey = jest.fn();
      const { container } = render(
        <Sender value="bamboo" onSubmit={onSubmit} onKeyPress={onPressKey} />,
      );
      fireEvent.keyDown(container.querySelector('textarea')!, { key: 'Enter', shiftKey: false });
      expect(onSubmit).toHaveBeenCalledWith('bamboo');
      expect(onPressKey).toHaveBeenCalled();
    });

    it('shiftEnter', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <Sender value="bamboo" onSubmit={onSubmit} submitType="shiftEnter" />,
      );
      fireEvent.keyDown(container.querySelector('textarea')!, { key: 'Enter', shiftKey: true });
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
});
