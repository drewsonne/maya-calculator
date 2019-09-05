class LinkedListElement {
  constructor (younger_sibling) {
    this.younger_sibling = younger_sibling
  }

  sibling_by_type (sibling_type) {
    if (this.younger_sibling === undefined) {
      return undefined
    }
    if (this.younger_sibling instanceof sibling_type) {
      return this.younger_sibling
    }
    return this.younger_sibling.sibling_by_type(sibling_type)
  }
}

class MayaDate extends LinkedListElement {
  constructor (raw, younger_sibling) {
    super(younger_sibling)
    this.parse(raw)
  }

  parse (raw_string) {
    let parts = raw_string.split('#')
    if (parts.length > 0) {
      this.raw = parts[0].trim().replace(/[^\d.]+/, '').replace(/[.+]$/, '')
      this.parts = this.raw.split('.').reverse()
    }
    this.comment = (parts.length > 1) ? parts[1] : ''
  }

  compute () {
    return undefined
  }

  get_date_sections (number) {
    let part = this.parts[number]
    if (part === undefined) {
      return 0
    }
    return parseInt(part)
  }

  set_date_sections (number, value) {
    this.parts[number] = value.toString()
    this.raw = this.toString()
    return this
  }

  set k_in (new_k_in) {
    this.set_date_sections(0, new_k_in)
  }

  get k_in () {
    return this.get_date_sections(0)
  }

  set winal (new_winal) {
    this.set_date_sections(1, new_winal)
  }

  get winal () {
    return this.get_date_sections(1)
  }

  set tun (new_tun) {
    this.set_date_sections(2, new_tun)
  }

  get tun () {
    return this.get_date_sections(2)
  }

  set k_atun (new_k_atun) {
    this.set_date_sections(3, new_k_atun)
  }

  get k_atun () {
    return this.get_date_sections(3)
  }

  set bak_tun (new_bak_tun) {
    this.set_date_sections(4, new_bak_tun)
  }

  get bak_tun () {
    return this.get_date_sections(4)
  }

  set piktun (new_bak_tun) {
    this.set_date_sections(5, new_bak_tun)
  }

  get piktun () {
    return this.get_date_sections(5)
  }

  set kalabtun (new_bak_tun) {
    this.set_date_sections(6, new_bak_tun)
  }

  get kalabtun () {
    return this.get_date_sections(6)
  }

  set kinchiltun (new_bak_tun) {
    this.set_date_sections(7, new_bak_tun)
  }

  get kinchiltun () {
    return this.get_date_sections(7)
  }

  get calendar_round () {
    return new CalendarRound(this.total_k_in())
  }

  total_k_in () {
    return this.k_in +
      this.winal * 20 +
      this.tun * 360 +
      this.k_atun * 7200 +
      this.bak_tun * 144000 +
      this.piktun * 2880000 +
      this.kalabtun * 57600000 +
      this.kinchiltun * 1152000000
  }

  normalised_date_from_k_in (total_k_in) {
    let new_date = new LongCount('')
    new_date.k_in = total_k_in % 20
    new_date.winal = (total_k_in - new_date.total_k_in()) / 20 % 18
    new_date.tun = (total_k_in - new_date.total_k_in()) / 360 % 20
    new_date.k_atun = (total_k_in - new_date.total_k_in()) / 7200 % 20
    new_date.bak_tun = (total_k_in - new_date.total_k_in()) / 144000 % 20
    new_date.piktun = (total_k_in - new_date.total_k_in()) / 2880000 % 20
    new_date.kalabtun = (total_k_in - new_date.total_k_in()) / 57600000 % 20
    new_date.kinchiltun = (total_k_in - new_date.total_k_in()) / 1152000000 %
      20
    return new_date
  }

  normalise () {
    let cr = this.normalised_date_from_k_in(
      this.total_k_in())
    this.k_in = cr.k_in
    this.winal = cr.winal
    this.tun = cr.tun
    this.k_atun = cr.k_atun
    this.bak_tun = cr.bak_tun
    this.piktun = cr.piktun
    this.kalabtun = cr.kalabtun
    this.kinchiltun = cr.kinchiltun

    return this
  }

  toString () {
    let parts = this.parts.slice().reverse()

    let significant_digits = []
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i]
      if (part !== '0') {
        significant_digits = parts.slice(i)
        break
      }
    }

    for (let i = 0; i < significant_digits.length; i++) {
      significant_digits[i] = significant_digits[i].toString()
      if (significant_digits[i].length < 2) {
        significant_digits[i] = ' ' + significant_digits[i]
      }
    }
    return significant_digits.join('.')
  }
}

class LongCount extends MayaDate {

  constructor (raw, younger_sibling) {
    super(raw, younger_sibling)
    this.date_pattern = /(\d+\.?)+/
  }

  is_valid () {
    return this.date_pattern.test(this.toString())
  }

  spans () {
    return $(`
        <div class="row">
            <div class="col-3  calendar_round">
                ${new CalendarRound(this.total_k_in())}
            </div>
            <div class="col-1  calendar_round_position">
                ${new CalendarRound(this.total_k_in()).total_days}
            </div>
            <div class="col-4  long_count">
                ${this.toString()}
            </div>
            <div class="col-4  comment">${this.comment}</div>
        </div>
      `)
  }
}

class DistanceNumber extends MayaDate {
  constructor (raw, younger_sibling) {
    super(raw, younger_sibling)
    if (raw.length > 1) {
      this.sign = (raw[0] === '+') ? 1 : -1
    }
  }

  get long_count () {
    return this.sibling_by_type(LongCount)
  }

  compute () {
    let result = this.long_count.total_k_in() +
      (this.total_k_in() * this.sign)

    return this.normalised_date_from_k_in(result)
  }

  spans () {
    let distance_string = (this.sign === 1 ? '+' : '-') + this.toString()
    let separator_length = Math.max(
      distance_string.length,
      this.long_count.toString().length,
    )

    return $(
      `<div class="row">
            <div class="col-3  calendar_round"></div>
            <div class="col-1  calendar_round_position"></div>
            <div class="col-4  distance_number">
                ${distance_string}
            </div>
            <div class="col-4  comment">${this.comment}</div>
        </div>
        <div class="row">
            <div class="col-3  calendar_round"></div>
            <div class="col-1  calendar_round_position"></div>
            <div class="col-4  long_count">
                ${'-'.repeat(separator_length)}
            </div>
            <div class="col-4  comment"></div>
        </div>`,
    )
  }
}

class Comment extends LinkedListElement {
  constructor (line, younger_sibling) {
    super(younger_sibling)
    this.comment = line.slice(1)
  }

  spans () {
    return $(`
        <div class="row">
            <div class="col-4 "></div>
            <div class="col-8  comment">
                <span class="comment">
                    ${this.comment}
                </span>
            </div>
        </div>
      `)
  }

  compute () {
    return undefined
  }
}

class EmptyLine extends LinkedListElement {
  spans () {
    return $(`
        <div class="row">
            <div class="col-12 ">&nbsp;</div>
        </div>
      `)
  }

  compute () {
    return undefined
  }
}

class CalendarRoundFactory {

  constructor () {
    this.pattern = /^([*\d]+)\s?([^\s]+)\s?([*\d]+)\s?([^\s]+)$/
  }

  split (raw_calendar_round) {
    return raw_calendar_round.match(
      this.pattern,
    ).slice(1)
  }

  is_partial_calendar_round (raw_cr) {
    let parts = this.split(raw_cr)
    return parts.includes('*')
  }

  /*
  This parser does not take an intelligent approach,
  we brute force check all possible options, for each component
  of the calendar round
   */
  parse (raw_calendar_round) {
    let parts = this.split(raw_calendar_round)

    for (let i = 1; i <= 18980; i++) {
      let potential_cr = new CalendarRound(i)
      if (!potential_cr.is_valid()) {
        continue
      }
      let potential_parts = this.split(potential_cr.toString())
      let is_equal = (
        (potential_parts[0] === parts[0]) &
        (potential_parts[1] === parts[1]) &
        (potential_parts[2] === parts[2]) &
        (potential_parts[3] === parts[3])
      )
      if (is_equal) {
        return new CalendarRound(i)
      }
    }
  }

  all () {
    let crs = []
    for (let i = 1; i <= 189800; i++) {
      let potential_cr = new CalendarRound(i)
      if (potential_cr.is_valid()) {
        crs.push(potential_cr)
      }
    }
    return crs
  }

  partial_match (tzolk_in_coeff, tzolk_in, haab_coeff, haab) {
    let missing_tzolk_in_coeff = (tzolk_in_coeff === '*')
    let missing_tzolk_in = (tzolk_in === '*')
    let missing_haab_coeff = (haab_coeff === '*')
    let missing_haab = (haab === '*')

    let crs = this.all()
    let potentials = []
    for (let i = 0; i < crs.length; i++) {
      let cr = crs[i]

      let matched_tzolk_in_coeff = true
      if (!missing_tzolk_in_coeff) {
        matched_tzolk_in_coeff = cr.tzolk_in_coeff === parseInt(tzolk_in_coeff)
      }

      let matched_tzolk_in = true
      if (!missing_tzolk_in) {
        matched_tzolk_in = cr.tzolk_in_month === tzolk_in
      }

      let matched_haab_coeff = true
      if (!missing_haab_coeff) {
        matched_haab_coeff = cr.haab_coeff === parseInt(haab_coeff)
      }

      let matched_haab = true
      if (!missing_haab) {
        matched_haab = cr.haab_month === haab
      }

      if (
        matched_tzolk_in_coeff &&
        matched_tzolk_in &&
        matched_haab_coeff &&
        matched_haab
      ) {
        potentials.push(cr)
      }
    }

    let unique_potentials = []
    let unique_potential_positions = new Set()
    for (let i = 0; i < potentials.length; i++) {
      if (!unique_potential_positions.has(potentials[i].total_days)) {
        unique_potentials.push(potentials[i])
        unique_potential_positions.add(potentials[i].total_days)
      }
    }

    return unique_potentials
  }

}

class PartialCalendarRound {
  constructor (raw_calendar_round) {
    this.crf = new CalendarRoundFactory()
    this.parts = this.crf.split(raw_calendar_round)
    this.potentials = this.crf.partial_match(...this.parts)
  }

  spans () {

    function single_line (cr) {
      return `
        <div class="row">
            <div class="col-3  calendar_round">
                ${cr}
            </div>
            <div class="col-1  calendar_round_position">
                ${cr.total_days}
            </div>
            <div class="col-4  long_count"></div>
            <div class="col-4  comment"></div>
        </div>
      `
    }

    let rows = []
    for (let i = 0; i < this.potentials.length; i++) {
      rows.push(
        single_line(this.potentials[i]),
      )
    }
    return $(
      rows.join('\n'),
    )
  }

  compute () {
    return undefined
  }
}

class CalendarRound {

  constructor (total_days) {
    this.total_days = total_days % 18980
    this.tzolk_in_lookup = {
      0: 'Ajaw',
      1: 'Imix',
      2: 'Ik\'',
      3: 'Ak\'bal',
      4: 'K\'an',
      5: 'Chikchan',
      6: 'Kimi',
      7: 'Manik',
      8: 'Lamat',
      9: 'Muluk',
      10: 'Ok',
      11: 'Chuwen',
      12: 'Eb',
      13: 'Ben',
      14: 'Ix',
      15: 'Men',
      16: 'Kib',
      17: 'Kaban',
      18: 'Etz\'nab',
      19: 'Kawak',
    }
    this.haab_lookup = {
      1: 'Pop',
      2: 'Wo',
      3: 'Sip',
      4: 'Sotz\'',
      5: 'Sek',
      6: 'Xul',
      7: 'Yaxk\'in',
      8: 'Mol',
      9: 'Ch\'en',
      10: 'Yax',
      11: 'Sak',
      12: 'Keh',
      13: 'Mak',
      14: 'K\'ank\'in',
      15: 'Muwan',
      16: 'Pax',
      17: 'K\'ayab',
      18: 'Kumk\'u',
      19: 'Wayeb',
    }
  }

  is_valid () {
    return (
      (this.haab_coeff > 0) &
      (!this.haab.includes('undefined'))
    )
  }

  get tzolk_in_coeff () {
    let coeff = (4 + this.total_days) % 13
    if (coeff === 0) {
      coeff = 13
    }
    return coeff
  }

  get tzolk_in () {
    return `${this.tzolk_in_coeff} ${this.tzolk_in_month}`
  }

  get tzolk_in_month () {
    return this.tzolk_in_lookup[this.total_days % 20]
  }

  get haab_coeff () {
    let day_in_haab = (this.total_days - 17) % 365
    return day_in_haab % 20
  }

  get haab_month () {
    let day_in_haab = (this.total_days - 17) % 365
    return this.haab_lookup[Math.ceil(day_in_haab / 20)]
  }

  get haab () {
    return `${this.haab_coeff} ${this.haab_month}`
  }

  toString () {
    return this.tzolk_in + ' ' + this.haab + ' '
  }
}

if (typeof module != 'undefined') {
  module.exports = {
    LongCount: LongCount,
    CalendarRound: CalendarRound,
    CalendarRoundFactory: CalendarRoundFactory,
  }
}