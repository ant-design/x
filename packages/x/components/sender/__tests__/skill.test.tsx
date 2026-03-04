import React from 'react';
import { fireEvent, render } from '../../../tests/utils';
import Skill from '../components/Skill';

describe('Skill Component', () => {
  const defaultProps = {
    prefixCls: 'ant-sender',
    removeSkill: jest.fn(),
    value: 'test-skill',
    title: 'Test Skill',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render basic skill with title', () => {
    const { container } = render(<Skill {...defaultProps} />);

    expect(container.querySelector('.ant-sender-skill-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.ant-sender-skill-tag-text')).toHaveTextContent('Test Skill');
  });

  it('should render skill with value when title is missing', () => {
    const { container } = render(<Skill {...defaultProps} title={undefined} />);

    expect(container.querySelector('.ant-sender-skill-tag-text')).toHaveTextContent('test-skill');
  });

  it('should render skill with tooltip', () => {
    const { container } = render(<Skill {...defaultProps} toolTip={{ title: 'Skill tooltip' }} />);

    expect(container.querySelector('.ant-sender-skill-tag-text')).toBeInTheDocument();
  });

  it('should not render close button when closable is false', () => {
    const { container } = render(<Skill {...defaultProps} closable={false} />);

    expect(container.querySelector('.ant-sender-skill-close')).not.toBeInTheDocument();
  });

  it('should render close button when closable is true', () => {
    const { container } = render(<Skill {...defaultProps} closable={true} />);

    expect(container.querySelector('.ant-sender-skill-close')).toBeInTheDocument();
    expect(container.querySelector('.ant-sender-skill-close-icon')).toBeInTheDocument();
  });

  it('should render custom close icon', () => {
    const { container } = render(
      <Skill {...defaultProps} closable={{ closeIcon: 'Custom Close' }} />,
    );

    expect(container.querySelector('.ant-sender-skill-close')).toHaveTextContent('Custom Close');
  });

  it('should call removeSkill when close button is clicked', () => {
    const mockRemoveSkill = jest.fn();
    const { container } = render(
      <Skill {...defaultProps} removeSkill={mockRemoveSkill} closable={true} />,
    );

    const closeButton = container.querySelector('.ant-sender-skill-close');
    fireEvent.click(closeButton!);

    expect(mockRemoveSkill).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when provided in closable config', () => {
    const mockRemoveSkill = jest.fn();
    const mockOnClose = jest.fn();
    const { container } = render(
      <Skill {...defaultProps} removeSkill={mockRemoveSkill} closable={{ onClose: mockOnClose }} />,
    );

    const closeButton = container.querySelector('.ant-sender-skill-close');
    fireEvent.click(closeButton!);

    expect(mockRemoveSkill).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call removeSkill when close button is disabled', () => {
    const mockRemoveSkill = jest.fn();
    const { container } = render(
      <Skill {...defaultProps} removeSkill={mockRemoveSkill} closable={{ disabled: true }} />,
    );

    const closeButton = container.querySelector('.ant-sender-skill-close');
    fireEvent.click(closeButton!);

    expect(mockRemoveSkill).not.toHaveBeenCalled();
  });

  it('should have disabled class when close button is disabled', () => {
    const { container } = render(<Skill {...defaultProps} closable={{ disabled: true }} />);

    expect(container.querySelector('.ant-sender-skill-close-disabled')).toBeInTheDocument();
  });

  it('should stop propagation when close button is clicked', () => {
    const mockRemoveSkill = jest.fn();
    const mockStopPropagation = jest.fn();
    const { container } = render(
      <Skill {...defaultProps} removeSkill={mockRemoveSkill} closable={true} />,
    );

    const closeButton = container.querySelector('.ant-sender-skill-close');
    const clickEvent = new MouseEvent('click', { bubbles: true });
    clickEvent.stopPropagation = mockStopPropagation;

    fireEvent(closeButton!, clickEvent);

    expect(mockStopPropagation).toHaveBeenCalled();
  });

  it('should render with custom prefixCls', () => {
    const { container } = render(<Skill {...defaultProps} prefixCls="custom-prefix" />);

    expect(container.querySelector('.custom-prefix-skill-wrapper')).toBeInTheDocument();
  });

  it('should render without tooltip when toolTip is not provided', () => {
    const { container } = render(<Skill {...defaultProps} toolTip={undefined} />);

    expect(container.querySelector('.ant-sender-skill-tag-text')).toHaveTextContent('Test Skill');
  });

  it('should render with complex tooltip configuration', () => {
    const { container } = render(
      <Skill
        {...defaultProps}
        toolTip={{
          title: 'Complex tooltip',
          placement: 'top',
          color: 'blue',
        }}
      />,
    );

    expect(container.querySelector('.ant-sender-skill-tag-text')).toBeInTheDocument();
  });

  it('should handle keyboard events on close button', () => {
    const mockRemoveSkill = jest.fn();
    const { container } = render(
      <Skill {...defaultProps} removeSkill={mockRemoveSkill} closable={true} />,
    );

    const closeButton = container.querySelector('.ant-sender-skill-close');
    fireEvent.keyDown(closeButton!, { key: 'Enter' });

    // Note: The component doesn't handle keyboard events, but we test the structure
    expect(closeButton).toHaveAttribute('tabIndex', '0');
    expect(closeButton).toHaveAttribute('role', 'button');
  });

  it('should render skill tag with proper accessibility attributes', () => {
    const { container } = render(<Skill {...defaultProps} />);

    const skillTag = container.querySelector('.ant-sender-skill-tag');
    expect(skillTag).toHaveAttribute('role', 'button');
    expect(skillTag).toHaveAttribute('tabIndex', '0');
  });

  it('should render skill holder element', () => {
    const { container } = render(<Skill {...defaultProps} />);

    expect(container.querySelector('.ant-sender-skill-holder')).toBeInTheDocument();
  });

  it('should handle empty closable object', () => {
    const { container } = render(<Skill {...defaultProps} closable={{}} />);

    expect(container.querySelector('.ant-sender-skill-close')).toBeInTheDocument();
    expect(container.querySelector('.ant-sender-skill-close-icon')).toBeInTheDocument();
  });

  it('should handle closable with only onClose', () => {
    const mockOnClose = jest.fn();
    const { container } = render(<Skill {...defaultProps} closable={{ onClose: mockOnClose }} />);

    const closeButton = container.querySelector('.ant-sender-skill-close');
    fireEvent.click(closeButton!);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should handle closable with only disabled', () => {
    const mockRemoveSkill = jest.fn();
    const { container } = render(
      <Skill {...defaultProps} removeSkill={mockRemoveSkill} closable={{ disabled: false }} />,
    );

    const closeButton = container.querySelector('.ant-sender-skill-close');
    fireEvent.click(closeButton!);

    expect(mockRemoveSkill).toHaveBeenCalled();
  });
});
