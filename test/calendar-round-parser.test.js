import mayaDate from '@drewsonne/maya-dates';
import CalendarRoundParser from '../src/parser/calendar-round-parser';
import Numeric from '../src/parser/tokens/numeric';
import Text from '../src/parser/tokens/text';

describe('parse-complex-calendar-rounds', () => {
  const dates = [
    [[new Numeric('4'), new Text('Ajaw'), new Numeric('8'), new Text('Kumk\'u')]],
    [[new Text('4Ajaw'), new Numeric('8'), new Text('Kumk\'u')]],
    [[new Numeric('4'), new Text('Ajaw'), new Text('8Kumk\'u')]],
    [[new Text('4Ajaw'), new Text('8Kumk\'u')]],
  ];
  const expected = mayaDate.cr.getCalendarRound(4, 'Ajaw', 8, 'Kumk\'u');
  dates.forEach((args) => {
    const [rawDate] = args;
    it(`${rawDate}`, () => {
      const parsedDate = new CalendarRoundParser(...rawDate).run();
      expect(parsedDate).not.toBeUndefined();
      expect(
        parsedDate.equal(expected)
      ).toBeTruthy();
    });
  });
});
