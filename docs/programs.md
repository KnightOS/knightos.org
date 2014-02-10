---
title: Userland programs
layout: base
---

# Userland Programs

The kernel provides multitasking and runs all userland programs from RAM. The address these programs
run from is not known at compile-time, and you must design them with relocation in mind. Depending on
your kernel configuration, up to 32 threads can run concurrently.

## Kernel Header

The first two bytes of a program is the header. The first byte is the required thread flags (0 is a
suitable default), and the second byte is the stack size. The stack size is notated in words, so a
stack size of 5 will allocate 10 bytes of space. All programs should originate at address 0, and will
be relocated at runtime.

    ; Example program
    .nolist
    #include "kernel.inc"
    .list
        .db 0  ; Thread flags
        .db 20 ; Stack size
    .org 0
    start:
        ; ...
        ret

## Relocation

Unlike TI-OS, KnightOS programs do not always run from 0x9D95. Programs should use `.org 0` and use
relative references to refer to internal code and data. The k-macros can be used to relocate common
instructions at runtime. For example:

        ; Wrong:
        ld hl, message
        ; Right:
        kld(hl, message)
    .message:
        .db "Hello, world!", 0

At runtime, this will be adjusted to use the appropriate address. The kernel will modify the code
in RAM to use the correct address without any overhead, after the first time it runs. The following
k-macros are available in kernel.inc:

* `kld(reg16, imm16)`
* `kld((imm16), a)`
* `kld(a, (imm16))`
* `kcall(imm16)`
* `kcall(cc, imm16)`
* `kjp(imm16)`
* `kjp(cc, imm16)`

Where `imm16` is a 16-bit immediate value, `reg16` is a 16-bit register, and `cc` is a flag conditional.

Note that some z80 instructions, like `jr` and `djnz`, are already relative and do not need to be
relocated.

## Memory Management

In KnightOS, nearly all 32K of memory is availble to you (the exact amount changes based on your kernel
configuration). In contrast to TI-OS, there is no "safe RAM", instead, you specify how much memory you
need and are assigned some. This is accomplished with [malloc](/docs/reference/system.html#malloc).
You need to be careful not to overwrite memory that doesn't belong to you - all programs share the same
memory and there is no memory protection.

## Hardware Locking

To use the LCD, keyboard, I/O, or USB port, you must acquire a lock to avoid interfering with other
programs. The relevant functions are documented [here](/docs/reference/hardware.html).

## Kernel API

Most kernel functions accept registers as input, and will preserve all registers that are not used to
return some information. Additionally, there are some consistent ideas in use. Generally speaking,

* HL is used for addresses and the source address of an operation
* DE is used for destinations, or the second argument of a function requiring two addresses
* BC is used for length
* Z is set on success, and reset on error. When reset, A contains an error code.
* IY is used for monochrome display buffers
* IX is used for allocated memory
* Shadow registers are free for userspace use

Kernel functions are documented [here](/documentation.html).

## Writing for multiple platforms

KnightOS and its kernel run on 9 different calculator models, and your code can, too. The most remarkable
differences between the supported models are:

* Filesystem size
  * Stick to the kernel filesytem API and handle errors correctly and you'll be fine
* Color or monochrome screens
  * Monochrome programs will run without modification on color calculators. The reverse is not true, you will have to handle this yourself.
* Time and date
  * Time and date arithmetic is supported on all calculators, but certain calculators return errUnsupported for getting and setting the current time.
* USB
  * errUnsupported is returned on some calculators.

There are a few other differences, but you should be fine if you handle errUnsupported correctly.

## Text Encoding

The kernel uses ASCII for text. There are loose plans to eventually move to UTF-8.

## Example Program

Here is a simple example program that will run on the KnightOS kernel:

    ; Example program
    .nolist
    #include "kernel.inc"
    .list
        .db 0  ; Thread flags
        .db 20 ; Stack size
    .org 0
    start:
        call getLcdLock
        call getKeypadLock
        call allocScreenBuffer ; Allocates a 768-byte screen buffer to IY
        call clearBuffer
        kld(hl, message)
        ld de, 0
        ld b, 0
        call drawStr
        call fastCopy
        call flushKeys ; Wait for all keys to be released
        call waitKey ; Wait for a key to be pressed
        ret
    message:
        .db "Hello, world!\nPress any key to exit.", 0
