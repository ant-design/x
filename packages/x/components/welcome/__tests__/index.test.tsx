import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import Welcome from '..';

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
