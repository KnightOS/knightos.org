---
# vim: tw=80
title: Setting up your environment
layout: page
---

# Setting up your environment

KnightOS is hackable on most systems. The first step to building your own
programs is to install the KnightOS SDK, or "Software Development Kit". You need
some extra software installed on your PC to compile programs.

<div class="alert alert-info"><strong>Note</strong>: You should already be
familiar with your favorite text editor, and with working on the command line.
We aren't getting into that here.</div>

## Setup for Unix

For Unix-like systems, including Linux, OS X, BSD, and so on, the installation
procedure is very straightforward. Open a terminal and run this:

    curl -s http://www.knightos.org/install-sdk | bash

This will download and run the [KnightOS SDK
installer](https://github.com/KnightOS/knightos.org/blob/gh-pages/install-sdk).
The script will warn you if you are missing dependencies - you need to have the
following things installed:

* Mono (mono-complete)
* cmake
* git
* asciidoc
* gcc
* Python 3 & pip (python3-pip)
* SDL (libsdl1.2-dev)
* ImageMagick (libmagickwand-dev)
* readline (libreadline-dev)

<div class="alert alert-info"><strong>Note</strong>: You should be able to use
clang/llvm instead of gcc. This is probably what most OSX users will want to do.
</div>

You'll also need the development headers for readline. There are more detailed
system-specific instructions available [here](install-help.html) if you need a
little more help.

## Setup for Windows

The Windows setup is similar, but requires [Cygwin](http://cygwin.com/). Install
the same dependencies (not including SDL) through the Cygwin installer, and then
run the same command:

    curl -s http://www.knightos.org/install-sdk | bash

Detailed Windows instructions can be found [here](install-help.html) if you need
help.

## Testing the Installation

Run `knightos --help` when you're all done to make sure the installation went
smoothly. Next, pick a directory to keep your code in and we'll move on to the
next chapter.

<a href="program.html" class="pull-right btn btn-primary">Next »</a>
<a href="index.html" class="btn btn-primary">« Back</a>
