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
