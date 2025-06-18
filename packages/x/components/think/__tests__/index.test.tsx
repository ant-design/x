import React from 'react';

import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render, waitFakeTimer } from '../../../tests/utils';
import Think from '../index';

describe('Think Component', () => {
  mountTest(() => <Think />);

  rtlTest(() => <Think />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('Think component work', () => {
    const { container } = render(<Think content={'test'} statusText={'test'} />);
    const element = container.querySelector<HTMLDivElement>('.ant-think');
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });

  it('Think support content', () => {
    const { container } = render(<Think content="think content" statusText={'thinking'} />);
    const element = container.querySelector<HTMLDivElement>('.ant-think .ant-think-content');
    expect(element?.textContent).toBe('think content');
    const elementStatus = container.querySelector<HTMLDivElement>(
      '.ant-think .ant-think-status-text',
    );
    expect(elementStatus?.textContent).toBe('thinking');
  });

  it('Think support content with ReactNode', () => {
    const { container } = render(
      <Think
        content={<span className="test-content">think content</span>}
        statusText={<span className="test-status">thinking</span>}
      />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-think .test-content');
    expect(element?.textContent).toBe('think content');
    const elementStatus = container.querySelector<HTMLDivElement>('.ant-think .test-status');
    expect(elementStatus?.textContent).toBe('thinking');
  });

  it('Think Should support className & style', () => {
    const { container } = render(
      <Think
        content="test"
        statusText="test"
        className="test-className"
        style={{ backgroundColor: 'green' }}
      />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-think');
    expect(element).toHaveClass('test-className');
    expect(element).toHaveStyle({ backgroundColor: 'green' });
  });

  it('Think support loading', () => {
    const { container } = render(
      <Think content="think content" statusText={'thinking'} loading={true} />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-think .anticon-loading');
    expect(element).toBeTruthy();
  });

  it('Think support expand', async () => {
    const { container } = render(
      <Think content="think content" statusText={'thinking'} defaultExpand={false} />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-think .ant-think-content');
    expect(element).toBeNull();
    fireEvent.click(container.querySelector('.ant-think-status-wrapper')!);
    await waitFakeTimer();
    expect(container.querySelector('.ant-think .ant-think-content')).toBeTruthy();
  });
});
