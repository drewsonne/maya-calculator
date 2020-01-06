const linestart = require('../src/parser/tokens/line-start');
const lineend = require('../src/parser/tokens/line-end');
const commentstart = require('../src/parser/tokens/comment-start');
const Text = require('../src/parser/tokens/text');
const Numeric = require('../src/parser/tokens/numeric');
const Operator = require('../src/parser/tokens/operator');

const parser = require('../src/parser/calculator-parser');

describe('parse-raw-text', () => {
    let raw_texts = [
        [
            '8.19.10.11',
            [
                linestart,
                new Numeric('8.19.10.11'),
                lineend
            ]
        ],
        [
            `8.19.10.11 # (1) A long count date`,
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

    test.each(raw_texts)(
        '%s -> %s',
        (raw, expected_tokens) => {
            let results = new parser.PrimitiveCalculatorParser(raw).run();

            expect(results.length).toBe(expected_tokens.length);

            expect(results[0]).toBe(expected_tokens[0]);
            expect(results[results.length - 1]).toBe(expected_tokens[expected_tokens.length - 1]);

            for (let i = 1; i < expected_tokens.length - 1; i++) {
                let token = results[i];
                let expected_token = expected_tokens[i];
                expect(token.equal(expected_token)).toBeTruthy();
                expect(expected_token.equal(token)).toBeTruthy();
            }
        }
    );

});
