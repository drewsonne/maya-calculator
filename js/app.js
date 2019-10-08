var model = require('./model.js')
var tutorial = require('./tutorial.js')
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

  tutorial.initialise()

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
            <th>Julian</th>
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

  // $(window).on('hashchange', function (e) {
  //   let saved_calculation_raw = window.location.hash.replace('#', '')
  //   if (saved_calculation_raw.length > 0) {
  //     let saved_calculation = atob(saved_calculation_raw)
  //     input.html(saved_calculation)
  //     evaluate(saved_calculation)
  //   }
  // })

  let run_event
  input.keyup(function (event) {
    clearTimeout(run_event)
    run_event = setInterval(function () {
      let raw_calculations = input.val().trim()
      evaluate(raw_calculations)
      window.location.hash = '#' + btoa(raw_calculations)
      clearTimeout(run_event)
    }, 500)
  })

  corr.refresh()
  corr_const.change(function (e) {
    corr.value = $(e.target).val()
    input.trigger('keyup')
  })
})
