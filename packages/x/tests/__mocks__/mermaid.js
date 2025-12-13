// Mock mermaid to avoid syntax issues in tests
const mermaid = {
  initialize: jest.fn(),
  render: jest.fn().mockResolvedValue({
    svg: '<svg><text>Mocked Mermaid Diagram</text></svg>',
  }),
  parse: jest.fn().mockResolvedValue(true),
};

module.exports = mermaid;
