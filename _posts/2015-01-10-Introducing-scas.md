---
# vim: tw=80
title: The new KnightOS assembler/linker
author: Drew DeVault
layout: post
---

KnightOS has a brand new assembler, and this time a linker was invited to the
party as well. Let's introduce some of the things that make it awesome, as well
as explain the motivation behind it and how it works. This post should be the
first stop for anyone who hopes to contribute to the new assembler.

Without further ado: please welcome **scas** to the KnightOS world! **scas**
stands for "SirCmpwn's Assembler", which is a throwback to the old "sass"
assembler, but this time without binaries that conflict with a certain CSS
preprocessor. This time, though, it's not a solo effort. scas has currently been
built by the efforts of myself, puckipedia, and mrout.

## Background

KnightOS has been compiled by several different assemblers. In this order:

* Zilog Developer Studio (proprietary and Windows-only)
* spasm (Windows-only)
* sass
* scas

ZDS was pretty bad. I originally used it because Brandon Wilson used it for
[OS2](http://brandonw.net/calculators/OS2/) and I was using a lot of his project
model. It was a poor choice for obvious reasons. Then, for a rather long time,
KnightOS switched to spasm. However, spasm had problems with macros. After
bugging the maintainers for a long time, it became clear that the problems
weren't going to be fixed. I got pretty sick of running it with Wine, too.

Enter stage: sass. At the time, I was more concerned with writing KnightOS than
with writing assemblers, so sass is a very ugly codebase written in C#. However,
it met a lot of really important goals:

* Flexible assembly syntax that was compatible with most styles
* More modern reccommended syntax
* Local labels and flexible tooling

From the outside, sass looks like a great assembler. However, on the inside it's
an unmaintainable mess and only runs where Mono is available, which crosses out
the pipe dream of a self-hosting KnightOS. The system was compiled with sass for
a couple of years, and I decided fairly recently that it was time for a better
scas.

## What scas does better

scas is a complete rewrite of the assembler, this time done slowly and in C.
It's (mostly) compatible with several assembly syntaxes now:

* sass
* spasm
* tasm
* ASxxxx (new)

The last one is important - it's the syntax the new [KnightOS C
compiler](https://github.com/KnightOS) uses! The decision to build scas was
largely kick-started by the desire to replace ASxxxx for kcc with something
better. For that, we needed an assembler with a seperate linking step. And now
we come to the most important change that scas brings to the table.

## A seperate linker

The majority of assemblers targetting z80 do assembly and linking all at once.
For those who are unaware, assembly is the process of translating mnomics into
machine code, and linking is the process of resolving symbols. For example, if I
were to assemble this code:

    call example

I needn't know about the "example" label if linking is done in a seperate step.
Instead, I assemble this as if it reads `call 0` and make a note of the fact
that it references "example". During the linking step, we gather all the symbols
and resolve this reference when producing the final machine code.

Another good thing about linking is that it gives us greater control to modify
code automatically. For example, scas is capable of automatically inserting
KnightOS relocation instructions, and updating all the relevant references
afterwards. We can also do things like optimizing out unused functions as
indicated by kcc's `.function` directives (this is an important part of our our
[libc](https://github.com/KnightOS/libc) works).

On top of that, a linker allows us to do incremental compilation. The kernel
takes about 3.5 seconds to compile with sass, and compiling the entire userspace
takes even longer. However, with scas, we can compile each file seperately and
produced an unlinked *object file*, which just has machine code and references
to other files. Recompiling a single object file in the kernel takes less than a
tenth of a second, and then the only step left is linking. This starts to matter
more when we throw some things like C sources into the mix.

There are many other doors opened by a seperate linker, and I'm happy that we've
made the plunge. I hope to see more of the z80 community follow in our footsteps
on this matter.

## Current status

scas is nearly complete, but we haven't fully replaced sass yet. The kernel is
still built with sass, and some parts of the userspace still require it. There
are bugs to iron out, and we need to port it to Windows (it runs in cygwin,
though). I expect that we'll be able to do some really cool things with it going
forward, including the possibility of building out C for TIOS and even perhaps
porting it to a few calculators! New contributors are as welcome as ever, so
feel free to start [hacking away](https://github.com/KnightOS/scas) with it.
