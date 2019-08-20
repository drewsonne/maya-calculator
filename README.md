# maya-calculator
A simple text based maya calculator

# Description
This calculator is designed to be simple, lightweight, and resistant to 
becoming legacy. It is simple and relies on only jQuery.

It is text-based to allow for easy data entry, and easy sharing
of computations.

It will take "incorrect" values, and try to work with them, rather
than enforcing  strict base-20 values.

# Instructions

At the most basic, the calculator will show the Calendar Round for a
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

# Example
Navigate to https://drewsonne.github.io/maya-calculator/ and
try to enter the following values one line at a time.

The last two lines demonstrate that the calculator will work with
the values even if they are invalid and try to compute a real 
Long Count date.

```
8.19.10.11.0
+7.13
9.17.5.0.0
-3.4
-1.0
+30.1.2
+1.1000
```
