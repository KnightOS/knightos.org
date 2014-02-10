---
title: KnightOS Documentation
layout: base
---

# Documentation

**Note: KnightOS is still in development and documentation efforts are ongoing.**

KnightOS is designed with programmers in mind. The system itself is written entirely in z80 assembly,
and the API is meant to be easy to use for those familiar with programming on the stock OS. There are
a number of additional considerations, however, that you should keep in mind when working with
KnightOS.

## Kernel Documentation

The following links document the kernel API, which is available for userspace programs and works
on any KnightOS-based operating system. It is generated from comments in the kernel source code.
You'll need to include kernel.inc to use these in your programs (this file is generated when compiling
the kernel).

* [Color](/docs/reference/color.html): Color graphics for the TI-84+ CSE
* [Cryptography](/docs/reference/crypto.html): Cryptographic hashing functions
* [Display](/docs/reference/display.html): Functions for manipulating monochrome display buffers
* [File Streams](/docs/reference/file_stream.html): File stream reading, writing, seeking, etc
* [Filesystem](/docs/reference/filesystem.html): KnightOS filesystem driver
* [Flash](/docs/reference/flash.html): Low-level Flash storage driver
* [Hardware](/docs/reference/hardware.html): Hardware management and thread-safe sharing
* [Input](/docs/reference/input.html): Keyboard input functions
* [Miscellaneous](/docs/reference/miscellaneous.html): Various utility and helper functions
* [System](/docs/reference/system.html): Core functions for interacting with the kernel
* [Text](/docs/reference/text.html): Rendering and measuring text on monochrome display buffers
* [Threading](/docs/reference/threading.html): Thread creation and management functions

### Articles

There are additional articles that document the kernel in more detail:

* [KnightOS Filesystem Specification (KFS)](/docs/kfs.html)
* [Library implementation and usage](/docs/libraries.html)
* [Memory layout](/docs/memory.html)
* [Userland programs](/docs/programs.html)
