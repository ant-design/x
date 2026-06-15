import getIsMobile from '@rc-component/util/lib/isMobile';
import { renderHook } from '../../../tests/utils';
import useMobile from '../hooks/use-mobile';

jest.mock('@rc-component/util/lib/isMobile', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockGetIsMobile = getIsMobile as jest.Mock;

describe('useMobile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true after mount when on mobile device', () => {
    mockGetIsMobile.mockReturnValue(true);
    const { result } = renderHook(() => useMobile());
    expect(result.current).toBe(true);
  });

  it('should return false after mount when on desktop device', () => {
    mockGetIsMobile.mockReturnValue(false);
    const { result } = renderHook(() => useMobile());
    expect(result.current).toBe(false);
  });

  it('should call getIsMobile from @rc-component/util', () => {
    mockGetIsMobile.mockReturnValue(false);
    renderHook(() => useMobile());
    expect(mockGetIsMobile).toHaveBeenCalled();
  });
});
