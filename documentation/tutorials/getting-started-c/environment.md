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

## SDK installation

For Unix-like systems, including Linux, macOS, BSD, and so on, the installation
procedure is very straightforward. [Installation instructions are available
here](/sdk). Instructions for Windows are also provided.

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
* boost (libboost-dev)
* flex
* bison

<pre>$ sudo apt-get install mono-complete cmake git asciidoc gcc python3-pip libsdl1.2-dev libmagickwand-dev libreadline-dev libboost-dev flex bison</pre>

will install all the dependencies on a debian based system (you may need to symlink pip-3.2 to pip3).

<div class="alert alert-info"><strong>Note</strong>: You should be able to use
clang/llvm instead of gcc. This is probably what most OSX users will want to do.
</div>

You'll also need the development headers for readline. 

## Testing the Installation

Run `knightos --help` when you're all done to make sure the installation went
smoothly. Next, pick a directory to keep your code in and we'll move on to the
next chapter.

<a href="program.html" class="pull-right btn btn-primary">Next »</a>
<a href="index.html" class="btn btn-primary">« Back</a>
