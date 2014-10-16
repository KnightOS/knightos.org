---
# vim: tw=80
title: Getting Started with KnightOS Assembly
layout: base
---

<h1>
   Prerequisites and Environment
   <small>Getting Started with KnightOS Assembly</small>
</h1>

You'll be learning how to write programs for KnightOS in assembly with this
tutorial. It does not cover how to use assembly - you should already be familiar
with it. Before we get started, though, you may want to tweak your calculator to
a more programmer-oriented configuration.

## "Rooting" your calculator

KnightOS is designed for more walks of life than the programmer's. It is our
duty to prevent users from doing stupid things. However, if you want to do
stupid things, there are ways to turn off the safeguards. As a programmer,
you'll need to have a deeper level of access to your calculator than is
available with these safeguards enabled. We'll assume you still have the default
file manager, [fileman](https://packages.knightos.org/extra/fileman) installed.
By default, fileman only lets you browse files and folders under `/home`, which
is your own personal directory for documents and images and such. However, there
are many more directories on your calculator starting at the "root", or `/`.
This includes places to keep programs, libraries, configuration files,
application resources, and so on.

To enable "root browsing", you should find your "File Manager" preferences in
the settings application. Find the "Enable Root" preference and set it to
**on**. This will allow you to browse the entire filesystem on your calculator.

## Exploring KnightOS internals

If you open your file manager again, you should find that you are now able to
navigate up from your home and into `/`. From here, you will see a number of
directories. Here's the purpose of each one:

* `/bin`: This is where executabe programs are kept
* `/etc`: Short for "etcetera", configuration files and settings are here
* `/home`: This is where you've been confined so far - personal files
* `/lib`: "Libraries" that include shared functionality go here
* `/share`: This is named "share" for traditional reasons, but it's used to
    store non-executable resources (like images and game levels)
* `/var`: The "variable" contents of `/var` are expected to change often. This
   contains the package cache, for example.

If you're familiar with other Unix systems, you will probably recognize this as
the [Filesystem Hiearchy
Standard](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard) modified
to suit a single-user system. As a programmer, you can expect to place your
actual software in `/bin`, any configuration files it uses in `/etc`, and your
resources in `/share`. Note that these are only guidelines - there are no
systems in place to restrict you from using these differently. That being said,
most packages that do not follow these guidelines will be rejected from the
central package repository.

## The KnightOS SDK

With your calculator tweaked for a programmer's needs and with some familiarity
with the underlying structure of things, let's get your PC ready to write
KnightOS code. You'll need to be comfortable working in a terminal for this
section - if you aren't familiar with a command line, you should browse the web
for other tutorials before proceeding.

Now, for the KnightOS Software Development Kit, or "SDK". We have prepared tools
for you that can help you write software on KnightOS. They handle a lot of the
heavy lifting for you. You can find the KnightOS SDK online,
[here](https://github.com/KnightOS/sdk). To install it, simply open a terminal
and run this on any sensible Unix system:

    curl http://www.knightos.org/install-sdk | bash

Windows users: you are not on a sensible Unix system. But you can get [something
close](https://cygwin.com/). Arch Linux users, just install `knightos-sdk` from
the AUR.

You should expect this to fail a few times if you don't already have the
dependencies installed:

* cmake
* git
* a2x, from asciidoc
* gcc
* Python 3
* pip3
* mono (including development tools)
* SDL

Linux users should find these things for them in their package managers, and OSX
users can find them with [Homebrew](http://brew.sh/). Windows users, install
these with Cygwin. Once you have all the dependencies satisfied, run that
command mentioned above to install the SDK.

> **Note**
> 
> You will also want an emulator so that you can test your software without
> sending it to a calculator first, and so that it's easier to debug problems
> that crop up. The KnightOS SDK does not come with an emulator, but it does
> assume you have one installed. On Unix systems, it uses
> [z80e-sdl](https://github.com/KnightOS/z80e), our own emulator. On Windows, it
> uses [Wabbitemu](https://wabbit.codeplex.com/). You should install one of
> these and add it to your path. You can also use a different emulator if you
> wish - see `knightos --help` for info.

Once you have the SDK installed, you should run a few commands to make sure
they're all working. Each one should complain about "invalid usage" but any
other errors should raise alarm. Run each of these commands to check:

* `kpack`
* `genkfs`
* `sass`

Now that you have the SDK installed, let's use it to write some software!

<a href="first-program" class="pull-right btn btn-primary">Next - Your first program <span class="glyphicon glyphicon-chevron-right"></span></a>
