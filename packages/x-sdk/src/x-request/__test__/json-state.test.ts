import XRequest from '../index';

const baseURL = 'https://api.example.com/v1/chat';
const errorResponse = {
  success: false,
  name: 'ValidationError',
  message: 'Invalid input parameters',
};

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('XRequest JSON failure state', () => {
  it.each([true, false])('finishes a business failure with callbacks=%s', async (withCallbacks) => {
    const callbackStates: boolean[] = [];
    const onError = jest.fn(() => {
      callbackStates.push(request.isRequesting);
    });
    const onSuccess = jest.fn();
    const onUpdate = jest.fn();
    const response = jsonResponse(errorResponse);
    const fetch = jest.fn().mockResolvedValue(response);
    const request = XRequest(baseURL, {
      manual: true,
      fetch,
      callbacks: withCallbacks ? { onError, onSuccess, onUpdate } : undefined,
    });

    request.run();
    expect(request.isRequesting).toBe(true);
    await request.asyncHandler;

    expect(request.isRequesting).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onUpdate).not.toHaveBeenCalled();
    expect(callbackStates).toEqual(withCallbacks ? [false] : []);
    if (withCallbacks) {
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ name: errorResponse.name, message: errorResponse.message }),
        errorResponse,
        response.headers,
      );
    }
  });

  it('keeps a new request started in onError active until its response arrives', async () => {
    let resolveResponse!: (response: Response) => void;
    const pendingResponse = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });
    const callbackStates: boolean[] = [];
    const onError = jest.fn(() => {
      callbackStates.push(request.isRequesting);
      request.run();
    });
    const onSuccess = jest.fn();
    const fetch = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse(errorResponse))
      .mockReturnValueOnce(pendingResponse);
    const request = XRequest(baseURL, { manual: true, fetch, callbacks: { onError, onSuccess } });

    request.run();
    const firstRequest = request.asyncHandler;
    await firstRequest;

    expect(callbackStates).toEqual([false]);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(request.isRequesting).toBe(true);
    resolveResponse(jsonResponse({ success: true }));
    await request.asyncHandler;
    expect(request.isRequesting).toBe(false);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it.each(['response', 'body'])(
    'keeps a newer request active when an older business failure is awaiting its %s',
    async (pendingStage) => {
      let resolveOlderResponse!: (response: Response) => void;
      let resolveNewerResponse!: (response: Response) => void;
      let resolveOlderBody!: (body: unknown) => void;
      let notifyBodyStarted!: () => void;
      const olderResponse = jsonResponse(errorResponse);
      const pendingOlderResponse = new Promise<Response>((resolve) => {
        resolveOlderResponse = resolve;
      });
      const pendingNewerResponse = new Promise<Response>((resolve) => {
        resolveNewerResponse = resolve;
      });
      const pendingOlderBody = new Promise((resolve) => {
        resolveOlderBody = resolve;
      });
      const bodyStarted = new Promise<void>((resolve) => {
        notifyBodyStarted = resolve;
      });
      jest.spyOn(olderResponse, 'json').mockImplementation(() => {
        notifyBodyStarted();
        return pendingOlderBody;
      });
      const callbackStates: boolean[] = [];
      const onError = jest.fn(() => {
        callbackStates.push(request.isRequesting);
      });
      const onSuccess = jest.fn();
      const onUpdate = jest.fn();
      const fetch = jest
        .fn()
        .mockReturnValueOnce(pendingOlderResponse)
        .mockReturnValueOnce(pendingNewerResponse);
      const request = XRequest(baseURL, {
        manual: true,
        fetch,
        callbacks: { onError, onSuccess, onUpdate },
      });

      request.run();
      const olderRequest = request.asyncHandler;
      if (pendingStage === 'body') {
        resolveOlderResponse(olderResponse);
        await bodyStarted;
      }
      request.run();
      const newerRequest = request.asyncHandler;
      expect(request.isRequesting).toBe(true);

      resolveOlderResponse(olderResponse);
      resolveOlderBody(errorResponse);
      await olderRequest;

      expect(request.asyncHandler).toBe(newerRequest);
      expect(request.isRequesting).toBe(true);
      expect(callbackStates).toEqual([true]);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ name: errorResponse.name, message: errorResponse.message }),
        errorResponse,
        olderResponse.headers,
      );
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onUpdate).not.toHaveBeenCalled();

      resolveNewerResponse(jsonResponse({ success: true }));
      await newerRequest;
      expect(request.isRequesting).toBe(false);
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledTimes(1);
    },
  );
});
