---
layout: post
author: Alex Cordonnier
title: Decimal math support
---

As a calculator programming hobbyist and open source enthusiast, I have been
watching KnightOS's development with great interest. Although I wanted to
contribute, I was held back by lack of free time and needing to use my
calculator for actual math classes. (Imagine that!) In the few weeks between
graduation and starting work, however, I found myself able to contribute. I
decided to focus on one of the highest barriers to adoption of KnightOS: its
lack of decimal math support.

In this article, I explain some of the design choices, technical aspects, and
limitations of the math library. Besides KnightOS contributors and users, the
article will hopefully be useful to external developers interested in math
library design.

## Background: number representation

Every math library needs a way to represent the numbers it uses. Essentially
every processor can natively work with integers, but most numbers are not
integers [\[1\]](https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument).
There must be some way for computers to represent and operate on real numbers
(with finite precision, of course).

The most common method is, by far,
[floating point numbers](https://en.wikipedia.org/wiki/Floating-point_arithmetic).
They work similarly to scientific notation by storing a real number as its
significand (i.e. coefficient) and the ten's exponent. For example, the number
1234.56789 in scientific notation is 1.23456789 x 10^3, which could be
represented as a base-10 floating point tuple (1.23456789, 3). Any real number
can be represented this way to some finite number of significant digits.

The benefit of floating point numbers is that even very large and very small
numbers can be represented with the same number of significant digits because
leading and trailing zeroes are eliminated. 123,456,789,000,000,000 and
0.0000000000000000123456789 are easily represented as (1.23456789, 17) and
(1.23456789, -17) respectively. For comparison, a 32-bit unsigned integer can
only store values between 0 and 4,294,967,295.

Now that we can represent arbitrary real numbers as floating point tuples,
how do we actually encode the significand and exponent in memory? The standard
way is [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754), which I won't delve
into since there are many references online. Its main downside is that base-2
representation causes some rational decimal numbers, such as 0.2, to become
irrational. This makes it difficult to reason about its precision in terms of
base-10 digits, and it is therefore poorly suited for calculators.

Most calculators, including TI's, instead use a digit representation called
[Binary Coded Decimal](https://en.wikipedia.org/wiki/Binary-coded_decimal)
(BCD). It works by storing each decimal digit separately in four bits,
rather than encoding the entire number as a single integer value.
For example, the base-10 number 123,456,789 would be represented as the
hexadecimal value 0x123456789 instead of its integer value of 0x75BCD15. This
has some nice properties compared to integer representations: BCD can make
guarantees about decimal precision, and it is easier to input and output on
keypads and numeric displays. It can even be implemented directly in hardware.
However, it is less memory efficient and slower in calculations.

## KnightOS number format

For KnightOS, I settled on a BCD floating point format similar to TI's
[real variables](http://merthsoft.com/linkguide/ti83+/vars.html#real).
It uses a flag byte, an exponent byte, and seven significand bytes.
While the format isn't perfect, it provides near-compatibility with TI-OS and
can maintain the same numerical precision.

The flag byte currently only uses one bit: the sign of the number (whether it's
positive or negative). In addition, four flag bits are available for program
use, and the remaining three are reserved for future kernel expansion. By
reserving some flags for programs, KnightOS allows them to extend the format
in whatever way best suits their application. TI's format, in contrast, uses
the flag bits to facilitate OS-specific features such as complex numbers and
graphing and does not allocate any for program use.

The exponent byte is the number's signed power of ten, plus the constant
value 0x80. (I don't know why TI adds that offset, but I carried it over to
KnightOS to maintain compatibility.) Example: n x 10^-3 would have an exponent
byte of 0x7D. This gives a theoretical representable range of 10^-128 (0x00) to
10^127 (0xFF). However, certain algorithms struggle with very large exponents.
TI avoids this issue by artificially limiting the range to 10^-99 and 10^99.
Once more complex operations are implemented, KnightOS may need to do something
similar.

The significand is represented as 14 BCD digits packed two per byte, with an
implied decimal point after the first digit. Only the first 10 digits are ever
displayed to the user; the last 4 digits exist to maintain precision. An
important note about the significand is that it must not include any leading
zeroes because they interfere with the floating point alignment code. KnightOS
includes a normalization function to correct for this.

As a complete example, in KnightOS, pi is stored to 14 significant figures as
0x00\_80\_31\_41\_59\_26\_53\_58\_98.

## KnightOS math functions

KnightOS has complete documentation of its decimal math functions
[here](http://www.knightos.org/documentation/reference/decimal_floating_point.html).
Rather than duplicate that, this section explains the features at a high level.

First, why include math support in the kernel? Being an OS for calculators,
userspace programs should reasonably expect the ability to do basic floating
point math out-of-the-box. Since Z80 has severely limited arithmetic
instructions, and most KnightOS programs are written in assembly without the
luxury of C's floats and doubles, that leaves a kernel implementation as the
best option. If programs find that it is insufficient for their needs, they
can always extend or replace it with userspace libraries. But the basic
support should be available by default.

For decimal floating point functions to be useful, one needs numbers to work
with. In KnightOS, `itofp` and `strtofp` parse integers and strings,
respectively, into floating point numbers. (The reverse, `fptostr`, formats
floating point numbers as strings.) `fpLdConst` loads one of several common
constants, such as pi and e, while `fpRand` generates a pseudorandom number
in the range [0, 1).

In addition to generating numbers, KnightOS currently supports many different
operations on them: absolute value, negation, positive addition, multiplication
by powers of ten, comparisons, logical operations, and other miscellaneous
functions. Eventually, KnightOS plans to support arbitrary addition,
subtraction, multiplication, division, exponents, logarithms, trigonometric
functions, etc. More complex features like derivatives and integrals, lists,
complex numbers, etc. will most likely be left to userspace implementations
to avoid bloating the kernel unnecessarily.

## Implementation details

The best way to learn is generally by reading
[the source](https://github.com/KnightOS/kernel/blob/master/src/02/fp-math.asm).
However, because it's written entirely in assembly, some of the interesting
parts are explained in this section.

Generally speaking, the Z80 ISA has some support for BCD operations. It
features an obscure `daa` instruction, Decimal Adjust for Addition, that
makes BCD addition as simple as an `add` followed by `daa`. It essentially
checks if the bottom digit of register A exceeds 9, and if so, adds 6 to carry
the value to the upper digit. It then does the same thing for the upper digit.
Interestingly, the instruction also corrects for BCD subtraction in the same
way.

Besides `daa`, there are also 4-bit rotate instructions, `rrd` and `rld`. These
rotate the BCD digits between register A and the value pointed to by HL.
Using iterations of these instructions can significantly improve efficiency
over repeated bit shifts.

Most of the math functions use IX and IY as floating point inputs and either
overwrite the number in IX or take HL as an output buffer. While this is not
typical of the rest of KnightOS, it makes operations on the data structures
easier. Also, because most operations require two inputs, IX/IY naturally
make more sense as a pair of inputs compared to BC/DE.

The fundamental floating point algorithms (addition, subtraction, etc.)
generally follow this pattern:

1. Align the smaller number's decimal point with the larger one
2. Perform the operation from right to left
3. Shift the significand right if necessary to account for carried values
4. Normalize the final result to remove any leading zeroes

Some operations, such as subtraction, can be performed by taking the 9's or
10's complement of the smaller number, adding them, and then taking the
complement of the result. I attempted to implement this but was unable to
finish it in time, which is why only positive addition is currently supported.
Note that subtraction is simply addition with the second input negated, and
that's exactly how `fpSub` currently works. Once addition is fully working,
subtraction should automatically start to work.

## Conclusion

There is still lots of work to be done before the math library is fully usable.
While I am no longer able to contribute due to my job, I hope that my code
provides a solid foundation for future contributors to build on to make
KnightOS an indispensable tool for students and programmers alike.
