import React from 'react';

import Welcome from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';

describe('welcome', () => {
  mountTest(() => <Welcome />);
  rtlTest(() => <Welcome />);
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
