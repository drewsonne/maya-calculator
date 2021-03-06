var jDate = require('./jdate.js')

describe('gregorian to julian', () => {
  let dates = [

    ['01/03/-100', '-100-02-27'],
    ['02/03/-100', '-100-02-28'],
    ['03/03/-100', '-100-03-01'],

    ['29/02/0100', '0100-02-27'],
    ['01/03/0100', '0100-02-28'],
    ['02/03/0100', '0100-03-01'],

    ['28/02/0200', '0200-02-27'],
    ['29/02/0200', '0200-02-28'],
    ['01/03/0200', '0200-03-01'],

    ['28/02/0300', '0300-02-28'],
    ['29/02/0300', '0300-03-01'],
    ['01/03/0300', '0300-03-02'],

    ['28/02/0500', '0500-03-01'],
    ['29/02/0500', '0500-03-02'],
    ['01/03/0500', '0500-03-03'],

    ['28/02/0600', '0600-03-02'],
    ['29/02/0600', '0600-03-03'],
    ['01/03/0600', '0600-03-04'],
    ['28/02/0700', '0700-03-03'],
    ['29/02/0700', '0700-03-04'],
    ['01/03/0700', '0700-03-05'],
    ['28/02/0900', '0900-03-04'],
    ['29/02/0900', '0900-03-05'],
    ['01/03/0900', '0900-03-06'],
    ['28/02/1000', '1000-03-05'],
    ['29/02/1000', '1000-03-06'],
    ['01/03/1000', '1000-03-07'],
    ['28/02/1100', '1100-03-06'],
    ['29/02/1100', '1100-03-07'],
    ['01/03/1100', '1100-03-08'],
    ['28/02/1300', '1300-03-07'],
    ['29/02/1300', '1300-03-08'],
    ['01/03/1300', '1300-03-09'],
    ['28/02/1400', '1400-03-08'],
    ['29/02/1400', '1400-03-09'],
    ['01/03/1400', '1400-03-10'],
    ['28/02/1500', '1500-03-09'],
    ['29/02/1500', '1500-03-10'],
    ['01/03/1500', '1500-03-11'],
    ['04/10/1582', '1582-10-14'],
    ['05/10/1582', '1582-10-15'],
    ['06/10/1582', '1582-10-16'],
    ['18/02/1700', '1700-02-28'],
    ['19/02/1700', '1700-03-01'],
    ['28/02/1700', '1700-03-10'],
    ['29/02/1700', '1700-03-11'],
    ['01/03/1700', '1700-03-12'],
    ['17/02/1800', '1800-02-28'],
    ['18/02/1800', '1800-03-01'],
    ['28/02/1800', '1800-03-11'],
    ['29/02/1800', '1800-03-12'],
    ['01/03/1800', '1800-03-13'],
    ['16/02/1900', '1900-02-28'],
    ['17/02/1900', '1900-03-01'],
    ['28/02/1900', '1900-03-12'],
    ['29/02/1900', '1900-03-13'],
    ['01/03/1900', '1900-03-14'],
    ['15/02/2100', '2100-02-28'],
    ['16/02/2100', '2100-03-01'],
    ['28/02/2100', '2100-03-13'],
    ['29/02/2100', '2100-03-14'],
  ]
  test.each(dates)(
    'J(%s) -> G(%s)',
    (j_date_raw, g_date_raw) => {
      let g_date = new Date(g_date_raw)
      let j_date = jDate.julianFromGregorian(
        new MockJDate(
          g_date.getUTCFullYear(),
          g_date.getUTCMonth(),
          g_date.getUTCDate(),
          g_date_raw,
        ),
      )

      expect(j_date.toString()).toBe(j_date_raw)
    },
  )
})

class MockJDate {
  constructor (year, month, day, raw) {
    this.year = year
    this.month = month + 1
    this.day = day

    if (raw[0] === '-') {
      this.year = -this.year
    }
  }
}
