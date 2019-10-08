var moonbeams = require('moonbeams')
var moment = require('moment-timezone')

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

class PatternMatcher {
  constructor (value) {
    this.value = value
    this.cr_pattern = /[\d*]+\s?[*'a-zA-Z]+\s[\d*]+\s?[*'a-zA-Z]+/g
    this.lc_pattern = /(?:[*\w]+\.)(?:[*\w]+\.?)+/g
  }

  get has_calendar_round () {
    return this.match(this.cr_pattern)
  }

  get has_long_count () {
    return this.match(this.lc_pattern)
  }

  match (pattern) {
    return Boolean(this.value.match(pattern))
  }

  get long_count () {
    let matches = this.value.match(
      this.lc_pattern,
    )
    if (matches) {
      return matches[0].trim()
    }
  }

  get calendar_round () {
    let matches = this.value.match(
      this.cr_pattern,
    )
    if (matches) {
      return matches[0].trim()
    }
  }
}

class MayaDate extends LinkedListElement {
  constructor (raw, younger_sibling, correlation_constant) {
    super(younger_sibling)
    this.parse(raw)
    this.correlation_constant = correlation_constant
  }

  parse (raw_string) {
    let parts = raw_string.split('#')
    if (parts.length > 0) {
      let lc = parts[0].trim()
      lc = lc.split(' ')[0].replace(/[^\d.]+/, '')
      this.raw = lc.replace(/[.+]$/, '')
      this.parts = lc.split('.').reverse()
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

    let date_length = significant_digits.length
    if (date_length < 5) {
      for (let i = 0; i < 5 - date_length; i++) {
        significant_digits.unshift(' 0')
      }
    }
    return significant_digits.join('.')
  }

  get julianDay () {
    return this.correlation_constant.value + this.total_k_in()
  }

  get gregorian () {
    let gd = moonbeams.jdToCalendar(this.julianDay)
    let gdYear = gd.year
    let era = 'CE'
    if (gdYear < 0) {
      era = 'BCE'
      gdYear = Math.abs(gdYear + 1)
    }
    return `${Math.floor(gd.day)}/${gd.month}/${gdYear} ${era}`
  }
}

class Factory {
  split (raw_calendar_round) {
    let matches = raw_calendar_round.match(
      this.pattern,
    )
    if (matches === null) {
      return []
    }
    return matches.slice(1)
  }

  is_partial (raw) {
    let parts = this.split(raw)
    return parts.includes('*')
  }
}

class LongCountFactory extends Factory {
  constructor () {
    super()
  }

  is_partial (raw) {
    let pm = new PatternMatcher(raw)
    let is_partial_cr = false, is_partial_lc = false

    if (pm.has_long_count) {
      is_partial_lc = pm.long_count.includes('*')
    }

    if (pm.has_calendar_round) {
      is_partial_cr = pm.calendar_round.includes('*')
    }

    return is_partial_lc || is_partial_lc && is_partial_cr
  }

  partial_match (long_count_parts, partial_cr, correlation_constant) {
    let potentials = []
    let last_expanders = [long_count_parts.slice()]
    let expanders = last_expanders
    let length_of_sig_digit
    for (let i = 0; i < long_count_parts.length; i++) {
      let sig_digit = long_count_parts[i]
      if (sig_digit === '*') {
        expanders = []
        let num_missing = (i === 1) ? 18 : 20
        for (let j = 0; j < num_missing; j++) {
          for (let k = 0; k < last_expanders.length; k++) {
            let new_num = last_expanders[k].slice()
            new_num[i] = `${j + 1}`
            new_num[i] = `${j + 1}`
            expanders.push(new_num)
          }
        }
        last_expanders = expanders.slice()
      }
    }
    for (let j = 0; j < expanders.length; j++) {
      let new_lc = new LongCount(
        expanders[j].reverse().join('.'),
        undefined,
        correlation_constant,
      )
      if (partial_cr === undefined) {
        potentials.push(new_lc)
      } else {
        let partial_crs = partial_cr.potentials
        for (let k = 0; k < partial_crs.length; k++) {
          if (new_lc.calendar_round.is_equal(partial_crs[k])) {
            potentials.push(new_lc)
          }
        }
      }
    }
    return potentials
  }

}

class PartialLongCount {
  constructor (raw, correlation_constant) {
    let parts = raw.split(' ')
    let long_count = parts[0].split('.')
    let partial_cr = undefined
    if (parts.length > 1) {
      partial_cr = new PartialCalendarRound(
        parts.slice(1).join(' '),
      )
    }

    this.potentials = new LongCountFactory().partial_match(
      long_count.reverse(),
      partial_cr,
      correlation_constant,
    )
  }

  spans () {

    function single_line (lc) {
      return `
        <tr class="data-row">
            <td class="calendar_round">
                ${lc.calendar_round}
            </td>
            <td class="calendar_round_position">
                ${lc.calendar_round.total_days}
            </td>
            <td class="long_count">${lc}</td>
            <td class="gregorian">${lc.gregorian}</td>
            <td class="lord_of_night">${lc.lord_of_night}</td>
            <td class="comment"></td>
        </tr>
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

class LongCount extends MayaDate {

  constructor (raw, younger_sibling, correlation_constant) {
    super(raw, younger_sibling, correlation_constant)
    this.date_pattern = /(\d+\.?)+/
  }

  is_valid () {
    return this.date_pattern.test(this.toString())
  }

  get lord_of_night () {
    let date = this.total_k_in() % 9
    return `G${(date === 0) ? 9 : date}`
  }

  spans () {
    return $(`
        <tr class="data-row">
            <td class="calendar_round">
                ${new CalendarRound(this.total_k_in())}
            </td>
            <td class="calendar_round_position">
                ${new CalendarRound(this.total_k_in()).total_days}
            </td>
            <td class="long_count">
                ${this.toString()}
            </td>
            <td class="gregorian">${this.gregorian}</td>
            <td class="lord_of_night">${this.lord_of_night}</td>
            <td class="comment">${this.comment}</td>
        </tr>
      `)
  }
}

class DistanceNumber extends MayaDate {
  constructor (raw, younger_sibling, correlation_constant) {
    super(raw, younger_sibling, correlation_constant)
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
      `<tr class="data-row">
            <td class="calendar_round"></td>
            <td class="calendar_round_position"></td>
            <td class="distance_number">
                ${distance_string}
            </td>
            <td class="gregorian">${this.gregorian}</td>
            <td class="lord_of_night"></td>
            <td class="comment">${this.comment}</td>
        </tr>
        <tr class="data-row">
            <td class="calendar_round"></td>
            <td class="calendar_round_position"></td>
            <td class="long_count">
                ${'-'.repeat(separator_length)}
            </td>
            <td class="gregorian">${this.gregorian}</td>
            <td class="lord_of_night"></td>
            <td class="comment"></td>
        </tr>`,
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
        <tr class="data-row">
            <td class="calendar_round"></td>
            <td class="comment" colspan="5">
                <span class="comment">
                    ${this.comment}
                </span>
            </td>
        </tr>
      `)
  }

  compute () {
    return undefined
  }
}

class EmptyLine extends LinkedListElement {
  spans () {
    return $(`
        <tr class="data-row">
            <td colspan="5">&nbsp;</td>
        </tr>
      `)
  }

  compute () {
    return undefined
  }
}

class CalendarRoundFactory extends Factory {

  constructor () {
    super()
    this.pattern = /^([*\d]+)\s?([^\s]+)\s?([*\d]+)\s?([^\s]+)$/
  }

  is_partial (raw) {
    let pm = new PatternMatcher(raw)
    return (pm.has_calendar_round) ?
      pm.calendar_round.includes('*') : false
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
      let potential_parts = this.split(potential_cr.toString().trim())
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
        <tr class="data-row">
            <td class="calendar_round">
                ${cr}
            </td>
            <td class="calendar_round_position">
                ${cr.total_days}
            </td>
            <td class="long_count"></td>
            <td class="gregorian"></td>
            <td class="lord_of_night"></td>
            <td class="comment"></td>
        </tr>
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

  is_equal (other_cr) {
    return this.toString() === other_cr.toString()
  }

  get tzolk_in_coeff () {
    let coeff = (4 + this.total_days) % 13
    return (coeff === 0) ? 13 : coeff
  }

  get tzolk_in () {
    return `${this.tzolk_in_coeff} ${this.tzolk_in_month}`
  }

  get tzolk_in_month () {
    return this.tzolk_in_lookup[this.total_days % 20]
  }

  get haab_coeff () {
    return this.day_in_haab % 20
  }

  get day_in_haab () {
    let day_in_haab
    if (this.total_days < 17) {
      day_in_haab = 8 + this.total_days
    } else {
      day_in_haab = (this.total_days - 17) % 365
    }
    return day_in_haab
  }

  get haab_month () {
    let haab_index
    if (this.total_days < 18) {
      if (this.total_days < 12) {
        haab_index = 18
      } else if (this.total_days < 17) {
        haab_index = 19
      }
    } else {
      haab_index = Math.ceil(this.day_in_haab / 20)
    }
    if (this.haab_coeff === 0) {
      haab_index = haab_index % 19 + 1
      haab_index = (haab_index === 0) ? 1 : haab_index
    }
    return this.haab_lookup[haab_index]
  }

  get haab () {
    return `${this.haab_coeff} ${this.haab_month}`
  }

  toString () {
    return this.tzolk_in + ' ' + this.haab + ' '
  }
}

class CorrelationConstant {
  constructor () {
    this.id = 'correlation_constant'
    this.default = 584283
    this.static = undefined
  }

  setStatic (new_val) {
    this.static = new_val
  }

  get has_store_value () {
    return Boolean(this.store_value)
  }

  get store_value () {
    let val = localStorage.getItem(this.id)
    if (val === 'undefined') {
      localStorage.removeItem(this.id)
      val = undefined
    }
    return val
  }

  set store_value (new_val) {
    return localStorage.setItem(this.id, new_val)
  }

  get has_session_value () {
    return Boolean(this.session_value)
  }

  get session_value () {
    let val = sessionStorage.getItem(this.id)
    if (val === 'undefined') {
      sessionStorage.removeItem(this.id)
      val = undefined
    }
    return val
  }

  set session_value (new_val) {
    return sessionStorage.setItem(this.id, new_val)
  }

  get value () {
    if (this.static !== undefined) {
      return this.static
    }

    let val
    if (this.has_session_value) {
      val = this.session_value
    } else if (this.has_store_value) {
      val = this.store_value
    } else {
      val = this.menu_value
    }
    val = +val
    if (!isNaN(val)) {
      val = parseInt(val)
    }
    return val
  }

  set value (new_val) {
    new_val = +new_val
    if (!isNaN(new_val)) {
      this.store_value = new_val
      this.session_value = new_val
    }
  }

  get menu_value () {
    return $('#' + this.id).val()
  }

  set menu_value (new_val) {
    $('#' + this.id).val(new_val)
  }

  refresh () {
    if (this.has_session_value) {
      this.menu_value = this.session_value
    } else if (this.has_store_value) {
      this.menu_value = this.store_value
    } else {
      this.menu_value = this.default
    }
  }

}

class DateMapping {
  constructor (julian, gregorian, offset) {
    let julianIsBCE = false
    let julianParts = julian.split('-')
    if (julian[0] === '-') {
      julian = `${julianParts[1]}-${julianParts[2]}-${julianParts[3]}`
      julianIsBCE = true
    }

    let gregorianIsBCE = false
    let gregorianParts = gregorian.split('-')
    if (gregorian[0] === '-') {
      gregorian = `${gregorianParts[1]}-${gregorianParts[2]}-${gregorianParts[3]}`
      gregorianIsBCE = true
    }

    this.julian = moment.tz(julian, 'UTC')
    if (julianIsBCE) {
      this.julian.year(-Math.abs(parseInt(julianParts[1])))
    }

    this.gregorian = moment.tz(gregorian, 'UTC')
    if (gregorianIsBCE) {
      this.julian.year(-Math.abs(parseInt(gregorianParts[1])))
    }
    this.offset = offset
  }

  check (index) {
    if (index === 0) {
      return this.julian
    } else {
      return this.gregorian
    }
  }
}

class GJDate {
  constructor (date_string) {
    const date_parts = date_string.split('-')
    let isBCE = false
    if (date_parts[0] === '-') {
      date_string = `${date_parts[1]}-${date_parts[2]}-${date_parts[3]}`
      isBCE = true
    }

    this._date = moment.tz(date_string, 'UTC')
    if (isBCE) {
      this._date.year(-Math.abs(parseInt(date_parts[1])))
    }
    this.mapping = [
      new DateMapping('-500-03-05', '-500-02-28', -6),
      new DateMapping('0100-02-29', '0100-02-27', -2),
      new DateMapping('0100-03-02', '0100-03-01', -1),
      new DateMapping('0200-02-28', '0200-02-27', -1),
    ]
    this._index = undefined
    this._direction = undefined
    this._other_class = undefined
  }

  switch () {
    let foundDate = false
    let e
    for (e of this.mapping) {
      if (this._date.isSameOrAfter(e.check(this._index))) {
        foundDate = true
        break
      }
    }
    let offset_date = this._date.clone()
    offset_date = offset_date.add(this._direction * e.offset, 'days')
    return new this._other_class(offset_date.format('YYYY-MM-DD'))
  }

  format (date_format) {
    return this._date.format(date_format)
  }
}

class JDate extends GJDate {
  constructor (date_string) {
    super(date_string)
    this._direction = 1
    this._index = 0
    this._other_class = GDate
  }

}

class GDate extends GJDate {
  constructor (date_string) {
    super(date_string)
    this._direction = -1
    this._index = 1
    this._other_class = JDate
  }
}

module.exports = {
  CalendarRound: CalendarRound,
  CalendarRoundFactory: CalendarRoundFactory,
  Comment: Comment,
  DistanceNumber: DistanceNumber,
  EmptyLine: EmptyLine,
  LongCount: LongCount,
  LongCountFactory: LongCountFactory,
  PartialCalendarRound: PartialCalendarRound,
  PartialLongCount: PartialLongCount,
  PatternMatcher: PatternMatcher,
  CorrelationConstant: CorrelationConstant,
  GDate: GDate,
  JDate: JDate,
}
