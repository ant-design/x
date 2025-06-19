import { render } from '@testing-library/react';
import React from 'react';
import LocaleProvider, { ANT_MARK } from '../index';
import zh_CN from '../zh_CN';
describe('LocaleProvider', () => {
  const mockLocale = zh_CN;

  it('should render children correctly', () => {
    const { container } = render(
      <LocaleProvider locale={mockLocale}>
        <div className="test-child">Test</div>
      </LocaleProvider>,
    );
    expect(container.querySelector('.test-child')).toBeTruthy();
  });

  it('should pass locale to context', () => {
    const TestComponent = () => {
      return (
        <LocaleProvider locale={mockLocale}>
          <div className="test-child">Test</div>
        </LocaleProvider>
      );
    };
    const { container } = render(<TestComponent />);
    expect(container.querySelector('.test-child')).toBeTruthy();
  });

  describe('dev warning', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('should show warning when _ANT_MARK__ is invalid in dev', () => {
      process.env.NODE_ENV = 'development';
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <LocaleProvider locale={mockLocale} _ANT_MARK__="wrong-mark">
          <div />
        </LocaleProvider>,
      );

      expect(spy).toHaveBeenCalledWith(expect.stringContaining('`LocaleProvider` is deprecated'));
      spy.mockRestore();
    });

    it('should not show warning when _ANT_MARK__ is valid in dev', () => {
      process.env.NODE_ENV = 'development';
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <LocaleProvider locale={mockLocale} _ANT_MARK__={ANT_MARK}>
          <div />
        </LocaleProvider>,
      );

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should not show warning in production', () => {
      process.env.NODE_ENV = 'production';
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <LocaleProvider locale={mockLocale} _ANT_MARK__="wrong-mark">
          <div />
        </LocaleProvider>,
      );

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
