import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render, screen } from '@testing-library/react';
import Suggestion from '../index';

describe('Sender Component', () => {
  mountTest(() => <Suggestion items={[]} />);

  rtlTest(() => <Suggestion items={[]} />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render input element', () => {
    const {container} =  render(<Suggestion items={[]} />);
    const inputElement = container.querySelector('.ant-input') as HTMLInputElement; // Assuming no placeholder
    expect(inputElement).toBeInTheDocument();
  });

  it('should display Suggestion when trigger character is typed', () => {
    const items = [
      { id: '1', label: 'Suggestion 1', value: 'suggestion1' },
      { id: '2', label: 'Suggestion 2', value: 'suggestion2' },
    ];
   const {container} = render(<Suggestion items={items} triggerCharacter="&" />);

    const inputElement = container.querySelector('.ant-input') as HTMLInputElement;
    fireEvent.input(inputElement, { target: { value: '&' } });

    expect(screen.getByText('Suggestion 1')).toBeInTheDocument();
    expect(screen.getByText('Suggestion 2')).toBeInTheDocument();
  });

  it('should call onClick of suggestion item when clicked', () => {
    const onClickMock = jest.fn();
    const items = [{ id: '1', label: 'Suggestion 1', value: 'suggestion1', onClick: onClickMock }];
    const { container } = render(<Suggestion items={items} triggerCharacter="&" />);

    const inputElement = container.querySelector('.ant-input') as HTMLInputElement;
    fireEvent.input(inputElement, { target: { value: '&' } });

    const suggestionItem = screen.getByText('Suggestion 1');
    fireEvent.mouseDown(suggestionItem);

    expect(onClickMock).toHaveBeenCalled();
  });

  it('should update input value when suggestion is selected', () => {
    const items = [{ id: '1', label: 'Suggestion 1', value: 'suggestion1' }];
    const { container } = render(<Suggestion items={items} triggerCharacter="&" />);

    const inputElement = container.querySelector('.ant-input') as HTMLInputElement;
    fireEvent.input(inputElement, { target: { value: '&' } });

    const suggestionItem = screen.getByText('Suggestion 1');
    fireEvent.mouseDown(suggestionItem);

    expect(inputElement.value).toBe('suggestion1');
  });
});
