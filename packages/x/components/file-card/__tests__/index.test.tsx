import React from 'react';

import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { render } from '../../../tests/utils';
import FileCard from '../index';

describe('FileCard Component', () => {
  mountTest(() => <FileCard />);

  rtlTest(() => <FileCard />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('FileCard component work', () => {
    const { container } = render(<FileCard name="test-file.txt" size={1024} />);
    const element = container.querySelector<HTMLDivElement>('.ant-file-card');
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });

  it('FileCard support name and size', () => {
    const { container } = render(<FileCard name="test-file.txt" size={1024} />);
    const namePrefix = container.querySelector<HTMLDivElement>('.ant-file-card-file-name-prefix');
    expect(namePrefix?.textContent).toBe('test-file');
    const nameSuffix = container.querySelector<HTMLDivElement>('.ant-file-card-file-name-suffix');
    expect(nameSuffix?.textContent).toBe('.txt');
    const size = container.querySelector<HTMLDivElement>('.ant-file-card-file-description');
    expect(size?.textContent).toBe('1 KB');
  });

  it('FileCard support description', () => {
    const { container } = render(
      <FileCard name="test-file.txt" description={'test description'} />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-file-card-file-description');
    expect(element?.textContent).toBe('test description');
  });

  it('FileCard support image', () => {
    const { container } = render(
      <FileCard
        name="image-file.png"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-file-card-image');
    expect(element).toBeTruthy();
  });

  it('FileCard support mask', () => {
    const { container } = render(
      <FileCard name="test-file.txt" size={1024} mask={<div className="test-mask" />} />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-file-card-file-mask .test-mask');
    expect(element).toBeTruthy();
  });

  it('FileCard support type', () => {
    const { container } = render(
      <FileCard
        name="image-file.png"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        type="file"
      />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-file-card-image');
    expect(element).toBeFalsy();
    const file = container.querySelector<HTMLDivElement>('.ant-file-card-file');
    expect(file).toBeTruthy();
  });
});
