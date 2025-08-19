
import { fireEvent, render} from '@testing-library/react';
import ActionsFeedback from '../ActionsFeedback';
import React from 'react';

describe('Actions.Feedback Component', () => {
  it('should render feedback component', () => {
    const { container } = render(<ActionsFeedback />);
    expect(container).toBeInTheDocument();
  });

  it('should toggle like value when clicked', () => {
    const mockOnChange = jest.fn();
    const { rerender, container } = render(
      <ActionsFeedback value="default" onChange={mockOnChange} />,
    );

     const feedbackTrigger = container.querySelector('.ant-actions-feedback-item-like')!;
    // First click - should set to like
    fireEvent.click(feedbackTrigger);
    expect(mockOnChange).toHaveBeenCalledWith('like');
    expect(mockOnChange).toHaveBeenCalledTimes(1);

    // Rerender with like value
    rerender(<ActionsFeedback value="like" onChange={mockOnChange} />);

    // Second click - should set to empty
     const feedbackActiveTrigger = container.querySelector('.ant-actions-feedback-item-like-active')!;
    fireEvent.click(feedbackActiveTrigger);
    expect(mockOnChange).toHaveBeenCalledWith('default');
    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });

  it('should toggle dislike value when clicked', () => {
    const mockOnChange = jest.fn();
    const { rerender, container } = render(
      <ActionsFeedback value="default" onChange={mockOnChange} />,
    );

    const feedbackTrigger = container.querySelector('.ant-actions-feedback-item-dislike')!;
    // First click - should set to dislike
    fireEvent.click(feedbackTrigger);
    expect(mockOnChange).toHaveBeenCalledWith('dislike');

    // Rerender with dislike value
    rerender(<ActionsFeedback value="dislike" onChange={mockOnChange} />);
    const feedbackActiveTrigger = container.querySelector('.ant-actions-feedback-item-dislike-active')!;
    // Second click - should set to empty
    fireEvent.click(feedbackActiveTrigger);
    expect(mockOnChange).toHaveBeenCalledWith('default');
    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });
});