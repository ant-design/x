import React from 'react';

import Chatbox from '..';
import { render } from '../../../tests/utils';

describe('Chatbox', () => {
  it('basic', () => {
    render(<Chatbox content="test" />);
  });
});
