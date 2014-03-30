---
title: KnightOS Documentation
layout: documentation
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

* [Color](/documentation/reference/color.html): Color graphics for the TI-84+ CSE
* [Cryptography](/documentation/reference/crypto.html): Cryptographic hashing functions
* [Display](/documentation/reference/display.html): Functions for manipulating monochrome display buffers
* [File Streams](/documentation/reference/file_stream.html): File stream reading, writing, seeking, etc
* [Filesystem](/documentation/reference/filesystem.html): KnightOS filesystem driver
* [Flash](/documentation/reference/flash.html): Low-level Flash storage driver
* [Hardware](/documentation/reference/hardware.html): Hardware management and thread-safe sharing
* [Input](/documentation/reference/input.html): Keyboard input functions
* [Miscellaneous](/documentation/reference/miscellaneous.html): Various utility and helper functions
* [System](/documentation/reference/system.html): Core functions for interacting with the kernel
* [Text](/documentation/reference/text.html): Rendering and measuring text on monochrome display buffers
* [Threading](/documentation/reference/threading.html): Thread creation and management functions

### Articles

There are additional articles that document the kernel in more detail:

* [KnightOS Filesystem Specification (KFS)](/documentation/kfs.html)
* [Library implementation and usage](/documentation/libraries.html)
* [Memory layout](/documentation/memory.html)
* [Userland programs](/documentation/programs.html)
