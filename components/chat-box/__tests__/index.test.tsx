import React from 'react';

import ChatBox from '..';
import { render } from '../../../tests/utils';

describe('ChatBox', () => {
  it('basic', () => {
    render(<ChatBox />);
  });
});
