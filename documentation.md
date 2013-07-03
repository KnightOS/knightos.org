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

* [Display](#): For manipulating display buffers
* [Filestreams](#): Working with file streams to edit and read files
* [Filesystem](#): Editing the filesystem directly (i.e. moving or deleting files)
* [Hardware](#): Interacting with TI hardware and thread-safe hardware use
* [Miscellaneous](#): Various useful functions
* [System](#): Basic system manipulation and core functions
* [Text](#): Drawing text on display buffers with the kernel font

## Library Documentation

There are many libraries that ship with KnightOS that you may wish to become familiar with. Each of these
also has automatically generated documentation, but also may have a number of articles documenting them in
prose.

* [applib](#): Functions and utilities that help integrate with the KnightOS enviornment
* [stdio](#): For communicating between processes, similar to Unix pipes
