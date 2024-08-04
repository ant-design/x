import React from 'react';

import Prompts from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';

describe('bubble', () => {
  mountTest(() => <Prompts />);
  rtlTest(() => <Prompts />);
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

});
