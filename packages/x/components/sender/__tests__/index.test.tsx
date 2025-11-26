import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { act, fireEvent, render } from '../../../tests/utils';
import Sender from '../index';

const mockRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  onstart: null as any,
  onend: null as any,
  onresult: null as any,
};
// Setup global mocks
const mockSpeechRecognition = jest.fn().mockImplementation(() => mockRecognition);

// Setup global browser APIs for tests
if (typeof window !== 'undefined') {
  window.cancelAnimationFrame = window.cancelAnimationFrame || jest.fn();
  window.requestAnimationFrame = window.requestAnimationFrame || jest.fn((cb) => setTimeout(cb, 0));
  window.getComputedStyle =
    window.getComputedStyle ||
    jest.fn(() => ({
      getPropertyValue: jest.fn(),
      boxSizing: 'border-box',
      paddingTop: '0px',
      paddingBottom: '0px',
      borderTopWidth: '0px',
      borderBottomWidth: '0px',
      lineHeight: 'normal',
      fontSize: '14px',
      fontFamily: 'Arial',
    }));
}

// Mock document APIs
if (typeof document !== 'undefined') {
  document.createRange =
    document.createRange ||
    jest.fn(() => ({
      setStart: jest.fn(),
      setEnd: jest.fn(),
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    }));
}

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

  it('should handle ref methods correctly', () => {
    const ref = React.createRef<any>();
    render(<Sender key="text" ref={ref} />);

    const value = ref.current?.getValue();
    expect(value).toBeDefined();
    expect(typeof value?.value).toBe('string');
    expect(Array.isArray(value?.slotConfig)).toBe(true);

    ref.current?.focus();
    ref.current?.focus({
      cursor: 'slot',
      slotKey: 'input1',
    });
    ref.current?.focus({
      cursor: 'end',
    });
    ref.current?.insert?.('text1', 'start');
    ref.current?.insert?.('text1');
    ref.current?.clear();
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
    let originalWindow: any;
    let originalNavigator: any;

    beforeEach(() => {
      jest.clearAllMocks();

      // Store original globals
      originalWindow = global.window;
      originalNavigator = global.navigator;

      // Setup mock window object with necessary APIs
      global.window = {
        ...originalWindow,
        SpeechRecognition: mockSpeechRecognition,
        webkitSpeechRecognition: mockSpeechRecognition,
        cancelAnimationFrame: jest.fn(),
        requestAnimationFrame: jest.fn((cb) => setTimeout(cb, 0)),
        getComputedStyle: jest.fn(() => ({
          getPropertyValue: jest.fn(),
          boxSizing: 'border-box',
          paddingTop: '0px',
          paddingBottom: '0px',
          borderTopWidth: '0px',
          borderBottomWidth: '0px',
          lineHeight: 'normal',
          fontSize: '14px',
          fontFamily: 'Arial',
        })),
      };

      global.navigator = {
        ...originalNavigator,
        permissions: {
          query: jest.fn().mockResolvedValue({ state: 'granted' }),
        },
      };

      // Mock document APIs
      global.document = global.document || {};
      global.document.createRange =
        global.document.createRange ||
        jest.fn(() => ({
          setStart: jest.fn(),
          setEnd: jest.fn(),
          commonAncestorContainer: {
            nodeName: 'BODY',
            ownerDocument: document,
          },
        }));
    });

    afterEach(() => {
      // Restore original globals
      global.window = originalWindow;
      global.navigator = originalNavigator;
    });
    it('should render speech button when allowSpeech is true', () => {
      const { container } = render(<Sender allowSpeech />);
      const speechButton = container.querySelectorAll('.ant-sender-actions-btn');
      expect(speechButton).toHaveLength(2);
      fireEvent.click(speechButton[0]!);
      // Test onstart event
      expect(mockRecognition.onstart).toBeDefined();
      act(() => {
        if (mockRecognition) mockRecognition.onstart();
      });
      expect(container.querySelector('.ant-sender')).toBeTruthy();
    });
    it('should render speech button when allowSpeech is true with slot', () => {
      const { container } = render(
        <Sender allowSpeech slotConfig={[{ type: 'text', value: 'Prefix text' }]} />,
      );
      const speechButton = container.querySelectorAll('.ant-sender-actions-btn');
      expect(speechButton).toHaveLength(2);
      fireEvent.click(speechButton[0]!);
      // Test onstart event
      expect(mockRecognition.onstart).toBeDefined();
      act(() => {
        if (mockRecognition) mockRecognition.onstart();
      });
      expect(container.querySelector('.ant-sender')).toBeTruthy();
    });
    it('width no SpeechRecognition', () => {
      (global as any).window.SpeechRecognition = null;
      (global as any).window.webkitSpeechRecognition = null;
      (global as any).navigator = {
        permissions: {
          query: jest.fn().mockResolvedValue({ state: 'granted' }),
        },
      };
      const { container } = render(<Sender allowSpeech />);
      const speechButton = container.querySelectorAll('.ant-sender-actions-btn');
      expect(speechButton).toHaveLength(2);
      expect(container.querySelector('.ant-sender')).toBeTruthy();
    });
  });
});
