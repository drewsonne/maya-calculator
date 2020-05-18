import mayadates from '@drewsonne/maya-dates';
import FullDateParser from '../parser/full-date-parser';
import Numeric from '../parser/tokens/numeric';
import lineend from '../parser/tokens/line-end';

describe('full-date-parser', () => {
  const streams = [
    [
      [
        mayadates.cr.getCalendarRound(5, 'Imix', 9, 'Sek'),
        new Numeric('1.1.1.1.1')
      ],
      '5 Imix 9 Sek  1. 1. 1. 1. 1'
    ],
    [
      [
        mayadates.cr.getCalendarRound(5, 'Imix', 9, 'Sek'),
        new mayadates.factory.LongCountFactory().parse('1.1.1.1.1'),
        lineend
      ],
      'null'
    ]
  ];
  streams.forEach((args) => {
    const [stream, expected] = args;
    it(`${stream} -> ${expected}`, () => {
      const result = new FullDateParser(...stream).run();
      expect(`${result}`).toEqual(expected);
    });
  });
});
