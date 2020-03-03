import mayadate from '@drewsonne/maya-dates';
import Operator from '../parser/tokens/operator';
import OperatorWindowing from '../parser/operator-windowing';
import linestart from '../parser/tokens/line-start';
import lineend from '../parser/tokens/line-end';

describe('window-operators', () => {
  const parsedInput = [
    [
      [
        linestart,
        new mayadate.lc.LongCount(1, 1, 1, 1,),
        new Operator('+'),
        new mayadate.lc.LongCount(1, 1),
        lineend
      ],
      [' 0. 1. 1. 2. 2', 1, 3]
    ],
    [
      [
        linestart,
        new mayadate.lc.LongCount(1, 1, 1, 1,),
        new Operator('+'),
        lineend,
        linestart,
        new mayadate.lc.LongCount(1, 1),
        lineend
      ],
      [' 0. 1. 1. 2. 2', 1, 5]
    ]
  ];

  parsedInput.forEach((args, i) => {
    const lines = args[0];
    const [expected, expectedStart, expectedLength] = args[1];
    it(`${lines} -> ${expected}`, () => {
      const [start, result, length] = new OperatorWindowing(lines).run();
      expect(start).toBe(expectedStart);
      expect(length).toBe(expectedLength);
      expect(
        `${result}`
      ).toBe(
        expected
      );
    });
  });
});
