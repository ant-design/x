/* eslint-disable global-require */

describe('x-sdk import', () => {
  it('exports modules correctly', () => {
    const XRequest = require('../src/index').XRequest;
    const XStream = require('../src/index').XStream;
    const useXChat = require('../src/index').useXChat;
    const useXConversations = require('../src/index').useXConversations;
    const experimentalAgent = require('../src/index').experimentalAgent;
    const runAgentProvider = require('../src/index').runAgentProvider;
    expect(XRequest).toBeTruthy();
    expect(XStream).toBeTruthy();
    expect(useXChat).toBeTruthy();
    expect(useXConversations).toBeTruthy();
    expect(experimentalAgent.createAgentStore).toBeTruthy();
    expect(runAgentProvider).toBeTruthy();
  });
});
