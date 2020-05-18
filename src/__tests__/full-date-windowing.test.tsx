import mayadates from '@drewsonne/maya-dates';
import FullDateWindowing from '../parser/full-date-windowing';
import Numeric from '../parser/tokens/numeric';
import linestart from '../parser/tokens/line-start';
import lineend from '../parser/tokens/line-end';

describe('full-date-windowing', () => {
  const streams = [
    [
      [
        linestart,
        mayadates.cr.getCalendarRound(10, 'Imix', 14, 'Pop'),
        new Numeric('10.1.1.3.1'),
        lineend
      ],
      1, 3,
      [10, 'Imix', 14, 'Pop'],
      [1, 3, 1, 1, 10]
    ],
    [
      [
        mayadates.cr.getCalendarRound(13, 'Imix', 4, 'Muwan'),
        new Numeric('1.1.2.1'),
        lineend
      ],
      0, 3,
      [13, 'Imix', 4, 'Muwan'],
      [1, 2, 1, 1]
    ]
  ];

  streams.forEach((args) => {
    const [stream, expectedStart, expectedLength, expectedCr, expectedLc] = args;
    it(`${stream} -> (${expectedCr} ${expectedLc} : ${expectedStart} + ${expectedLength})`, () => {
      const [start, result, length] = new FullDateWindowing(stream).run();
      const {cr, lc} = result;
      expect(start).toEqual(expectedStart);
      expect(length).toEqual(expectedLength);
      expect(cr).toEqual(mayadates.cr.getCalendarRound(...expectedCr));
      expect(lc.equal(new mayadates.lc.LongCount(...expectedLc))).toBeTruthy();
    });
  });
});
