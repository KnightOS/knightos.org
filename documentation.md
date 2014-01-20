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

## Tutorials & Articles

There are a number of articles documenting the system in prose.

### KnightOS Articles

* [Introductory Programming Tutorial](/docs/intro-programming-tutorial.html)
* [Package management](#)
* [Writing libraries for KnightOS](#)
* [Designing graphical interfaces](#)
* [unixcommon man pages](#)

### Kernel Articles

* [Using the kernel in your own OS](#)
* [Kernel design documents](#)
* [Source code design](#)

## Kernel Documentation

The kernel has automatically generated documentation based on comments in the source code that document
each kernel function. This documentation is split up into several categories:

* [Color](/docs/reference/color.html): Color graphics for the TI-84+ CSE
* [Cryptography](/docs/reference/crypto.html): Cryptographic hashing functions
* [Display](/docs/reference/display.html): Functions for manipulating monochrome display buffers
* [File Streams](/docs/reference/file_streams.html): File stream reading, writing, seeking, etc
* [Filesystem](/docs/reference/filesystem.html): KnightOS filesystem driver
* [Flash](/docs/reference/flash.html): Low-level Flash storage driver
* [Hardware](/docs/reference/hardware.html): Hardware management and thread-safe sharing
* [Input](/docs/reference/input.html): Keyboard input functions
* [Miscellaneous](/docs/reference/miscellaneous.html): Various utility and helper functions
* [System](/docs/reference/system.html): Core functions for interacting with the kernel
* [Text](/docs/reference/text.html): Rendering and measuring text on monochrome display buffers
* [Threading](/docs/reference/threading.html): Thread creation and management functions

## Library Documentation

There are many libraries that ship with KnightOS that you may wish to become familiar with. Each of these
also has automatically generated documentation, but also may have a number of articles documenting them in
prose.

* [applib](#): Functions and utilities that help integrate with the KnightOS enviornment
* [stdio](#): For communicating between processes, similar to Unix pipes
