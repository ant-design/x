import { render } from '@testing-library/react';
import React from 'react';
import LocaleProvider, { ANT_MARK } from '../index';
import zh_CN from '../zh_CN';
import en_US from '../en_US';
import LocaleContext from '../context';
import useLocale from '../useLocale';

// ===================== test for LocaleProvider =====================
describe('LocaleProvider', () => {
  it('should render children correctly', () => {
    const { container } = render(
      <LocaleProvider locale={zh_CN}>
        <div className="test-child">Test</div>
      </LocaleProvider>,
    );
    expect(container.querySelector('.test-child')).toBeTruthy();
  });

  it('should pass locale to context', () => {
    const TestComponent = () => {
      return (
        <LocaleProvider locale={zh_CN}>
          <div className="test-child">Test</div>
        </LocaleProvider>
      );
    };
    const { container } = render(<TestComponent />);
    expect(container.querySelector('.test-child')).toBeTruthy();
  });

  it('should provide correct locale values through context', () => {
    let contextValue: any;
    const TestConsumer = () => {
      contextValue = React.useContext(LocaleContext);
      return <div />;
    };

    render(
      <LocaleProvider locale={zh_CN}>
        <TestConsumer />
      </LocaleProvider>,
    );

    expect(contextValue).toBeDefined();
    expect(contextValue.locale).toBe('zh-cn');
    expect(contextValue.Mermaid).toBeDefined();
    expect(contextValue.Mermaid.copySuccess).toBe('复制成功');
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
        <LocaleProvider locale={zh_CN} _ANT_MARK__="wrong-mark">
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
        <LocaleProvider locale={zh_CN} _ANT_MARK__={ANT_MARK}>
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
        <LocaleProvider locale={zh_CN} _ANT_MARK__="wrong-mark">
          <div />
        </LocaleProvider>,
      );

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});

// ===================== test for useLocale hook =====================
describe('useLocale', () => {
  it('should return default locale when no provider', () => {
    const TestComponent = () => {
      const [mermaidLocale] = useLocale('Mermaid');
      return <div data-testid="locale">{mermaidLocale.copySuccess}</div>;
    };

    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('locale').textContent).toBe('Copy Success!');
  });

  it('should return locale from provider', () => {
    const TestComponent = () => {
      const [mermaidLocale] = useLocale('Mermaid');
      return <div data-testid="locale">{mermaidLocale.copySuccess}</div>;
    };

    const { getByTestId } = render(
      <LocaleProvider locale={zh_CN}>
        <TestComponent />
      </LocaleProvider>,
    );
    expect(getByTestId('locale').textContent).toBe('复制成功');
  });

  it('should return locale code', () => {
    const TestComponent = () => {
      const [, localeCode] = useLocale('Mermaid');
      return <div data-testid="locale-code">{localeCode}</div>;
    };

    const { getByTestId } = render(
      <LocaleProvider locale={zh_CN}>
        <TestComponent />
      </LocaleProvider>,
    );
    expect(getByTestId('locale-code').textContent).toBe('zh-cn');
  });

  it('should merge locale data correctly', () => {
    const customLocale = {
      ...en_US,
      Mermaid: {
        ...en_US.Mermaid,
        copySuccess: 'Custom Copy Success',
      },
    };

    const TestComponent = () => {
      const [mermaidLocale] = useLocale('Mermaid');
      return (
        <div>
          <div data-testid="custom">{mermaidLocale.copySuccess}</div>
          <div data-testid="original">{mermaidLocale.copyText}</div>
        </div>
      );
    };

    const { getByTestId } = render(
      <LocaleProvider locale={customLocale}>
        <TestComponent />
      </LocaleProvider>,
    );
    expect(getByTestId('custom').textContent).toBe('Custom Copy Success');
    expect(getByTestId('original').textContent).toBe('Copy Code');
  });

  it('should handle missing Mermaid config in locale', () => {
    const incompleteLocale = {
      locale: 'en',
    };

    const TestComponent = () => {
      const [mermaidLocale] = useLocale('Mermaid');
      return <div data-testid="locale">{mermaidLocale.copySuccess}</div>;
    };

    const { getByTestId } = render(
      <LocaleProvider locale={incompleteLocale as any}>
        <TestComponent />
      </LocaleProvider>,
    );
    expect(getByTestId('locale').textContent).toBe('Copy Success!');
  });
});

// ===================== test for locale data =====================
describe('Locale Data', () => {
  it('should have complete zh_CN locale', () => {
    expect(zh_CN.locale).toBe('zh-cn');
    expect(zh_CN.Mermaid).toBeDefined();
    expect(zh_CN.Mermaid.copySuccess).toBe('复制成功');
    expect(zh_CN.Mermaid.copyText).toBe('复制代码');
    expect(zh_CN.Mermaid.zoomInText).toBe('缩小');
    expect(zh_CN.Mermaid.zoomOutText).toBe('放大');
    expect(zh_CN.Mermaid.zoomResetText).toBe('重置');
    expect(zh_CN.Mermaid.downloadText).toBe('下载');
  });

  it('should have complete en_US locale', () => {
    expect(en_US.locale).toBe('en');
    expect(en_US.Mermaid).toBeDefined();
    expect(en_US.Mermaid.copySuccess).toBe('Copy Success!');
    expect(en_US.Mermaid.copyText).toBe('Copy Code');
    expect(en_US.Mermaid.zoomInText).toBe('Zoom In');
    expect(en_US.Mermaid.zoomOutText).toBe('Zoom Out');
    expect(en_US.Mermaid.zoomResetText).toBe('Reset');
    expect(en_US.Mermaid.downloadText).toBe('Download');
  });
});
