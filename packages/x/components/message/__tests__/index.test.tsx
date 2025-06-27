import React from 'react';

import Message from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { act, fireEvent, render } from '../../../tests/utils';

describe('message', () => {
  mountTest(() => <Message content="test" />);
  rtlTest(() => <Message content="test" />);
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('Message component work', () => {
    const { container } = render(<Message content="test" />);
    const element = container.querySelector<HTMLDivElement>('.ant-message');
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });

  it('Message support content', () => {
    const { container } = render(<Message content="hello world" />);
    const element = container.querySelector<HTMLDivElement>('.ant-message');
    expect(element?.textContent).toBe('hello world');
  });

  it('Message support content with ReactNode', () => {
    const { container } = render(
      <Message content={<span className="test-content">hello world</span>} />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-message .test-content');
    expect(element?.textContent).toBe('hello world');
  });

  it('Message Should support className & style', () => {
    const { container } = render(
      <Message content="test" className="test-className" style={{ backgroundColor: 'green' }} />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-message');
    expect(element).toHaveClass('test-className');
    expect(element).toHaveStyle({ backgroundColor: 'green' });
  });

  it('Message support type sup', () => {
    const { container } = render(<Message content="1" type="sup" />);
    const element = container.querySelector<HTMLDivElement>('.ant-message .ant-message-sup');
    expect(element?.textContent).toBe('1');
  });

  it('Message support type think', () => {
    const { container } = render(
      <Message type="think" content={'hello world'} title={'thinking'} />,
    );
    const elementTitle = container.querySelector<HTMLDivElement>(
      '.ant-message .ant-message-think-title',
    );
    const element = container.querySelector<HTMLDivElement>(
      '.ant-message .ant-message-think-content',
    );
    expect(elementTitle?.textContent).toBe('thinking');
    expect(element?.textContent).toBe('hello world');
  });

  it('Message support type source', () => {
    const { container } = render(
      <Message
        type="source"
        title={'search sources'}
        items={[
          {
            label: '1. Source 1',
            src: '#',
          },
          {
            label: '2. Source 2',
            src: '#',
          },
        ]}
      />,
    );
    const element = container.querySelector<HTMLDivElement>(
      '.ant-message .ant-message-source-title',
    );
    expect(element?.textContent).toBe('search sources');
    fireEvent.click(container.querySelector('.ant-message-source-title-wrapper')!);
    act(() => {
      jest.runAllTimers();
    });
    expect(container.querySelectorAll('.ant-message-source-list-item').length).toBe(2);
  });

  it('Message support type system', () => {
    const { container } = render(<Message type="system" content={'hello world'} />);
    const element = container.querySelector<HTMLDivElement>(
      '.ant-message .ant-message-system-content',
    );
    expect(element?.textContent).toBe('hello world');
  });
});
