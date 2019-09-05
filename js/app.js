class MayaCalculator {
  constructor () {
    this.operands = []
    this.current_raw_line = ''
    this.ledger = []
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
    let crf = new CalendarRoundFactory()
    if (this.current_raw_line.length > 1) {
      let operand
      if (Boolean(
        this.current_raw_line[0] === '-'
        | this.current_raw_line[0] === '+',
      )) {
        operand = new DistanceNumber(this.current_raw_line, younger_sibling)
      } else if (crf.is_partial_calendar_round(this.current_raw_line)) {
        operand = new PartialCalendarRound(this.current_raw_line)
      } else if (Boolean(
        this.current_raw_line[0] === '#',
      )) {
        operand = new Comment(this.current_raw_line, younger_sibling)
      } else {
        operand = new LongCount(this.current_raw_line,
          younger_sibling).normalise()
      }

      this.operands.push(operand)
    } else {
      this.operands.push(new EmptyLine(younger_sibling))
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
