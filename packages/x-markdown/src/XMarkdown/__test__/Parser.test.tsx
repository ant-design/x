import { Parser, Renderer } from '../../index';

describe('Parser', () => {
  it('parse empty tokens', () => {
    const tokens: any[] = [];
    const parse = new Parser({ XRenderer: new Renderer() });
    expect(parse.parse(tokens)).toEqual([]);
  });

  it('parseInline empty tokens', () => {
    const tokens: any[] = [];
    const parse = new Parser({ XRenderer: new Renderer() });
    console.log('empty', parse.parse(tokens));
    expect(parse.parseInline(tokens)).toEqual([]);
  });

  it('parse unknown block type', () => {
    const token = [
      {
        type: 'unknown',
        text: 'unknown',
        raw: 'unknown',
      },
    ];
    const parse = new Parser({ XRenderer: new Renderer() });
    expect(parse.parse(token)).toEqual([]);
  });

  it('parseInline unknown type', () => {
    const token = [
      {
        type: 'unknown',
        text: 'unknown',
        raw: 'unknown',
      },
    ];
    const parse = new Parser({ XRenderer: new Renderer() });
    expect(parse.parseInline(token)).toEqual([]);
  });
});
