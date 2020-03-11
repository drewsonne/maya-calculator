import ComplexCalculatorParser from '../parser/calculator-parser-complex';

test('parse-raw-text-to-complex', () => {
  const raw = `8.19.10.11 # (1) A long count date
+7.13 # (2) A distance number

9.17.5.0.0
# (3) Do some calculations`;

  const results = new ComplexCalculatorParser(raw).run();

  expect(`${results[0].get(0).comment}`).toBe('# (1) A long count date');
  expect(`${results[0]}`).toBe(' 0. 8.19.10.11');
  expect(`${results[1].get(1).comment}`).toBe('# (2) A distance number');
  expect(`${results[1]}`).toBe(' +   0. 0. 0. 7.13');
  expect(`${results[2]}`).toBe('');
  expect(`${results[3]}`).toBe(' 9.17. 5. 0. 0');
  expect(`${results[4]}`).toBe('# (3) Do some calculations');
});

describe('parse wildcards', () => {
  const dates = [
    [
      '* Imix 9 K\'ank\'in 13.0.7.2.1',
      '* Imix 9 K\'ank\'in 13. 0. 7. 2. 1'
    ],
    [
      `9.10.*.5.* * Chikchan *Sip # Hallo
* Imix 9 K'ank'in 13.0.7.2.1`,
      ' 9.10. *. 5. * * Chikchan * Sip,* Imix 9 K\'ank\'in 13. 0. 7. 2. 1'
    ],
  ];
  dates.forEach((args) => {
    const [raw, expected] = args;
    it(`${raw} -> ${expected}`, () => {
      const results = new ComplexCalculatorParser(raw).run();
      expect(`${results}`).toBe(expected);
    });
  });
});
