import React from 'react';
import { render } from '../../../tests/utils';
import ActionsAudio from '../ActionsAudio';
import { ACTIONS_ITEM_STATUS } from '../ActionsItem';

describe('ActionsAudio', () => {
  it('renders default status', () => {
    const { container } = render(<ActionsAudio />);
    expect(container.querySelector('.ant-actions-audio')).toBeInTheDocument();
  });

  it('renders loading status', () => {
    const { container } = render(<ActionsAudio status={ACTIONS_ITEM_STATUS.LOADING} />);
    expect(container.querySelector('.ant-actions-audio')).toBeInTheDocument();
  });

  it('renders running status', () => {
    const { container } = render(<ActionsAudio status={ACTIONS_ITEM_STATUS.RUNNING} />);
    expect(container.querySelector('.ant-actions-audio-running')).toBeInTheDocument();
  });

  it('renders error status', () => {
    const { container } = render(<ActionsAudio status={ACTIONS_ITEM_STATUS.ERROR} />);
    expect(container.querySelector('.ant-actions-audio-error')).toBeInTheDocument();
  });

  it('supports custom className and prefixCls', () => {
    const { container } = render(<ActionsAudio className="my-audio" prefixCls="my-prefix" />);
    expect(container.querySelector('.my-audio')).toBeTruthy();
    expect(container.querySelector('.my-prefix-audio')).toBeTruthy();
  });

  it('supports rootClassName', () => {
    const { container } = render(<ActionsAudio rootClassName="root-audio" />);
    expect(container.querySelector('.root-audio')).toBeTruthy();
  });
});
