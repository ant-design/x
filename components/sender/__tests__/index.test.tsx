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
});
