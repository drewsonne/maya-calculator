import CalendarRoundWindowing from "../parser/calendar-round-windowing";
import Text from '../parser/tokens/text';
import Numeric from '../parser/tokens/numeric';
import linestart from '../parser/tokens/line-start';
import lineend from '../parser/tokens/line-end';

describe('calendar-round-windowing', () => {
  const streams = [
    [
      [
        linestart,
        new Text('10Imix'),
        new Text('14Pop'),
        new Numeric('10.1.1.3.1'),
        lineend
      ],
      1, 2,
      '10 Imix 14 Pop'
    ],
    [
      [
        new Text('13Imix'),
        new Text('4Muwan'),
        new Numeric('1.1.2.1'),
        lineend
      ],
      0, 2,
      '13 Imix 4 Muwan'
    ]
  ];

  streams.forEach((args) => {
    const [stream, expectedStart, expectedLength, expectedCr] = args;
    it(`${stream} -> (${expectedCr} : ${expectedStart} + ${expectedLength})`, () => {
      const [start, result, length] = new CalendarRoundWindowing(stream).run();
      expect(start).toEqual(expectedStart);
      expect(length).toEqual(expectedLength);
      expect(`${result}`).toEqual(expectedCr);
    });
  });
});
