var model = require('./model.js')

test('parse long-count date', () => {
  let date = new model.LongCount('8.7.6.5.4.3.2.1')

  expect(date.is_valid()).toBeTruthy()

  expect(date.k_in).toBe(1)
  expect(date.winal).toBe(2)
  expect(date.tun).toBe(3)
  expect(date.k_atun).toBe(4)
  expect(date.bak_tun).toBe(5)
  expect(date.piktun).toBe(6)
  expect(date.kalabtun).toBe(7)
  expect(date.kinchiltun).toBe(8)

  expect(date.compute()).toBeUndefined()

  expect(date.get_date_sections(0)).toBe(
    1)
  expect(date.get_date_sections(4)).toBe(
    5)

  expect(date.toString()).toBe(
    ' 8. 7. 6. 5. 4. 3. 2. 1')
})

test('modify long-count date', () => {
  let date = new model.LongCount('5.4.3.2.1').
    set_date_sections(3, 10)

  expect(date.toString()).toBe(
    ' 5.10. 3. 2. 1')
})

test('magnitude of long-count', () => {
  let date = new model.LongCount('1')

  expect(date.total_k_in()).toBe(1)

  date.winal = 1
  expect(date.total_k_in()).toBe(21)
})

describe('parse calendar-round', () => {
  let sources = [
    '2 Ak\'bal 6 Muwan',
    '2 Ak\'bal 6Muwan',
    '2Ak\'bal 6 Muwan',
    '2Ak\'bal 6Muwan']
  let parser = new model.CalendarRoundFactory()
  test.each(sources)(
    '%s',
    (source) => {
      let cr = parser.parse(source)
      expect(cr.toString().trim()).toBe('2 Ak\'bal 6 Muwan')
    })
})

test('parse components calendar-round', () => {
  let parser = new model.CalendarRoundFactory()

  let cr = parser.parse('6 Imix 4K\'ank\'in')
  expect(cr.total_days).toBe(7581)

  cr = parser.parse('13 Ajaw 3Sek')
  expect(cr.total_days).toBe(100)
})

describe('split calendar-round', () => {
  let crs = [
    ['6 Imix 4K\'ank\'in', ['6', 'Imix', '4', 'K\'ank\'in']],
    ['13 Ajaw 3Sek', ['13', 'Ajaw', '3', 'Sek']],
    ['2 Ak\'bal 6 Muwan', ['2', 'Ak\'bal', '6', 'Muwan']],
    ['* Imix 4K\'ank\'in', ['*', 'Imix', '4', 'K\'ank\'in']],
    ['13 * 3Sek', ['13', '*', '3', 'Sek']],
    ['2 Ak\'bal * Muwan', ['2', 'Ak\'bal', '*', 'Muwan']],
    ['13 Ajaw 3*', ['13', 'Ajaw', '3', '*']],
  ]

  let parser = new model.CalendarRoundFactory()
  test.each(crs)(
    '%s -> (%s)',
    (cr, expected_parts) => {
      let parts = parser.split(cr)
      for (let j = 0; j < expected_parts.length; j++) {
        expect(parts[j]).toBe(expected_parts[j])
      }
    })
})

test('partial match calendar-round', () => {
  let parser = new model.CalendarRoundFactory()
  let parts = parser.split('13 * 3Sek')
  let potentials = parser.partial_match(...parts)
  let tzolk_ins = []
  for (let i = 0; i < potentials.length; i++) {
    let potential = potentials[i]
    expect(potential.tzolk_in_coeff).toBe(13)
    expect(potential.haab_coeff).toBe(3)
    expect(potential.haab_month).toBe('Sek')
    tzolk_ins.push(potential.tzolk_in)
  }

  expect(tzolk_ins.length).toBe(new Set(tzolk_ins).size)
})

test('partial match long-count', () => {
  let parser = new model.LongCountFactory()
  expect(parser.is_partial('13.*.*.14.13')).toBeTruthy()
})

describe('maya date pattern-matcher', () => {
  let long_counts = [
    '13.0.6.14.13',
    '13.0.6.14.*',
    '13.0.6.*.13',
    '13.0.6.*.*',
    '13.0.*.14.13',
    '13.0.*.14.*',
    '13.0.*.*.13',
    '13.0.*.*.*',
    '13.*.6.14.13',
    '13.*.6.14.*',
    '13.*.6.*.13',
    '13.*.6.*.*',
    '13.*.*.14.13',
    '13.*.*.14.*',
    '13.*.*.*.13',
    '13.*.*.*.*',
    '*.*.*.*.*',
    '13.0.6.14.13',
  ]
  let double_dates = [
    '13 Ben 1 Ch\'en',
    '13Ben 1 Ch\'en',
    '13 Ben 1Ch\'en',
    '13Ben 1Ch\'en',
  ]

  let dates = []
  long_counts.forEach(function (lc) {
    double_dates.forEach(function (cr) {
      [`${lc} ${cr}`, `${cr} ${lc}`].forEach(function (full_date) {
        dates.push([full_date, cr, lc])
      })
    })
  })
  test.each(dates)(
    '%s/%s',
    (full_date, cr, lc) => {
      let matcher = new model.PatternMatcher(full_date)
      expect(matcher.has_calendar_round).toBeTruthy()
      expect(matcher.has_long_count).toBeTruthy()
      expect(matcher.calendar_round).toBe(cr)
      expect(matcher.long_count).toBe(lc)
    },
  )

  test.each(double_dates)(
    '%s',
    (cr) => {
      let matcher = new model.PatternMatcher(cr)
      expect(matcher.has_calendar_round).toBeTruthy()
      expect(matcher.calendar_round).toBe(cr)
      expect(matcher.has_long_count).toBeFalsy()
    },
  )

  test.each(long_counts)(
    '%s',
    (cr) => {
      let matcher = new model.PatternMatcher(cr)
      expect(matcher.has_long_count).toBeTruthy()
      expect(matcher.long_count).toBe(cr)
      expect(matcher.has_calendar_round).toBeFalsy()
    },
  )
})

test('cr thesholds', () => {
  expect(
    new model.LongCount('0.0.0.1.17').calendar_round.toString(),
  ).toBe('2 Kaban 0 Wo ')
  expect(
    new model.LongCount('0.0.0.2.17').calendar_round.toString(),
  ).toBe('9 Kaban 0 Sip ')
})

test('small lcs', () => {
  expect(
    new model.LongCount('10').calendar_round.toString(),
  ).toBe('1 Ok 18 Kumk\'u ')
  expect(
    new model.LongCount('15').calendar_round.toString(),
  ).toBe('6 Men 3 Wayeb ')
  expect(
    new model.LongCount('20').calendar_round.toString(),
  ).toBe('11 Ajaw 3 Pop ')
})

describe('maya to gregorian/julian', () => {
  let dates = [
    ['13.1.1.1.1', '23/9/2033 CE', 2463864],
    ['12.1.1.1.1', '21/6/1639 CE', 2319864],
    ['11.1.1.1.1', '18/3/1245 CE', 2175864],
    ['10.1.1.1.1', '14/12/850 CE', 2031864],
    ['9.1.1.1.1', '10/9/456 CE', 1887864],
    ['8.1.1.1.1', '8/6/62 CE', 1743864],
    ['7.1.1.1.1', '5/3/333 BCE', 1599864],
    ['6.1.1.1.1', '1/12/728 BCE', 1455864],
    ['5.1.1.1.1', '29/8/1122 BCE', 1311864],
    ['4.1.1.1.1', '26/5/1516 BCE', 1167864],
    ['3.1.1.1.1', '21/2/1910 BCE', 1023864],
    ['2.1.1.1.1', '29/8/1122 BCE', 879864],
    ['1.1.1.1.1', '26/5/1516 BCE', 735864],
    ['0.1.1.1.1', '21/2/1910 BCE', 591864],
  ]

  let corr = new model.CorrelationConstant()
  corr.setStatic(584283)

  test.each(dates)(
    '%s -> %s (%s)',
    (lc_raw, date, julian) => {
      let lc = new model.LongCount(lc_raw, undefined, corr)
      // expect(lc.gregorian).toBe(date)
      expect(lc.julianDay).toBe(julian)
    },
  )
})
