# maya-date-calculator
[![Build Status](https://travis-ci.com/drewsonne/maya-calculator.svg?branch=master)](https://travis-ci.com/drewsonne/maya-calculator)

A simple text based maya date calculator

# Description
This calculator is designed to be simple, lightweight, and resistant to
becoming legacy. It aims to be simple and relies on only jQuery and bootstrap.

It is text-based to allow for easy data entry, and easy sharing
of computations.

It will take "incorrect" values, and try to work with them, rather
than enforcing  strict base-20 values.

Columns can be hidden via the "View" menu.

# Instructions

At the most basic, the calculator will show the Calendar Round, and Lord of the night for a
given Long Count Date.

Eg, `8.19.10.11.0` becomes `8 Ajaw 18 Yaxk'in 8.19.10.11. 0`

If a Distance Number (prefixed with either `+` or `-`) is added after a
Long Count date, the calculator will compute the subsequent Long Count
date along with the Calendar Round.

Eg,

```
8.19.10.11.0
+7.13
```

becomes

```
8 Ajaw 18 Yaxk'in 8.19.10.11. 0
+ 7.13
--------------
5 Ben 11 Muwan 8.19.11. 0.13
```

Multiple Distance Numbers can be chained and intermediary Long Counts
will be calculated.

If at any point a new Long Count is added, it will reset calculations
from that point.

Comments can be added either on their own line, by prefixing the line with `#` or by suffixing a line with `#`

Eg,

```
# My Date calculations
8.19.10.11.0 # A long count date
+7.13 # A distance number
```

Calculations can be shared by copying the URL.

## Partials

If provided with a partial Calendar Round (eg, `9 Ak'bal * Pax`), all possible
calendar rounds will be output.

If provided with a partial Long Count **and** Calendar Round (eg, `9.10.*.5.* * Chikchan *Sip`),
all possible combinations of calendar rounds and long counts will be output.

# Example
Navigate to [https://drewsonne.github.io/maya-calculator/](https://drewsonne.github.io/maya-calculator/#OC4xOS4xMC4xMSAjICgxKSBBIGxvbmcgY291bnQgZGF0ZQorNy4xMyAjICgyKSBBIGRpc3RhbmNlIG51bWJlcgoKOS4xNy41LjAuMAojICgzKSBEbyBzb21lIGNhbGN1bGF0aW9ucwotMy40Ci0xLjAKKzMwLjEuMgorMS4xMDAwICMgKDQpIEFuICdpbnZhbGlkJyBkaXN0YW5jZSBudW1iZXIKIyAoNSkgQW4gZXhhbXBsZSBvZiBwYXJ0aWFsIGRhdGUgbWF0Y2hlcy4gCjkuMTAuKi41LiogKiBDaGlrY2hhbiAqU2lw) and
try to enter the following values one line at a time.

The last two lines demonstrate that the calculator will work with
the values even if they are invalid and try to compute a real
Long Count date.

```
8.19.10.11 # (1) A long count date
+7.13 # (2) A distance number

9.17.5.0.0
# (3) Do some calculations
-3.4
-1.0
+30.1.2
+1.1000 # (4) An 'invalid' distance number
# (5) An example of partial date matches. 
9.10.*.5.* * Chikchan *Sip
```
