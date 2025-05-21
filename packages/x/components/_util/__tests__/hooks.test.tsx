import React from 'react';
import { render } from '../../../tests/utils';
import useProxyImperativeHandle from '../hooks/use-proxy-imperative-handle';

const TestComponent = React.forwardRef((_, ref) => {
  const divRef = React.useRef(null);
  useProxyImperativeHandle(ref, () => ({
    nativeElement: divRef.current!,
    testMethod: () => 'testMethod called',
    testProperty: 'testProperty',
  }));
  return <div ref={divRef}>Hello World!</div>;
});

describe('useProxyImperativeHandle', () => {
  it('should correctly proxy the nativeElement and init methods', () => {
    const ref = React.createRef<any>();
    render(<TestComponent ref={ref} />);
    expect(ref.current).toBeDefined();
    expect(ref.current?.testMethod()).toBe('testMethod called');
    expect(ref.current?.testProperty).toBe('testProperty');
    expect(ref.current?.nativeElement).toBeDefined();
    expect(ref.current?.focus === ref.current?.nativeElement.focus).toBeTruthy();
  });
});
