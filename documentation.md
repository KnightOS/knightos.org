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

* [Introductory Programming Tutorial](#)
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

* [System](#): Basic system manipulation and core functions
* [Threading](#): Functions related to starting, stopping, and managing threads
* [Hardware](#): Access to devices and thread-safe locking mechanisms
* [Time](#): Clock and time manipulation functions (limited on older devices)
* [Flash](#): Functions for writing to Flash memory
* [Filesystem](#): Filesystem manipulation and traversal
* [Filestreams](#): File stream reading, writing, and utility functions
* [Drawing](#): Functions for working with and drawing on display buffers
* [Text](#): Drawing text on display buffers
* [Miscellaeneous](#): Various useful functions that don't fit elsewhere

## Library Documentation

There are many libraries that ship with KnightOS that you may wish to become familiar with. Each of these
also has automatically generated documentation, but also may have a number of articles documenting them in
prose.

* [applib](#): Functions and utilities that help integrate with the KnightOS enviornment
* [stdio](#): For communicating between processes, similar to Unix pipes
