---
# vim: tw=80
layout: page-header
title: Google Summer of Code 2015

#
# Hello! Are you hoping to contribute to this file? Simply follow the style
# that's already in place for existing proposals and send a pull request on
# GitHub. You should talk your ideas over in our IRC channel, too! We hang out
# at #knightos on irc.libera.chat
#
# Here's a template for you:
#   
#   [...]
#   
#   **Expected results**
#   
#   [...]
#   
#   **Knowledge prerequisites**
#   
#   [...]
#   
#   **Skill level**: [low,medium,high]
#   
#   **Mentor**: [...]

---

KnightOS is applying as a mentor organization for Google Summer of Code 2015.
This list of ideas for students should get you heading down the right path. If
you have your own proposal, we'd love to hear it! Stop by IRC and brainstorm
with us or [send a pull
request](https://github.com/KnightOS/knightos.org/edit/gh-pages/gsoc/index.md).
If we can match you with a mentor and the idea is solid, we'll get you going.
The KnightOS project is a very student-driven project and we want to see
students shape it. Please don't hesitate to get involved.  Discussion for GSOC
and KnightOS happens in #knightos-gsoc on irc.libera.chat and in the [mailing
list](http://lists.sr.ht/~pixelherodev/knightos).

# Ideas

If you still need more inspiration, pick through our [issue
tracker](https://github.com/KnightOS/KnightOS/issues) for some ideas. You're
welcome to find ideas outside of this list - this is just a bunch of things that
the KnightOS world wants and that we think you can help with. If you're
interested in any of these ideas and aren't participating in GSOC, you're still
welcome to come chat with us and take something on.

## Lua Port

Lua is a highly portable programming language that has already been ported to
many embedded systems. Porting it to KnightOS (a non-POSIX) system will be
challenging, but is feasible. It's written in ANSI C and you might need to make
some patches to our compiler and libc implementation to get it working.

**Expected results**

Programmers can run software for KnightOS written in Lua.

**Knowledge prerequisites**

Highly comfortable with C and intermediate experience with assembly.

**Skill level**: High

**Mentor**: [Jose Diez \<me@jdiez.me>](mailto:me@jdiez.me)

## TI-Basic Implementation

TI-Basic is the official programming language of TI-OS, and there is a large
body of software available written in TI-Basic. An interpreter that runs on
KnightOS would bring a lot of software to the platform.

**Expected results**

Enough of TI-Basic is supported to run several common programs that already
exist for TI-OS.

**Knowledge prerequisites**

Assembly.

**Skill level**: Medium to high

**Mentor**: [Drew DeVault \<sir@cmpwn.com>](mailto:sir@cmpwn.com)

## Floating point support in kernel

Floating point arithmetic can be done on KnightOS if you write C, but assembly
programmers are left out - and assembly is the best way to write efficient
programs for the system.

**Expected results**

Basic arithmetic functionality is provided for floating point numbers, as well
as a collection of functions for common higher-level operations (i.e.
logarithms). Bonus points for building something cool on top of it.

**Knowledge prerequisites**

You'll need existing knowledge of floating point arithmetic, and you will need
to be very comfortable with assembly.

**Skill level**: High

**Mentor**: None (bring it up on IRC to find one)

## FUSE mounting calculators on Linux

KnightOS has no support for linking with a computer, which means you can't
transfer files after the initial install. This is clearly not ideal. Mounting a
calculator to your PC with FUSE would be incredibly cool. You will have to
design a protocol to use between the calculator and computer and will have to
implement both sides of that protocol.

**Expected results**

Users are able to connect their calculators to a PC and mount the filesystem.
Bonus points if you can browse one calculator's filesystem on another calculator.

**Knowledge prerequisites**

Intermediate knowledge with both C and assembly will serve you well here.

**Skill level**: Medium

**Mentor**: [Drew DeVault \<sir@cmpwn.com>](mailto:sir@cmpwn.com)

## C99 Support for kcc

kcc, the KnightOS C compiler, has support for ANSI C but is missing a lot of
C99. Implement it! We can also send your patches upstream to SDCC, which KCC is
forked from.

**Expected results**

kcc is able to compile the average C99 project successfully.

**Knowledge prerequisites**

Heavy expertise with the C programming language is required. A background in
assembly is helpful but advanced knowledge is probably not necessary.

**Skill level**: High

**Mentor**: [Drew DeVault \<sir@cmpwn.com>](mailto:sir@cmpwn.com)

## z80e Windows port

z80e currently only runs on Linux and OS X (and probably other Unix systems). A
windows frontend would reduce the cost of entry for new devs interested in the
project.

**Expected results**

The z80e SDL frontend works (and all features) on Windows.

**Knowledge prerequisites**

An understanding of Windows programming and C is required.

**Skill level**: Novice

**Mentor**: [Kevin Lange \<klange@dakko.us>](mailto:klange@dakko.us)

## Graphical debugger for z80

Not everyone likes a gdb-style debugger. A z80e frontend built with Qt or GTK or
some other GUI toolkit would be an interesting and helpful project.

**Expected results**

Programmers can debug their KnightOS programs with a graphical debugger. Things
like register values, memory dumps, and a disassembly would go far here.

**Knowledge prerequisites**

You should have knowledge using the graphical toolkit you want to build this
with, as well as a moderate degree of knowledge with C.

**Skill level**: Novice to medium

**Mentor**: [Kevin Lange \<klange@dakko.us>](mailto:klange@dakko.us)

## Emscripten wrapper for scas

z80e includes a JavaScript wrapper in the form of OpenTI that lets JavaScript
users do z80 emulation. A similar tool for scas would allow JavaScript
programmers to build in-browser assembly tools.

**Expected results**

JavaScript programmers can interact with scas with a JavaScript-friendly API.
You will be expected to build some useful in-browser tool to show this off.

**Knowledge prerequisites**

A high degree of JavaScript knowledge is required. You can get by with only a
basic understanding of C.

**Skill level**: Medium

**Mentor**: [Drew DeVault \<sir@cmpwn.com>](mailto:sir@cmpwn.com)

## Welcome program

Upon the initial install of KnightOS, it would be useful to run a program
that learns about the user (their username, date/time, etc) and introduce the
new user to the system.

**Expected results**

When installing KnightOS for the first time, this program runs and then removes
itself.

**Knowledge prerequisites**

Moderate assembly skill.

**Skill level**: Low to medium

**Mentor**: [Drew DeVault \<sir@cmpwn.com>](mailto:sir@cmpwn.com)
