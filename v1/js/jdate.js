var moment = require('moment-timezone')

class JDate {
  constructor (year, month, date) {
    this._gregorian_date = [year, month, date]
    this.year = undefined
    this.month = undefined
    this.day = undefined

    this.month_day_mapping = {
      1: 31,
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31,
    }

    this.direction = (this.year < 0) ? -1 : 1
  }

  normalize () {
    this.year = this._gregorian_date[0]
    this.month = this._gregorian_date[1]
    this.day = this._gregorian_date[2]

    this.day += this.julian_offset()

    this.normalize_month_day()
    return this
  }

  normalize_month_day () {
    let days_in_month = this.daysInMonth(this.month)
    if (this.day > days_in_month) {
      let overflow = this.day - days_in_month
      this.month += (this.direction * 1)
      this.day = overflow
    } else if (this.day < 1) {
      this.month -= 1
      this.day = this.daysInMonth(this.month) + this.day
    }

    if (this.month > 12) {
      let overflow_months = this.month - 12
      this.year += (this.direction * 1)
      this.month = overflow_months
    }
  }

  daysInMonth (monday_num) {
    if (this.month === 2) {
      return this.isLeapYear() ? 29 : 28
    }
    return this.month_day_mapping[this.month]
  }

  isLeapYear () {
    return (this.year % 4) === 0
  }

  julian_offset () {
    let date_number = parseInt(
      this.toString().split('/').reverse().join('')
    )
    if (date_number <= 0) {
      if (date_number < -2000000) {
        return 4
      } else if (date_number > -1000301) {
        return 3
      } else {
        return 2
      }
    } else if (date_number <= 1000228) {
      return 2
    } else if (date_number <= 2000228) {
      return 1
    } else if (date_number <= 3000228) {
      return 0
    } else if (date_number <= 3000302) {
      return -1
    } else if (date_number <= 5000303) {
      return -2
    } else if (date_number <= 6000304) {
      return -3
    } else if (date_number <= 7000305) {
      return -4
    } else if (date_number <= 9000306) {
      return -5
    } else if (date_number <= 10000307) {
      return -6
    } else if (date_number <= 11000308) {
      return -7
    } else if (date_number <= 13000309) {
      return -8
    } else if (date_number <= 14000310) {
      return -9
    } else if (date_number <= 17000228) {
      return -10
    } else if (date_number <= 18000228) {
      return -11
    } else if (date_number <= 19000228) {
      return -12
    } else if (date_number <= 21000228) {
      return -13
    } else if (date_number <= 21000314) {
      return -14
    }
    return 0
  }

  toString () {
    let year = this.year.toString()
    let month = this.month.toString()
    let day = this.day.toString()
    if (year.length < 4) {
      year = `0${year}`
    }

    if (month.length < 2) {
      month = `0${month}`
    }

    if (day.length < 2) {
      day = `0${day}`
    }

    return `${day}/${month}/${year}`
  }
}

function julianFromGregorian (gregorian_date) {
  return new JDate(
    gregorian_date.year,
    gregorian_date.month,
    Math.floor(gregorian_date.day),
  ).normalize()
}

module.exports = {
  julianFromGregorian: julianFromGregorian,
}
