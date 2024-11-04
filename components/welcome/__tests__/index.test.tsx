import React from 'react';

import Welcome, { type WelcomeProps } from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render } from '../../../tests/utils';

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
