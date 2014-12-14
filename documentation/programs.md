---
# vim: tw=82
title: Writing Userspace Programs
layout: page
---

# Writing Userspace Programs

KnightOS is a very special sort of operating system. It is radically different
from TIOS. It is divided into two parts: the kernel, and userspace. The kernel is
the basis of the system. It exists on pages 0-3 (inclusive). The first page is
always mapped to bank 0, and is therefore accessible at 0x0000-0x3FFF (inclusive)
in memory. This part of the system is responsible for all the core functionality -
booting, memory management, hardware drivers, filesystem access, and so on. The
kernel very rarely interacts with the user.

The stuff you actually interact with when using KnightOS is the userspace. The
castle is in userspace, as well as the application switcher, the math app, the
settings app, and so on. These are implemented as userspace programs, the same
ones that this document describes. If you are curious about how any of these
programs work, or if you want to modify or improve them yourself, you can browse
their [source code](https://github.com/KnightOS/KnightOS) online.

Some of the things commonly handled by each are covered here:

* The kernel handles...
  * Booting up the system
  * Multitasking
  * Filesystem access
  * Memory management
  * Device drivers (the screen, keypad, etc)
  * Text rendering
  * Graphics
* Userspace handles...
  * Graphical User Interface (the look and feel)
  * Package management
  * Applications like Math and Settings
  * Libraries like fx3d and corelib

## Executable format

Your programs must use a certain format for the kernel to agree to load them. A
simple template is provided here, and you may read [additional
docs](/documentation/kexc.html) later to learn more about it.

{% highlight nasm %}
#include "kernel.inc"
    .db "KEXC"
    .db KEXC_ENTRY_POINT
    .dw start
    .db KEXC_STACK_SIZE
    .dw 50
    .db KEXC_KERNEL_VER
    .db 0, 6
    .db KEXC_NAME
    .dw name
    .db KEXC_DESCRIPTION
    .dw description
    .db KEXC_HEADER_END
name:
    .db "The short name of your application", 0
description:
    .db "A longer description of your application. You should target this one"
    .db "to 3 or 4 sentences", 0
start:
    ; Your code here
{% endhighlight %}

Here is a version of this template with comments explaining each choice:

{% highlight nasm %}
#include "kernel.inc"
; If you would like to use any other libraries, include them here (i.e.  "corelib.inc")
    .db "KEXC"      ; You must include this, and you cannot change it
    .db KEXC_ENTRY_POINT
    .dw start       ; This is the starting point of your program.
    .db KEXC_STACK_SIZE
    .dw 50          ; This is the amount of stack you need, divided by two. Optional.
    .db KEXC_KERNEL_VER
    .db 0, 6        ; The minimum kernel version your code can run on. Optional.
    .db KEXC_NAME
    .dw name        ; The name of your program. Optional.
    .db KEXC_DESCRIPTION
    .dw description ; The description of your program. Optional.
    .db KEXC_HEADER_END
name:
    .db "The short name of your application", 0
description:
    .db "A longer description of your application. You should target this one"
    .db "to 3 or 4 sentences", 0
start:
    ; Your code here
{% endhighlight %}

You may assemble this with any assembler you please. In addition to using KEXC
(the format described here, for native code), you may use shebangs for
interpreted programs. For example: 

{% highlight python %}
#!/bin/bfi
++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.
{% endhighlight %}

The `#!/bin/bfi` indicates that the path to the file being run should be set into
HL and the program `/bin/bfi` should be launched to handle it. Of course, you need
to have bfi installed on your system for this to work.

## Relocation and multitasking

The first and most important thing to understand about KnightOS programs is that
they do not run from a consistent location. On TIOS, you can always be confident
that your code will run at 0x9D95 (and you often start your programs with
`.org 0x9D95` as a result). This is not the case on KnightOS. Instead, your
program, as well as many other programs, are given space all over memory. The
exact location is determined at runtime and changes frequently.

To deal with this, KnightOS programs must be relocatable. Luckily, this is not
very difficult. The kernel provides some mechanisms with which you are able to
run your programs from arbituary addresses.

There are a number of macros included in kernel.inc to assist with relocation.
They are:

* `kcall([cc,] address)`
* `kjp([cc,] address)`
* `kld(register, address)`

These function exactly like the z80 instructions `call`, `jp`, and `ld`,
respectively. You must use these when referring to addresses within your own
executable. For example:

{% highlight nasm %}
    ld hl, message   ; BAD
    kld(hl, message) ; GOOD
    ld hl, 1234      ; This is okay, it's not a reference

    call foobar      ; BAD
    kcall(foobar)    ; GOOD

message:
    .db "Hello world!"
foobar:
    ; Some subroutine
{% endhighlight %}

At runtime, the actual address will be resolved by the kernel. The first time you
run this, it will take longer to run as it calculates the address. However, on
subsequent attempts, it will take the original duration of the instruction, plus
one NOP. This is a trivial slowdown for nearly all applications.

The benefit gained by going through all this extra effort is enormous: the ability
to run several programs *at once*. In addition to that, your own programs can run
several of their own threads, which each run simultaneously. There are a number of
advanced topics surrounding this that will be discussed later.

## Interacting with the kernel

The kernel provides a large number of useful functions that you will likely want
to take advantage of. You may do so by using `pcall`. This is similar to TIOS's
bcalls. You can use them like so:

{% highlight nasm %}
pcall(name_of_function)
{% endhighlight %}

For example, to use [drawStr](/documentation/reference/text.html#drawStr):

{% highlight nasm %}
kld(hl, message)
ld de, 0
ld b, 0
pcall(drawStr)
{% endhighlight %}

All kernel functions [are documented online](/documentation).

## Interacting with hardware

If you wish to interact with the screen, keyboard, or other devices, you need to
play nice with other programs. Only one program may use these devices at a time.
You must use the [relevant kernel
functions](/documentation/reference/hardware.html) to claim these devices.

## Allocating Memory

There is no "safe RAM" on KnightOS. Instead, you allocate memory as you need it.
There are two acceptable means of setting aside memory:

* Set it aside in your program (useful for fixed amounts of memory)
* Allocate it with [malloc](/documentation/reference/system.html#malloc) (useful
  for dynamic amounts of memory)

You should free memory with [free](/documentation/reference/system.html#free) when
you are done with it. The kernel automatically frees all assigned memory when your
program exits, but you should free things that you aren't using to keep more
memory available for other programs.

## A full example

Here is an example userspace program that says "hello world", waits for the user
to press a key, and exits.

{% highlight nasm %}
#include "kernel.inc"
    .db "KEXC"
    .db KEXC_ENTRY_POINT
    .dw start
    .db KEXC_STACK_SIZE
    .dw 50
    .db KEXC_KERNEL_VER
    .db 0, 6
    .db KEXC_NAME
    .dw name
    .db KEXC_DESCRIPTION
    .dw description
    .db KEXC_HEADER_END
name:
    .db "Hello world", 0
description:
    .db "Displays hello world on the screen, waits for a key press, then exits", 0
start:
    ; Acquire a lock on the devices we intend to use
    pcall(getLcdLock)
    pcall(getKeypadLock)

    ; Allocate some memory to store the screen contents in
    pcall(allocScreenBuffer)
    ; Clear it - it will be garbage by default
    pcall(clearBuffer)

    ; Draw text on the screen
    kld(hl, message)
    ld de, 0
    ld b, 0
    pcall(drawStr)

    ; Draw the buffer to the screen
    pcall(fastCopy)

    ; Wait for the user to release all keys...
    pcall(flushKeys)
    ; Then wait for them to press one.
    pcall(waitKey)

    ; Then, exit.
    ; The screen buffer you allocated earlier will be automatically freed.
    ret

message:
    .db "Hello, world!", 0
{% endhighlight %}

You may find it useful to read the documentation for each of the kernel functions
in use here:

* [getLcdLock](/documentation/reference/hardware.html#getLcdLock)
* [getKeypadLock](documentation/reference/hardware.html#getKeypadLock)
* [allocScreenBuffer](/documentation/reference/display.html#allocScreenBuffer)
* [clearBuffer](/documentation/reference/display.html#clearBuffer)
* [drawStr](/documentation/reference/text.html#drawStr)
* [fastCopy](/documentation/reference/display.html#fastCopy)
* [flushKeys](/documentation/reference/input.html#flushKeys)
* [waitKey](/documentation/reference/input.html#waitKey)

## Using libraries

KnightOS provides a number of libraries that you are able to use to interact with
the system in a more natural way. Users can also build their own libraries that
you can take advantage of. To use a library, you should `#include` that library's
include file, and then use the appropriate macros to interact with it. You must
also inform the kernel that you wish to use a particular library, via
[loadLibrary](/documentation/reference/system.html#loadLibrary). Here is an
example of how you might use [corelib](#):

{% highlight nasm %}
#include "corelib.inc"
; ...the rest of your header
start:
    kld(hl, corelibPath)
    pcall(loadLibrary) ; Load corelib
    ; ...
    corelib(appGetKey) ; Use corelib
    ; ...
corelibPath:
    .db "/lib/core", 0
{% endhighlight %}

Libraries are generally installed into `/lib`. Consult each library's
documentation for more information on how to use that particular library.
