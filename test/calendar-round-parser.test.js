const CalendarRoundParser = require('../src/parser/calendar-round-parser');
const Numeric = require('../src/parser/tokens/numeric');
const Text = require('../src/parser/tokens/text');
const mayaDate = require('@drewsonne/maya-dates');

describe('parse-complex-calendar-rounds', () => {
  let dates = [
    [[new Numeric('4'), new Text('Ajaw'), new Numeric('8'), new Text('Kumk\'u')]],
    [[new Text('4Ajaw'), new Numeric('8'), new Text('Kumk\'u')]],
    [[new Numeric('4'), new Text('Ajaw'), new Text('8Kumk\'u')]],
    [[new Text('4Ajaw'), new Text('8Kumk\'u')]],
  ];
  let expected = mayaDate.cr.getCalendarRound(4, 'Ajaw', 8, 'Kumk\'u');
  dates.forEach((raw_date) => {
    it(`${raw_date}`, () => {
      let parsed_date = new CalendarRoundParser(...raw_date).run();
      expect(parsed_date).not.toBeUndefined();
      expect(
        parsed_date.equal(expected)
      ).toBeTruthy();
    });
  });
});