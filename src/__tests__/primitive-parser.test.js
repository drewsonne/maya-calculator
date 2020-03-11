import mayadate from '@drewsonne/maya-dates';
import linestart from '../parser/tokens/line-start';
import lineend from '../parser/tokens/line-end';
import commentstart from '../parser/tokens/comment-start';
import Text from '../parser/tokens/text';
import Operator from '../parser/tokens/operator';
import PrimitiveCalculatorParser from '../parser/calculator-parser-primitive';

describe('parse-raw-text', () => {
  const rawTexts = [
    [
      '0.8.19.10.11',
      [
        linestart,
        new mayadate.lc.LongCount(11, 10, 19, 8),
        lineend
      ]
    ],
    [
      '8.19.10.11 # (1) A long count date',
      [
        linestart,
        new mayadate.lc.LongCount(11, 10, 19, 8),
        commentstart,
        new Text('(1)'),
        new Text('A'),
        new Text('long'),
        new Text('count'),
        new Text('date'),
        lineend
      ]
    ],
    [
      `8.19.10.11 # (1) A long count date
+7.13 # (2) A distance number

9.17.5.0.0
# (3) Do some calculations`,
      [
        linestart,
        new mayadate.lc.LongCount(11, 10, 19, 8),
        commentstart,
        new Text('(1)'),
        new Text('A'),
        new Text('long'),
        new Text('count'),
        new Text('date'),
        lineend,
        linestart,
        new Operator('+'),
        new mayadate.lc.DistanceNumber(13, 7),
        commentstart,
        new Text('(2)'),
        new Text('A'),
        new Text('distance'),
        new Text('number'),
        lineend,
        linestart,
        lineend,
        linestart,
        new mayadate.lc.LongCount(0, 0, 5, 17, 9),
        lineend,
        linestart,
        commentstart,
        new Text('(3)'),
        new Text('Do'),
        new Text('some'),
        new Text('calculations'),
        lineend
      ]
    ],
  ];

  rawTexts.forEach((args) => {
    const [raw, expectedTokens] = args;
    it(`${raw} -> ${expectedTokens}`, () => {
      const results = new PrimitiveCalculatorParser(raw).run();

      expect(results).toHaveLength(expectedTokens.length);

      expect(results[0]).toBe(expectedTokens[0]);
      expect(results[results.length - 1]).toBe(expectedTokens[expectedTokens.length - 1]);

      for (let i = 1; i < expectedTokens.length - 1; i += 1) {
        const token = results[i];
        const expectedToken = expectedTokens[i];
        const result = token.equal(expectedToken);
        expect(result).toBeTruthy();
        expect(expectedToken.equal(token)).toBeTruthy();
      }
    });
  });
});
