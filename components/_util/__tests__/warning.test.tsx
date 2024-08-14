import React from 'react';
import { render } from '@testing-library/react';
import warning, { devUseWarning, WarningContext } from '../warning';

const TestUnStrictProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [strict] = React.useState(false);
  const context = React.useMemo(() => ({ strict }), [strict]);
  return <WarningContext.Provider value={context}>{props.children}</WarningContext.Provider>;
};

describe('Test warning', () => {
  let spy: jest.SpyInstance;

  beforeAll(() => {
    spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    spy.mockRestore();
  });

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    spy.mockReset();
  });

  describe('process.env.NODE_ENV !== "production"', () => {
    it('If `false`, exec `console.error`', async () => {
      warning(false, 'error');

      expect(spy).toHaveBeenCalled();
    });

    it('If `true`, do not exec `console.error`', async () => {
      warning(true, 'error message');

      expect(spy).not.toHaveBeenCalled();
    });
    it('should show warning when using devUseWarning', async () => {
      const App = () => {
        // Don't use dynamic import to fixed issue: TypeError: Cannot read properties of null (reading 'useContext')
        const devWarning = devUseWarning('Test');
        devWarning(false, 'usage', 'test message');
        devWarning.deprecated(false, 'old prop', 'new prop');
        return null;
      };
      render(<App />);

      expect(spy).toHaveBeenCalledWith('Warning: [antd: Test] test message');
      expect(spy).toHaveBeenCalledWith(
        'Warning: [antd: Test] `old prop` is deprecated. Please use `new prop` instead.',
      );
      expect(spy).toHaveBeenCalledTimes(2);
    });
    it('should show warning once, when strict is `false`.', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const App = () => {
        const devWarning = devUseWarning('Test');
        devWarning.deprecated(false, 'old prop', 'new prop');
        devWarning.deprecated(false, 'old prop', 'new prop');
        return null;
      };
      render(
        <TestUnStrictProvider>
          <App />
        </TestUnStrictProvider>,
      );
      expect(warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('process.env.NODE_ENV === "production"', () => {
    let prevEnv: string | undefined;
    const mockNodeEnv = () => {
      prevEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
    };
    const restoreNodeEnv = () => {
      process.env.NODE_ENV = prevEnv;
    };
    beforeEach(() => {
      mockNodeEnv();
    });
    afterEach(() => {
      restoreNodeEnv();
    });
    it('Whether `true` or `false`, do not exec `console.error`', async () => {
      warning(false, 'error message');
      expect(spy).not.toHaveBeenCalled();

      warning(true, 'error message');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not show warning when using devUseWarning', async () => {
      const App = () => {
        const devWarning = devUseWarning('Test');
        devWarning(false, 'usage', 'test message');
        devWarning.deprecated(false, 'old prop', 'new prop');
        return null;
      };
      render(<App />);

      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
