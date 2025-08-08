import React from 'react';

import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render, waitFakeTimer } from '../../../tests/utils';
import FileCard from '../index';

describe('FileCard Component', () => {
  mountTest(() => <FileCard name="test-file.txt" />);

  rtlTest(() => <FileCard name="test-file.txt" />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('FileCard component work', () => {
    const { container } = render(<FileCard name="test-file.txt" byte={1024} />);
    const element = container.querySelector<HTMLDivElement>('.ant-file-card');
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });

  it('FileCard support classnames and styles', () => {
    const { container } = render(<FileCard name="test-file.txt" byte={1024} classNames={{ name: 'custom-class' }} styles={{ name: { color: 'red' } }} />);
    const namePrefix = container.querySelector<HTMLDivElement>('.ant-file-card-file-name');
    expect(namePrefix).toHaveClass('custom-class');
    expect(namePrefix).toHaveStyle({color: 'red'});
  });

  it('FileCard support name and byte', () => {
    const { container } = render(<FileCard name="test-file.txt" byte={1024} />);
    const namePrefix = container.querySelector<HTMLDivElement>('.ant-file-card-file-name-prefix');
    expect(namePrefix?.textContent).toBe('test-file');
    const nameSuffix = container.querySelector<HTMLDivElement>('.ant-file-card-file-name-suffix');
    expect(nameSuffix?.textContent).toBe('.txt');
    const byte = container.querySelector<HTMLDivElement>('.ant-file-card-file-description');
    expect(byte?.textContent).toBe('1 KB');
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

  it('FileCard support audio', () => {
    const { container } = render(
      <FileCard
        name="audio-file.mp3"
        src="https://mdn.alipayobjects.com/cto_doraemon/afts/file/HFTcTLugiIAAAAAAgCAAAAgAehe3AQBr"
      />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-file-card-audio');
    expect(element).toBeTruthy();
  });

  it('FileCard support video', () => {
    const { container } = render(
      <FileCard
        name="video-file.mp4"
        src="https://mdn.alipayobjects.com/doraemon_plugin/afts/file/vl7tSa-m3jEAAAAAAAAAAAAAeur1AQBr"
      />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-file-card-video');
    expect(element).toBeTruthy();
  });

  it('FileCard support mask', () => {
    const { container } = render(
      <FileCard name="test-file.txt" byte={1024} mask={<div className="test-mask" />} />,
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

  it('FileCard support list', () => {
    const { container } = render(
      <FileCard.List
        items={[{
          name: 'excel-file.xlsx',
          byte: 1024,
        },
        {
          name: 'word-file.docx',
          byte: 1024,
        }]}
        removable
      />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-file-card-list');
    expect(element).toBeTruthy();
    expect(container.querySelectorAll('.ant-file-card').length).toBe(2);
  });

  it('FileCard support list remove', async () => {
    const { container } = render(
      <FileCard.List
        items={[{
          name: 'excel-file.xlsx',
          byte: 1024,
        },
        {
          name: 'word-file.docx',
          byte: 1024,
        }]}
        removable
      />,
    );
    expect(container.querySelectorAll('.ant-file-card-list-item')).toHaveLength(2);
    fireEvent.click(container.querySelector('.ant-file-card-list-remove')!);
    await waitFakeTimer();
    expect(container.querySelectorAll('.ant-file-card-list-motion-leave')).toHaveLength(1);
  });

  it('overflow: scrollX', () => {
    const { container } = render(
      <FileCard.List
        items={[{
          name: 'excel-file.xlsx',
          byte: 1024,
        },
        {
          name: 'word-file.docx',
          byte: 1024,
        }]}
        removable
        overflow='scrollX'
      />,
    );

    expect(container.querySelector('.ant-file-card-list-overflow-scrollX')).toBeTruthy();
  });

  it('FileCard list support overflow: scrollY', () => {
    const { container } = render(
      <FileCard.List
        items={[{
          name: 'excel-file.xlsx',
          byte: 1024,
        },
        {
          name: 'word-file.docx',
          byte: 1024,
        }]}
        removable
        overflow='scrollY'
      />,
    );

    expect(container.querySelector('.ant-file-card-list-overflow-scrollY')).toBeTruthy();
  });

  it('FileCard list support overflow: scrollY', () => {
    const { container } = render(
      <FileCard.List
        items={[{
          name: 'excel-file.xlsx',
          byte: 1024,
        },
        {
          name: 'word-file.docx',
          byte: 1024,
        }]}
        removable
        overflow='scrollY'
      />,
    );

    expect(container.querySelector('.ant-file-card-list-overflow-scrollY')).toBeTruthy();
  });

  it('FileCard list support extension', () => {
    const { container } = render(
      <FileCard.List
        items={[{
          name: 'excel-file.xlsx',
          byte: 1024,
        },
        {
          name: 'word-file.docx',
          byte: 1024,
        }]}
        removable
        extension={
          <div className="test-extension">test</div>
        }
      />,
    );

    expect(container.querySelector('.test-extension')).toBeTruthy();
  });
});
