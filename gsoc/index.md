---
# vim: tw=80
layout: page-header
title: Google Summer of Code 2015

#
# Hello! Are you hoping to contribute to this file? Simply follow the style
# that's already in place for existing proposals and send a pull request on
# GitHub. You should talk your ideas over in our IRC channel, too! We hang out
# at #knightos on irc.freenode.net
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
and KnightOS happens on
[IRC](http://webchat.freenode.net/?channels=knightos&uio=d4) and in the [mailing
list](http://lists.knightos.org).

<div class="alert alert-warning">We're looking for a somewhat larger pool of
mentors to draw from - if you're interested, please come chat with us in IRC.</div>

# Ideas

If you still need more inspiration, pick through our [issue
tracker](https://github.com/KnightOS/KnightOS/issues) for some ideas. You're
welcome to find ideas outside of this list - this is just a bunch of things that
the KnightOS world wants and that we think you can help with. If you're
interested in any of these ideas and aren't participating in GSOC, you're still
welcome to come chat with us and take something on.

## Implement Math Support

What good is a calculator that can't do calculations? KnightOS is good for lots
of things, but there still isn't a way to simply do math with it. The old "build
a calculator" program you did when you were learning isn't like this - you'll be
expected to build an expression parser and a GUI from scratch (without a GUI
toolkit!). Expect a challenging and rewarding project from this.

**Expected results**

Some sort of application with which someone could do mathematical calculations
for day-to-day calculator use. It should parse expression strings and have
support for fancier features like hexadecimal literals and higher-level math
functions.

**Knowledge prerequisites**

A healthy knowledge of lower-level concepts is required here, but the actual
implementation must be done in C or assembly.

**Skill level**: Medium

**Mentor**: [Drew DeVault \<sir@cmpwn.com>](mailto:sir@cmpwn.com)

## Lua Port

Lua is a highly portable programming language that has been ported to many
embedded systems. Porting it to KnightOS (a non-POSIX) system will be
challenging, but is feasible.

**Expected results**

Programmers can run software for KnightOS written in Lua.

**Knowledge prerequisites**

Highly comfortable with C and intermediate experience with assembly.

**Skill level**: High

**Mentor**: [Jose Diez \<me@jdiez.me>](mailto:me@jdiez.me)

## Floating point support in kernel

Floating point arithmetic can be done on KnightOS if you write C, but assembly
programmers are left out - and assembly is the best way to write effecient
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
calculator to your PC with FUSE would be incredibly cool.

**Expected results**

Users are able to connect their calculators to a PC and mount the filesystem.

**Knowledge prerequisites**

Intermediate knowledge with both C and assembly will serve you well here.

**Skill level**: Medium

**Mentor**: [Drew DeVault \<sir@cmpwn.com>](mailto:sir@cmpwn.com)

## C99 Support for kcc

kcc, the KnightOS C compiler, has support for ANSI C but is missing a lot of
C99. Implement it!

**Expected results**

kcc is able to compile the average C99 project successfully.

**Knowledge prerequisites**

Heavy expertise with the C programming language is required. A background in
assembly is helpful but advanced knowledge is probably not neccessary.

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

**Mentor**: None (bring it up on IRC to find one)

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

**Mentor**: [Jose Diez \<me@jdiez.me>](mailto:me@jdiez.me)

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

**Mentor**: None (bring it up on IRC to find one)
