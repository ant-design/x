import React from 'react';

import Attachments, { type AttachmentsProps } from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render, waitFakeTimer } from '../../../tests/utils';

describe('attachments.drag', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const renderAttachments = (props?: AttachmentsProps) => {
    return <Attachments beforeUpload={() => false} {...props} />;
  };

  it('drag and drop', async () => {
    const onChange = jest.fn();
    const { container } = render(
      renderAttachments({
        onChange,
        children: <div />,
        getDropContainer: () => document.body,
      }),
    );

    // Drag into document
    fireEvent.dragEnter(document.body);
    fireEvent.dragOver(document.body);

    expect(document.querySelector('.ant-attachment-drop-area-on-body')).toBeTruthy();
    expect(document.querySelector('.ant-attachment-placeholder')).toBeTruthy();
    expect(document.querySelector('.ant-attachment-placeholder-drag-in')).toBeFalsy();

    // Drag into placeholder
    fireEvent.dragEnter(document.querySelector('.ant-attachment-placeholder')!);
    fireEvent.dragOver(document.querySelector('.ant-attachment-placeholder')!);
    expect(document.querySelector('.ant-attachment-placeholder-drag-in')).toBeTruthy();

    // Drag out placeholder
    fireEvent.dragLeave(document.querySelector('.ant-attachment-placeholder')!);
    expect(document.querySelector('.ant-attachment-placeholder-drag-in')).toBeFalsy();

    // Drop on placeholder
    fireEvent.dragEnter(document.body);
    fireEvent.drop(document.querySelector('.ant-attachment-placeholder')!);
    expect(document.querySelector('.ant-attachment-drop-area')).toBeFalsy();
  });
});
