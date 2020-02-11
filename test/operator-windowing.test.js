import mayadate from "@drewsonne/maya-dates";
import Operator from '../src/parser/tokens/operator';
import OperatorWindowing from "../src/parser/operator-windowing";
import linestart from '../src/parser/tokens/line-start';
import lineend from '../src/parser/tokens/line-end';

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
      ' 0. 1. 1. 2. 2'
    ],
    [
      [
        linestart,
        new mayadate.lc.LongCount(1, 1, 1, 1,),
        new Operator('+'),
        lineend,
        linestart,
        new mayadate.lc.LongCount(1, 1)
      ],
      ' 0. 1. 1. 2. 2'
    ]
  ];

  parsedInput.forEach((args, i) => {
    const lines = args[0];
    const expected = args[1];
    it(`${lines} -> ${expected}`, () => {
      let [start, result, length] = new OperatorWindowing(lines).run();
      expect(
        `${result.equals()}`
      ).toBe(
        expected
      );
    });
  });
});