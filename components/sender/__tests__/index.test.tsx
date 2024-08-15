import React from 'react';

import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import Sender from '../index';
import { fireEvent, render } from '@testing-library/react';

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

  it('onSubmit', () => {
    const onSubmit = jest.fn();
    const { container } = render(<Sender value="bamboo" onSubmit={onSubmit} />);
    fireEvent.click(container.querySelectorAll('button')[1]);
    expect(onSubmit).toHaveBeenCalledWith('bamboo');
  });

  it('onCancel', () => {
    const onCancel = jest.fn();
    const { container } = render(<Sender loading onCancel={onCancel} />);
    fireEvent.click(container.querySelectorAll('button')[1]);
    expect(onCancel).toHaveBeenCalled();
  });

  it('onClear', () => {
    const onChange = jest.fn();
    const { container } = render(<Sender onChange={onChange} />);

    fireEvent.change(container.querySelector('textarea')!, { target: { value: 'bamboo' } });
    expect(onChange).toHaveBeenCalledWith('bamboo');

    fireEvent.click(container.querySelector('button')!);
    expect(onChange).toHaveBeenCalledWith('');
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
});
