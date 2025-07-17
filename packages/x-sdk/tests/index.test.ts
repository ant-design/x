/* eslint-disable global-require */

describe('x-sdk import', () => {
  it('exports modules correctly', () => {
    const XRequest = require('../src/index').XRequest;
    const XStream = require('../src/index').XStream;
    const XModel = require('../src/index').XModel;
    expect(XRequest).toBeTruthy();
    expect(XStream).toBeTruthy();
    expect(XModel).toBeTruthy();
  });
});
