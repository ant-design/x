import { render } from '@testing-library/react';
import React from 'react';
import XMarkdown from '../index';

describe('XMarkdown', () => {
  it('main', () => {
    const { getByText } = render(<XMarkdown />);
    expect(getByText('XMarkdown')).toBeInTheDocument();
  });
});
