import StreamingTokenizer from '../StreamingTokenizer';

describe('StreamingTokenizer', () => {
  describe('tokenize', () => {
    it('should tokenize Chinese text by delimiters', () => {
      const text = '这是一个测试文本。包含多个句子！还有问号？';
      const result = StreamingTokenizer.tokenize(text);

      expect(result.tokens).toEqual(['这是一个测试文本。', '包含多个句子！', '还有问号？']);
    });

    it('should tokenize English text by delimiters', () => {
      const text = 'This is a test. It has multiple sentences! And questions?';
      const result = StreamingTokenizer.tokenize(text, {
        customDelimiters: ['.', '!', '?'],
      });

      expect(result.tokens).toEqual([
        'This is a test.',
        'It has multiple sentences!',
        'And questions?',
      ]);
    });

    it('should tokenize by words when enabled', () => {
      const text = '这是一个测试文本';
      const result = StreamingTokenizer.tokenize(text, { enableWordLevel: true });

      expect(result.tokens).toEqual(['这', '是', '一', '个', '测', '试', '文', '本']);
    });

    it('should tokenize by characters when enabled', () => {
      const text = '测试文本';
      const result = StreamingTokenizer.tokenize(text, { enableCharLevel: true });

      expect(result.tokens).toEqual(['测', '试', '文', '本']);
    });

    it('should handle custom delimiters', () => {
      const text = 'part1|part2|part3';
      const result = StreamingTokenizer.tokenize(text, {
        customDelimiters: ['|'],
      });

      expect(result.tokens).toEqual(['part1|', 'part2|', 'part3']);
    });
  });

  describe('createStreamProcessor', () => {
    it('should process tokens with delays', async () => {
      const text = '测试文本';
      const tokens: string[] = [];

      const processor = StreamingTokenizer.createStreamProcessor(
        text,
        { enableWordLevel: true },
        (token) => tokens.push(token),
      );

      await processor.process();

      expect(tokens).toEqual(['测', '试', '文', '本']);
    });
  });
});
