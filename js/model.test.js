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

test('parse calendar-round', () => {
  let sources = [
    '2 Ak\'bal 6 Muwan',
    '2 Ak\'bal 6Muwan',
    '2Ak\'bal 6 Muwan',
    '2Ak\'bal 6Muwan']
  let parser = new model.CalendarRoundFactory()
  for (let i = 0; i < sources.length; i++) {
    let cr = parser.parse(sources[i])
    expect(cr.toString()).toBe(
      '2 Ak\'bal 6 Muwan ')
  }
})

test('parse components calendar-round', () => {
  let parser = new model.CalendarRoundFactory()

  let cr = parser.parse('6 Imix 4K\'ank\'in')
  expect(cr.total_days).toBe(7581)

  cr = parser.parse('13 Ajaw 3Sek')
  expect(cr.total_days).toBe(100)
})

test('split calendar-round', () => {
  let crs = [
    '6 Imix 4K\'ank\'in',
    '13 Ajaw 3Sek',
    '2 Ak\'bal 6 Muwan ',
    '* Imix 4K\'ank\'in',
    '13 * 3Sek',
    '2 Ak\'bal * Muwan ',
    '13 Ajaw 3*',
  ]

  let expected = [
    ['6', 'Imix', '4', 'K\'ank\'in'],
    ['13', 'Ajaw', '3', 'Sek'],
    ['2', 'Ak\'bal', '6', 'Muwan'],
    ['*', 'Imix', '4', 'K\'ank\'in'],
    ['13', '*', '3', 'Sek'],
    ['2', 'Ak\'bal', '*', 'Muwan'],
    ['13', 'Ajaw', '3', '*'],
  ]

  let parser = new model.CalendarRoundFactory()
  for (let i = 0; i < crs.length; i++) {
    let cr = crs[i]
    let parts = parser.split(cr)
    let expected_parts = expected[i]
    for (let j = 0; j < expected_parts.length; j++) {
      expect(parts[j]).toBe(expected_parts[j])
    }
  }
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
    tzolk_ins.push(potential.tz)
  }

  expect(tzolk_ins.length).toBe(new Set(tzolk_ins).size)
})
