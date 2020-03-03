import linestart from '../src/parser/tokens/line-start';
import lineend from '../src/parser/tokens/line-end';
import commentstart from '../src/parser/tokens/comment-start';
import Text from '../src/parser/tokens/text';
import Numeric from '../src/parser/tokens/numeric';
import Operator from '../src/parser/tokens/operator';
import PrimitiveCalculatorParser from '../src/parser/calculator-parser-primitive';

describe('parse-raw-text', () => {
  const rawTexts = [
    [
      '8.19.10.11',
      [
        linestart,
        new Numeric('8.19.10.11'),
        lineend
      ]
    ],
    [
      '8.19.10.11 # (1) A long count date',
      [
        linestart,
        new Numeric('8.19.10.11'),
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
        new Numeric('8.19.10.11'),
        commentstart,
        new Text('(1)'),
        new Text('A'),
        new Text('long'),
        new Text('count'),
        new Text('date'),
        lineend,
        linestart,
        new Operator('+'),
        new Numeric('7.13'),
        commentstart,
        new Text('(2)'),
        new Text('A'),
        new Text('distance'),
        new Text('number'),
        lineend,
        linestart,
        lineend,
        linestart,
        new Numeric('9.17.5.0.0'),
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
        expect(token.equal(expectedToken)).toBeTruthy();
        expect(expectedToken.equal(token)).toBeTruthy();
      }
    });
  });
});
