import React from 'react';

import Attachments, { type PromptsProps } from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render } from '../../../tests/utils';

import type { PromptProps } from '../interface';

// Mock data
const mockData: PromptProps[] = [
  {
    key: '1',
    label: 'Label 1',
    description: 'Description 1',
    icon: <span>Icon 1</span>,
    disabled: false,
  },
  {
    key: '2',
    label: 'Label 2',
    description: 'Description 2',
    icon: <span>Icon 2</span>,
    disabled: true,
  },
];

const mockProps: PromptsProps = {
  title: 'Test Title',
  items: mockData,
  onItemClick: jest.fn(),
  prefixCls: 'custom',
};

describe('bubble', () => {
  mountTest(() => <Attachments />);
  rtlTest(() => <Attachments />);
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render the title', () => {
    const { getByText } = render(<Attachments title={mockProps.title} />);
    const titleElement = getByText(/test title/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('should render the correct number of buttons', () => {
    const { getAllByRole } = render(<Attachments items={mockProps.items} />);
    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(mockData.length);
  });

  it('should render the labels and descriptions', () => {
    const { getByText } = render(<Attachments {...mockProps} />);
    mockData.forEach((item) => {
      const label = getByText(item.label as string);
      const description = getByText(item.description as string);
      expect(label).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });

  it('should call onItemClick when a button is clicked', () => {
    const { getByText } = render(<Attachments {...mockProps} />);
    const button = getByText(/label 1/i);
    fireEvent.click(button);
    expect(mockProps.onItemClick).toHaveBeenCalledWith({ data: mockData[0] });
  });

  it('should disable buttons correctly', () => {
    const { getByText } = render(<Attachments items={mockProps.items} />);
    const disabledButton = getByText(/label 2/i).closest('button');
    expect(disabledButton).toBeDisabled();
  });

  it('should render icons', () => {
    const { getByText } = render(<Attachments items={mockProps.items} />);
    mockData.forEach((item) => {
      if (item.icon) {
        const icon = getByText(`Icon ${item.key}`);
        expect(icon).toBeInTheDocument();
      }
    });
  });
});
