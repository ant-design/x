import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import Suggestion, { type SuggestionProps } from '../index';

describe('Suggestion Component', () => {
  mountTest(() => <Suggestion items={[]} />);

  rtlTest(() => <Suggestion items={[]} />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const MockSuggestion = (props: SuggestionProps) => (
    <Suggestion {...props}>
      {({ onTrigger, onKeyDown }) => (
        <input
          onKeyDown={(e) => {
            if (e.key === '/') {
              onTrigger(e.key);
            } else if (e.key === 'Delete') {
              onTrigger(false);
            }
            onKeyDown(e);
          }}
        />
      )}
    </Suggestion>
  );

  it('should display Suggestion when trigger character is typed', () => {
    const onSelect = jest.fn();

    const items = [
      { label: 'Suggestion 1', value: 'suggestion1' },
      { label: 'Suggestion 2', value: 'suggestion2' },
    ];
    const { container } = render(<MockSuggestion items={items} onSelect={onSelect} />);

    fireEvent.keyDown(container.querySelector('input')!, { key: '/' });

    expect(screen.getByText('Suggestion 1')).toBeInTheDocument();
    expect(screen.getByText('Suggestion 2')).toBeInTheDocument();

    const suggestionItem = screen.getByText('Suggestion 1');
    fireEvent.click(suggestionItem);

    expect(onSelect).toHaveBeenCalledWith('suggestion1', [
      { label: 'Suggestion 1', value: 'suggestion1' },
    ]);
  });

  it('trigger onSelect', async () => {
    const onSelect = jest.fn();
    const onOpenChange = jest.fn();
    const items = (key: string) => [{ label: `Suggestion ${key}`, value: `suggestion${key}` }];
    const { container } = render(
      <MockSuggestion items={items} onSelect={onSelect} onOpenChange={onOpenChange} />,
    );
    fireEvent.keyDown(container.querySelector('input')!, { key: '/' });
    expect(screen.getByText('Suggestion /')).toBeInTheDocument();
  });

  it('onTrigger support false to close', () => {
    const onOpenChange = jest.fn();
    const items = [
      { label: 'Suggestion 1', value: 'suggestion1', icon: <div className="bamboo" /> },
    ];
    const { container } = render(<MockSuggestion items={items} onOpenChange={onOpenChange} />);

    // Open
    fireEvent.keyDown(container.querySelector('input')!, { key: '/' });
    expect(onOpenChange).toHaveBeenCalledWith(true);

    // Close
    onOpenChange.mockReset();
    fireEvent.keyDown(container.querySelector('input')!, { key: 'Delete' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('open controlled', () => {
    const items = [
      { label: 'Suggestion 1', value: 'suggestion1', icon: <div className="bamboo" /> },
    ];
    render(<MockSuggestion items={items} open />);

    expect(document.querySelector('.bamboo')).toBeTruthy();
  });

  describe('arrow', () => {
    it('select', () => {
      const onSelect = jest.fn();
      const items = [
        { label: 'Suggestion 1', value: 'suggestion1' },
        {
          label: 'Suggestion 2',
          value: 'suggestion2',
          children: [{ label: 'Suggestion 3', value: 'suggestion3' }],
        },
      ];
      const { container } = render(<MockSuggestion items={items} onSelect={onSelect} />);

      fireEvent.keyDown(container.querySelector('input')!, { key: '/' });
      fireEvent.keyDown(container.querySelector('input')!, { key: 'ArrowDown' });
      fireEvent.keyDown(container.querySelector('input')!, { key: 'ArrowRight' });
      expect(
        document.querySelector(
          '.ant-cascader-menu-item-active:not(.ant-cascader-menu-item-expand)',
        )!.textContent,
      ).toBe('Suggestion 3');
    });

    it('cancel', () => {
      const onOpenChange = jest.fn();
      const items = [
        { label: 'Suggestion 1', value: 'suggestion1' },
        {
          label: 'Suggestion 2',
          value: 'suggestion2',
          children: [{ label: 'Suggestion 3', value: 'suggestion3' }],
        },
      ];
      const { container } = render(<MockSuggestion items={items} onOpenChange={onOpenChange} />);

      fireEvent.keyDown(container.querySelector('input')!, { key: '/' });
      expect(onOpenChange).toHaveBeenCalledWith(true);

      fireEvent.keyDown(container.querySelector('input')!, { key: 'ArrowUp' });
      fireEvent.keyDown(container.querySelector('input')!, { key: 'ArrowRight' });
      fireEvent.keyDown(container.querySelector('input')!, { key: 'ArrowLeft' });

      // Only one .ant-cascader-menu-item-active
      expect(document.querySelectorAll('.ant-cascader-menu-item-active')).toHaveLength(1);
      expect(document.querySelector('.ant-cascader-menu-item-active')!.textContent).toBe(
        'Suggestion 2',
      );
      expect(document.querySelector('.ant-select-dropdown-hidden')).toBeFalsy();

      onOpenChange.mockReset();
      fireEvent.keyDown(container.querySelector('input')!, { key: 'Escape' });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
