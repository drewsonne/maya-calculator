(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var model = require('./model.js')
var DateTime = luxon.DateTime

class MayaCalculator {
  constructor (correlation_constant) {
    this.operands = []
    this.current_raw_line = ''
    this.ledger = []
    this.correlation_constant = correlation_constant
  }

  evaluate (raw_input) {
    let operations = raw_input.split(/\n/)
    if (operations.length > 0) {
      this.operands = []
      this.ledger = []
      let operation_length = operations.length
      let result
      for (let i = 0; i < operation_length; i++) {
        this.fetch(operations[i].replace(/[.+\-]$/, ''))
        this.decode(i)
        result = this.execute()
        if (result !== undefined) {
          operations.splice(
            i + 1,
            0,
            result.toString().replace(/\s+/g, ''),
          )
          operation_length = operations.length
        }
      }
    }

    return this.ledger
  }

  fetch (raw_line) {
    this.current_raw_line = raw_line
  }

  decode (position) {
    let younger_sibling = (this.operands.length === 0)
      ? undefined
      : this.operands[position - 1]
    let crf = new model.CalendarRoundFactory()
    let lcf = new model.LongCountFactory()
    if (this.current_raw_line.length > 1) {
      let operand
      if (Boolean(
        this.current_raw_line[0] === '-'
        | this.current_raw_line[0] === '+',
      )) {
        operand = new model.DistanceNumber(this.current_raw_line,
          younger_sibling, this.correlation_constant)
      } else if (lcf.is_partial(this.current_raw_line)) {
        operand = new model.PartialLongCount(this.current_raw_line,
          this.correlation_constant)
      } else if (crf.is_partial(this.current_raw_line)) {
        operand = new model.PartialCalendarRound(this.current_raw_line)
      } else if (Boolean(
        this.current_raw_line[0] === '#',
      )) {
        operand = new model.Comment(this.current_raw_line,
          younger_sibling, this.correlation_constant)
      } else {
        operand = new model.LongCount(this.current_raw_line,
          younger_sibling, this.correlation_constant).normalise()
      }

      this.operands.push(operand)
    } else {
      this.operands.push(new model.EmptyLine(younger_sibling))
    }
    this.current_raw_line = ''
  }

  execute () {
    let result
    if (this.operands.length > 0) {
      this.ledger = $.merge(
        this.ledger,
        this.operands[this.operands.length - 1].spans(),
      )
      result = this.operands[this.operands.length - 1].compute()
    }
    return result
  }
}

$(document).ready(function () {

  const corr = new model.CorrelationConstant()
  const calculator = new MayaCalculator(corr)
  let input = $('#calendar_input')
  let output = $('#longcount_output')
  let corr_const = $('#' + corr.id)

  let evaluate = function (raw_calculations) {
    let results = calculator.evaluate(raw_calculations)

    output.html($.merge(
      $(`<tr>
            <th>C. Round</th>
            <th>Pos.</th>
            <th>Long Count</th>
            <th>Gregorian</th>
            <th>Night</th>
            <th class="left_align">Annotation</th>
        </tr>`),
      results,
    ))

    $('tr.data-row').each(function (index, element) {
      if (index % 2 === 0) {
        $(element).addClass('odd_row')
      }
    })
  }

  let saved_calculation_raw = window.location.hash.replace('#', '')
  if (saved_calculation_raw.length > 0) {
    let saved_calculation = atob(saved_calculation_raw)
    input.html(saved_calculation)
    evaluate(saved_calculation)
  }

  let run_event
  input.keyup(function (event) {
    clearTimeout(run_event)
    run_event = setInterval(function () {
      let raw_calculations = input.val().trim()
      evaluate(raw_calculations)
      window.location.hash = '#' + btoa(raw_calculations)
    }, 500)
  })

  corr.refresh()
  corr_const.change(function (e) {
    corr.value = $(e.target).val()
    input.trigger('keyup')
  })
})

},{"./model.js":2}],2:[function(require,module,exports){
var moonbeams = require('moonbeams')

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
    this.cr_pattern = /\d+\s?['a-zA-Z]+\s\d+\s?['a-zA-Z]+/g
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

    return is_partial_lc || is_partial_cr
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

  get value () {
    let val
    if (this.has_store_value) {
      val = this.store_value
    } else {
      val = this.menu_val
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
      localStorage.setItem(this.id, new_val)
    }
  }

  get menu_value () {
    return $('#' + this.id).val()
  }

  set menu_value (new_val) {
    $('#' + this.id).val(new_val)
  }

  refresh () {
    this.menu_value =
      this.has_store_value ?
        this.store_value :
        this.default
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
}

},{"moonbeams":3}],3:[function(require,module,exports){
'use strict';
// Moonbeams.js
// (c) 2014 Michael Garvin
// Moonbeams may be freely distributed under the MIT license.
//
// Unless specifically stated otherwise, all julian days are in dynamical time

var Moonbeams = {};

module.exports = Moonbeams;

// Data stores
// -----------

// mean equinox/solstice expression table for years -1000 to 1000
var meanSeasonTableA = [
  [1721139.29189, 365242.13740, 0.06134, 0.00111, 0.00071],
  [1721233.25401, 365241.72562, 0.05323, 0.00907, 0.00025],
  [1721325.70455, 365242.49558, 0.11677, 0.00297, 0.00075],
  [1721414.39987, 365242.88257, 0.00769, 0.00933, 0.00006]
];

// mean equinox/solstice expression table for years 1000 to 3000
var meanSeasonTableB = [
  [2451623.80984, 365242.37404, 0.05169, 0.00411, 0.00057],
  [2451716.56767, 365241.62603, 0.00325, 0.00888, 0.00030],
  [2451810.21715, 365242.01767, 0.11575, 0.00337, 0.00078],
  [2451900.05952, 365242.74049, 0.06223, 0.00823, 0.00032]
];

// Periodic terms for calculating solstice/equinox from mean
var periodicTermTableA = [
  [485, 324.96, 1934.136],
  [203, 337.23, 32964.467],
  [199, 342.08, 20.186],
  [182, 27.85, 445267.112],
  [156, 73.14, 45036.886],
  [136, 171.52, 22518.443],
  [77, 222.54, 65928.934],
  [74, 296.72, 3034.906],
  [70, 243.58, 9037.513],
  [58, 119.81, 33718.147],
  [52, 297.17, 150.678],
  [50, 21.02, 2281.226],
  [45, 247.54, 29929.562],
  [44, 325.15, 31555.956],
  [29, 60.93, 4443.417],
  [18, 155.12, 67555.328],
  [17, 288.79, 4562.452],
  [16, 198.04, 62894.029],
  [14, 199.76, 31436.921],
  [12, 95.39, 14577.848],
  [12, 287.11, 31931.756],
  [12, 320.81, 34777.259],
  [9, 227.73, 1222.114],
  [8, 15.45, 16859.074]
];

// Helper functions
// ----------------

// Convert decimal degrees to radians
Moonbeams.degreeToRadian =  function (degrees) {

  return degrees * Math.PI / 180;
};


// Returns cosine of decimal degrees
var cosine = Moonbeams.cosone = function (degree) {

  return Math.cos(Moonbeams.degreeToRadian(degree));
};

// Returns tangent of decimal degrees
Moonbeams.tangent = function (degree) {

  return Math.tan(Moonbeams.degreeToRadian(degree));
};

// Returns INT of given decimal number
// INT is the integer portion *closest to zero*
// Meeus calls this INT so we do too
var INT = Moonbeams.INT = function (number) {

  return Math[number < 0 ? 'ceil' : 'floor'](number);
};

// Returns julian cycle since Jan 1, 2000
// Meeus calls this T so we do too
var T = Moonbeams.T = function (jd) {

  return ( jd - 2451545.0 ) / 36525;
};

// Converts given hours, minutes, and arcseconds right ascention
var hmsToRightAscention = Moonbeams.hmsToRightAscention = function (hours, minutes, arcseconds) {

  return (hours + (minutes / 60) + (arcseconds / 3600)) * 15;
};

Moonbeams.rightAscentionToHms = function (ra) {

  var degrees = ra / 15;
  var hour = INT(degrees);
  var minute = INT((degrees - hour) * 60.0);
  var second = (((degrees - hour) * 60.0) - minute) * 60.0;
  return { hour: hour, minute: minute, second: second };
};

// Converts given hours, minutes, and seconds into decimal of a day
Moonbeams.hmsToDay = function (hours, minutes, seconds) {

  return (hmsToRightAscention(hours, minutes, seconds) / 360);
};

// Converts given decimal day to hours, minutes, and (arc)seconds
Moonbeams.dayToHms = function (degree) {

  //Return the hours, minutes, seconds from the decimal portion of given degree
  var dayFragment = degree - INT(degree);
  var hour  = INT(dayFragment * 24.0);
  var minute  = INT((dayFragment * 24.0 - hour) * 60.0);
  var second  = ((dayFragment * 24.0 - hour) * 60.0 - minute) * 60.0;
  if (second > 59.999) {
    second = 0;
    minute = minute + 1;
  }
  if (minute > 59.999) {
    minute = 0;
    hour = hour + 1;
  }
  return { hour: hour, minute: minute, fullSecond: second, second: INT(second) };
};

// Returns true if given year is a leap year
var isLeapYear = Moonbeams.isLeapYear = function (year) {

  if (year % 4 !== 0) {
    //Not divisible by 4, common year
    return false;
  }
  if (year % 100 !== 0) {
    return true;
  }
  if (year % 400 !== 0) {
    //Not divisible by 400, common year
    return false;
  }
  return true;
};

// (Meeus chapter 12)
// Calculate mean sidereal time at Greenwich of a given julian day
var meanSiderealTime = Moonbeams.meanSiderealTime = function (jd) {

  var mean;
  var cycle = T(jd);
  mean = 280.46061837 +
    (360.98564736629 * ( jd - 2451545.0 ) ) +
    (0.000387933 * cycle * cycle) -
    (cycle * cycle * cycle / 38710000);
  if (mean < 0 || mean > 360) {
    mean = mean - Math.floor(mean / 360) * 360;
  }
  return mean;
};

// (Meeus chapter 12)
// Calculate apparent sidereal time at Greenwich of a given julian day
Moonbeams.apparentSiderealTime = function (jd) {

  //See chapter 22 for nutation
};

// Main conversion functions
// -------------------------

// (Meeus chapter 7)
// Convert given decimal julian day into calendar object
// with year, month, fullDay (decimal day), day (integer day), hour,
// minute, fullSecond (decimal second), second (integer second)
var jdToCalendar = Moonbeams.jdToCalendar = function (jd) {

  var alpha;
  var A;
  var B;
  var C;
  var D;
  var E;
  var F;
  var Z;
  var year;
  var month;
  var day;
  var result;
  if (jd < 0) {
    throw new Error('Cannot convert from negative Julian Day numbers');
  }
  jd = jd + 0.5;
  Z = INT(jd); //Integer part of jd
  F = jd - Z; //Fractional (decimal) part of jd
  A = Z;
  if (Z >= 2299161) {
    alpha = INT( ( Z - 1867216.25 ) / 36524.25 );
    A = Z + 1 + alpha - INT(alpha / 4);
  }
  B = A + 1524;
  C = INT( ( B - 122.1 ) / 365.25 );
  D = INT(365.25 * C);
  E = INT( ( B - D ) / 30.6001 );

  //DAY
  day = B - D - INT(30.6001 * E) + F;

  //MONTH
  if (E < 14) {
    month = E - 1;
  }
  else {
    month = E - 13;
  }

  //YEAR
  if (month > 2) {
    year = C - 4716;
  }
  else {
    year = C - 4715;
  }
  result = { year: year, month: month, day: day };

  return result;
};

// (Meeus chapter 7)
// Convert given year, month, day to decimal julian day
// Day can be decimal
// (Use hmsToDay if you have hours, minutes, and seconds to add to a day)
Moonbeams.calendarToJd = function (year, month, day) {

  var jd;
  var A;
  var B;
  if (year < -4712) {
    throw new Error('Cannot convert to negative Julian Day numbers');
  }
  if (month < 0 || month > 12) {
    throw new Error('Month must be 1 through 12');
  }
  if (day < 0) {
    throw new Error('Day must be positive');
  }
  if (month < 3) {
    //Consider Jan and Feb to be month 13 and 14 of previous year
    year = year - 1;
    month = month + 12;
  }
  A = INT( year / 100 );
  //if we're before 10/15/1582 we're julian
  if (
    ( year < 1582 ) ||
      ( year === 1582 && month < 10 ) ||
        ( year === 1582 && month === 10 && day < 15)
  ) {
    B = 0;
  }
  else {
    B = 2 - A + INT( A / 4 );
  }
  jd = INT( 365.25 * ( year + 4716 ) ) +
    INT( 30.6001 * ( month + 1 ) ) +
    day + B - 1524.5;
  return jd;
};


// Calculation functions
// ---------------------

// (Meeus chapter 27)
// Calculate the mean equinox or solstice for a year
var meanSeason = Moonbeams.meanSeason = function (seasonIndex, year) {

  var Y;
  var jd;
  var table;
  if (year < -1000 || year > 3000) {
    throw new Error('Can only calculate season for years between -1000 and 3000');
  }
  if (seasonIndex < 0 || seasonIndex > 3) {
    throw new Error('seasonIndex must be one of: 0, 1, 2, 3');
  }
  if (year > 1000) {
    table = meanSeasonTableB[seasonIndex];
    year = year - 2000;
  }
  else {
    table = meanSeasonTableA[seasonIndex];
  }
  Y = year / 1000;
  //TODO shorthand this
  jd = table[0] +
    ( table[1] * Y ) +
    ( table[2] * Math.pow(Y, 2) ) -
    ( table[3] * Math.pow(Y, 3) ) -
    ( table[4] * Math.pow(Y, 4) );
  return jd;
};

// (Meeus chapter 27)
// Calculate time of given equinox/solstice for a year
// seasonIndex can be
//   0 - March equinox
//   1 - June solstice
//   2 - September equinox
//   3 - December solstice
//   Returns a julian day in dynamical time
Moonbeams.season = function (seasonIndex, year) {

  var S;
  var W;
  var cycle;
  var dl;
  var jde0;
  var jde;

  jde0 = meanSeason(seasonIndex, year);

  cycle = T(jde0);
  W = (35999.373 * cycle) - 2.47;
  dl = 1 +
    ( 0.0334 * cosine(W) ) +
    ( 0.0007 * cosine(W * 2) );
  S = 0;
  for ( var i = 0; i < 24; i++ ) {
    S = S + periodicTermTableA[i][0] * cosine(periodicTermTableA[i][1] + ( periodicTermTableA[i][2] * cycle ));
  }
  jde = jde0 + ( (0.00001 * S) / dl );
  return jde;
};

// (Meeus chapter 7)
// Return day of week (0-6) of a given julian day
Moonbeams.dayOfWeek = function (jd) {

  return (jd + 1.5) % 7;
};

// (Meeus chapter 7)
// Return day of the year for given julian day
Moonbeams.dayOfYear = function (jd) {

  var K;
  var N;
  var calendar = jdToCalendar(jd);
  var leapYear = isLeapYear(calendar.year);
  if (leapYear) {
    K = 1;
  }
  else {
    K = 2;
  }
  N = INT( ( 275 * calendar.month ) / 9 ) - ( K * INT( ( calendar.month + 9 ) / 12 ) ) + calendar.day - 30;
  return N;
};

// (Meeus chapter 7)
// Return calendar object for a given day of year
// Algorithm found by A. Pouplier, of the Société Astronomique do Liège, Belgium
Moonbeams.yearDayToCalendar = function (yearDay, year) {

  var K;
  var day;
  var month;
  var leapYear = isLeapYear(year);
  if (leapYear) {
    K = 1;
  }
  else {
    K = 2;
  }
  if (yearDay < 32) {
    month = 1;
  }
  else {
    month = INT( ( ( 9 * (K + yearDay) ) / 275 ) + 0.98 );
  }
  day = yearDay - INT( ( 275 * month ) / 9 ) + ( K * INT( ( month + 9 ) / 12 ) ) + 30;
  return { year: year, month: month, day: day };
};

// (Meeus chapter 15)
// Calculate the time of sunrise for a given julian day
Moonbeams.sunrise = function (jd, options) {

  var calendar;
  //var day;
  settings = {
    latitude: 0, //Geographic latitude
    longitude: 0,
    dT: 0,
    h0: -0.8333 //The Sun
  };
  if (options) {
    Object.keys(options).forEach(function (optionName) {

      settings[optionName] = options[optionName];
    });
  }
  calendar = jdToCalendar(jd);
  //day = INT(calendar.day) + 0.5;
  //Calculate sidereal time theta0 at 0h UT on day D for the meridian of greenwich, in degrees
  meanSidereal = meanSiderealTime(calendar.day);
  //Calculate teh apparent right ascentions and eclinations of the sun
};

},{}]},{},[1]);
