---
title: KnightOS - Introductory Programming Tutorial
layout: base
---

# Introduction to KnightOS Programming

Programmers who wish to use KnightOS should be familiar with z80 assembly. This tutorial assumes you already know how to use it.

We'll walk you through using [sass](https://github.com/KnightSoft/sass) to write KnightOS programs, but you can use most other
assemblers with KnightOS if you please. It's worth noting that most other assemblers use `HEXh` or `$HEX` to notate hexadecimal
numbers. sass uses the more modern approach of `0xHEX`, and `0bBINARY` to notate numbers in bases other than 10.

Before you get started, grab a copy of [kernel.inc](#), which is similar to the ti83plus.inc file you may already be familar with.
KnightOS actually uses a number of include files - one for the kernel, and one for each library you depend on.

## Setting Up

Get a copy of SASS and place it somewhere that your PATH resolves to. Grab all of the KnightOS [include files](#) and place them
somewhere, then set the SASSINC enviornment variable to that path.

## Getting Started

The following is a hello world program for KnightOS, using stdio to print 'Hello, world!' to a terminal:

    #include "kernel.inc"
    #include "stdio.inc"
    .db 0, 50
    .org 0
    start:
        kld(hl, message)
        stdio(printLine)
        ret
    message:
        .db "Hello, world!", 0

To assemble this simple program, use the following command:

    [mono] sass.exe hello-world.asm hello

This will produce a file called 'hello' in the same directory - this is your executable. Send it to your calculator, then copy
it to `/bin` and run `hello` from a terminal. Viola, your first KnightOS program. Let's explain some interesting points.

    #include "kernel.inc"
    #include "stdio.inc"
    .db 0, 50
    .org 0
    start:

This is the header for your program. The "kernel.inc" file contains equates for kernel functions, and macros for
relative-loaded programs. The "stdio.inc" file adds the `stdio(...)` macro, as well as equates for stdio functions. The `.db`
line defines some information the kernel needs from you: the 0 is your thread flags (read the docs about those later), and the
50 is the size of your stack, divided by two (so your stack is 100 bytes long, allowing for 50 PUSH instructions). You have to
explicitly request a certain stack size in KnightOS. Finally, we have `.org 0`, which indicates to the assembler that your
program starts at zero. This allows us to relocate your program when it runs.

**Relocation** is the biggest difference between KnightOS and TIOS. In TIOS, all programs execute from 0x9D95. However, this
is not the case with KnightOS. Because we allow for multitasking, programs may execute from any location. They need to be
**relocatable** - in other words, they need to function correctly no matter where they are in memory. To accomplish this, the
kernel offers help. We use kernel-provided macros (kcall, kjp, and kld) to execute things relatively. Whenever you refer to a
location somewhere within your own program, you must use a k... macro. For example...

    kld(hl, message)
    stdio(printLine)
    ret

Note the use of `kld` here to load the address of the message text into the HL register. At runtime, we change `message` to be
the correct address of that message. Don't worry, though - this doesn't slow things down too much. The kernel relocation
functions modify your code to use the correct address every time, and relocation is only done once per instruction. If you want,
you can even ask the kernel to relocate everything all at once - but there are additional problems this introduces, which we'll
talk more about later.

This code snippet above loads the address of the message into HL, then calls `stdio(printLine)`, which instructs the termianl to
print out that message. Finally, we exit the program with `ret`. You can also exit the program at any time by using
`jp exitThread`. The kernel will find the return point in your stack and jump to it. In most cases, this will be
`killCurrentThread`, a kernel function that kills your thread and cleans up its resources. However, it is possible to change
your return point, so you're advised to use `exitThread` instead.

## Differences from TIOS

There are a few things beyond relocation you should know about:

* You can use every register without fear, including shadow registers. However, registers I and R are not guaranteed to retain
  their value between threads.
* There is no "safe RAM" on KnightOS. You allocate memory and use pointers to access it.
* KnightOS has a proper filesystem - not variables. You manipulate files like you would on a computer, no VAT or Archive.
* RAM is reset every time you reboot KnightOS. Do not keep anything there. All files are stored in Flash.

## Memory Management

Let's modify our program slightly to receive user input. Here's our code:

    #include "kernel.inc"
    #include "stdio.inc"
    .db 0, 20
    .org 0
    start:
        kld(hl, message)
        stdio(printString)

        ld bc, 128
        call malloc ; Allocate memory for the user's response
        push ix \ pop hl

        stdio(readLine) ; Get the user's response in (HL)

        push hl
            kld(hl, message2)
            stdio(printString) ; Print out a second message
        pop hl

        stdio(printString) ; Print out the user's response

        kld(hl, message3)
        stdio(printString)
        ret
    message:
        .db "What is your name?\n", 0
    message2:
        .db "Hello, ", 0
    message3:
        .db "!\n", 0

Note these line here:

    ld bc, 128
    call malloc

The kernel function [`malloc`](#) allocates some memory and returns a pointer to it in IX. You can use
this memory for whatever you need - in our case, reading input from the user. Don't worry about freeing
this memory (with the kernel function [`free`](#)), the kernel will clean it up for you when you exit.
However, you should make sure you free memory you use in a loop, since the leaked memory does build up.

## Graphical Programs

Let's make a program that uses the LCD instead of the terminal.

    #include "kernel.inc"
    .db 0, 20
    .org 0
    start:
        ; Get locks on the hardware we need
        call getLcdLock
        call getKeypadLock

        ; Allocate a display buffer to draw on
        call allocScreenBuffer
        call clearBuffer

        ; Tell the user how to exit
        kld(hl, message)
        ld de, 0x0000 ; (D, E) is (X, Y)
        call drawStr
        ; drawStr will draw the text in (hl) on the display buffer at (D, E)

        ; Enter a loop of drawing a smiley face on the screen
        kld(hl, sprite)
        ld de, 0x0210 ; (X, Y)
    loop:
        ld b, 5 ; Height in pixels
        ; Draw the sprite on the screen
        call putSpriteXOR
        call fastCopy

        ; Handle keyboard input
        call getKey
        cp kClear
        ret z ; Exit on [CLEAR]
        cp kUp
        jr z, doUp
        cp kDown
        jr z, doDown
        cp kLeft
        jr z, doLeft
        cp kRight
        jr nz, loop
    doUp:
        dec e \ jr loop
    doDown:
        inc e \ jr loop
    doLeft:
        dec d \ jr loop
    doRight:
        inc d \ jr loop

    message:
        .db "Press [CLEAR] to exit.", 0
    sprite:
        .db 0b01010000
        .db 0b01010000
        .db 0b00000000
        .db 0b10001000
        .db 0b01110000

This program will draw a smiley face on the screen and allow the user to move it around with the
arrow keys. The following things are of note:

* You must get a lock for any hardware you want to use - in this case, the LCD and keypad.
* You can use the `jr` instruction normally, without relocating it.
* We have to allocate a screen buffer with allocScreenBuffer
  * You can alternatively manually allocate it. All display functions expect a screen buffer to
    be passed in via the IY register.

## Getting into the Castle

In order to get your program into the Castle, you need to do a little extra work. All the programs
shown above only include the kernel header. KnightOS has an additional header it wants your
program to include. Modify the header of the last program to look like this:

    #include "kernel.inc"
    .db 0, 20
    .org 0
        jr start
        .db 'K' ; Magic number
        .db 0 ; Userspace flags
        .db "Super cool demo", 0 ; Description
    start:
        ; ...

This header is required for any programs that want to interact with KnightOS proper. This will
allow your program to be added to the castle and to show up on the thread list (we'll talk about
getting out of your thread shortly). The castle maintains a file (`/etc/castle.list`) that lists
all programs installed on your calculator, which are shown in the castle. Note that this is
different from `/etc/packages.list`, which kpm (the KnightOS Package Manager) uses to keep track
of packages. **Not all packages are shown in the castle, you must put them there explicitly.**
Luckily, the castle offers a program you can run to get yours into the castle:

    creg /path/to/binary

This will look for the userspace header and copy your information into `/etc/castle.list`. Viola,
you'll now show up in "All Programs" on the castle.

## Leaving your thread

You probably want users to be able to get out of your thread. After all, what use is a system
with multitasking if your users can't use other tasks? To let them do so, you need to offer some
kind of suspension mechanism.

**Note**: KnightOS GUI programs have this built in. No worries if you're just doing those.

If you want to leave your thread, you have to launch another program. Generally, you'll want to
launch the castle or the thread list. To launch another program, try this:

        kld(de, programPath)
        call launchProgram
        call suspendCurrentThread
        ; ...
    programPath:
        .db "/bin/castle", 0

The thread list is in `/bin/threadlist`. Also, take a look at that `suspendCurrentThread` function.
Keep this in mind - when your thread is active, it slows down the calculator. If you aren't doing
anything after the user switches to another thread, you should suspend your own thread. This will
halt execution until the user asks for your program again (generally via the thread list). Again,
GUI programs needn't worry about this - it's done for you.

## Using Libraries

Libraries are an important part of KnightOS. They're pretty simple to use - you need to load them,
then you can use them via macros. You've already used stdio to talk to a terminal. You don't need
to load stdio, since the terminal makes sure it's loaded before your program runs. Here's an example
of using applib:

    #include "kernel.inc"
    #include "applib.inc"
    .db 0, 20
    .org 0
        jr start
        .db 'K'
        .db 0
        .db "Test program", 0
    start:
        ; Load applib
        kld(de, applibPath)
        call loadLibrary

        ; ...
        ret ; Libraries are unloaded automatically
    applibPath:
        .db "/lib/applib", 0

## In Conclusion

That should be about everything you need to start making basic applications. Make sure you read
through the kernel documentation to see what functions are available to you. You should also read
documentation for KnightOS libraries to learn how they work and how to use them.
