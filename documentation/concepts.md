---
# vim: tw=82
title: Learning KnightOS Concepts
layout: page
---

# Learning KnightOS Concepts

KnightOS is an open-source operating system for TI calculators. It is not an OS in
the sense that "MirageOS" is, but it is actually a full-blown Operating System
that completely replaces TI-OS on your calculator. KnightOS gives you a lot of
flexibility. Anyone who's familiar with Unix-like systems will feel right at home
with KnightOS. It's modular, open source, and powerful.

## Open Source

Let's take a quick moment to make sure you understand what it means for KnightOS
to be open source. It's rare for projects in the TI community to be truly
open-source, and this is an extremely important part of why KnightOS exists and
how it's built. The most obvious point to note about open source is that you are
freely able to get and modify the source code of KnightOS. The kernel, all
userspace applications, and the entire toolchain is open source. KnightOS uses the
MIT/X11 license, which allows you a great deal of freedom when playing with the
system.

More importantly, though, is the fact that you are able to share your improvements
with KnightOS, and they will be included in future versions of the system. It
takes a lot of effort to build such a complex and intricate system like KnightOS,
and it's only done as a result of the combined efforts of lots of contributors.
KnightOS is not built by an individual - it's built by a team. If you're
interested in helping out, please feel free to do so. The system is only as great
as it is now because of the help of people like you.

## "Unix-like"

You may have heard that KnightOS is "unix-like". This is true.
[Unix](https://en.wikipedia.org/wiki/Unix) is the operating system that defines
modern operating systems. Many systems, including Linux and OS X, are based on the
ideas Unix brought forth. Following suit, KnightOS takes a lot of ideas from Unix
and implements them for calculators. However, KnightOS is only Unix-*like*.
KnightOS does not provide a POSIX runtime and no Unix software is directly
compatible with KnightOS.

### Multitasking

KnightOS lets you run up to 32 programs *at once*. You can effortlessly switch
between doing math and editing a program without losing your stride. Your programs
can also run tasks in the background while your user is busy doing something else.
Multitasking on KnightOS is preemptive, meaning that all programs are included by
default (and do not have to opt-in or think much about it). Using KnightOS is
similar to how you might use a smart phone. You can "suspend" programs in the
background, switch to another, and go back and forth as you please. Unlike
smartphones, however, programs are offered a full multitasking enviornment, and
are allowed to run tasks in the background and create new threads.

### Dynamic Memory Management

On TI-OS, you may be used to placing interesting data in "safe RAM". There is no
such concept on KnightOS. Instead, you tell the system how much memory you need
and it sets aside some for you. This allows you to work with up to 31K of
continuous memory - far more than you ever get on TI-OS. To make things easier,
you are also permitted to set aside space in your programs for non-dynamic memory.
More on this subject is discussed in later articles.

### Filesystem

Unix has a filesystem standard called the [Filesystem Hierarchy
Standard](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard). KnightOS
is a single-user operating system, so it does not follow this exactly.
However, it does draw a lot of inspiration from this standard. On KnightOS,
programs are found in `/bin`, and variable data is in `/var`. Libraries go in
`/lib`, and configuration files in `/etc`, and so on.

If you hadn't already gathered, KnightOS has a proper filesystem. Unlike TI-OS's
archive, KnightOS gives you a directory tree and a filesystem like your computer
has. This is all stored in Flash - absolutely no user data is stored in RAM. This
frees up RAM for your own use, but also prevents crashes from being destructive.
Any time your program crashes, no user data will be lost. No more panicked RAM
clears!

## The "kernel" and "userspace"

There is an important distinction on KnightOS between what is in the "kernel" and
what is in "userspace" (sometimes called "userland"). The kernel is the most
complicated and detailed part of KnightOS, but it doesn't do anything on its own.
The KnightOS kernel resides on pages 0x00 to 0x03 in Flash, and offers most of the
foundation of the system. The kernel is responsible for multitasking, memory
management, hardware drivers, filesystem access, and so on. However, it rarely
interacts with the user directly. It just sits there quietly and does all the hard
work for KnightOS.

The userspace, however, consists of all the software you interact with. Userspace
programs are stored on the filesystem in `/bin` and are loaded into RAM to be
executed when you are using the calculator. For example, the castle and the file
manager are both userspace programs - just like the ones you might write. The
castle resides in `/bin/castle` and the file manager is in `/bin/fileman`. As a
general rule, anything that directly interacts with the user is in the userspace.
Other things considered to be in "userspace" include any installed libraries.

## Modularity

The final point we'll address is the notion of modularity. Most of the programs in
userspace do not depend on each other. The only thing neccessary to have a
KnightOS system is the kernel - you could remove the castle, the file manager, the
settings editor, and everything else, and it'd still be KnightOS. You can do more
than remove the things you don't want - you can replace them. KnightOS is designed
in a way that allows you to replace core parts of the OS with any alternative you
like. You could write an alternative file manager and install it in place of
fileman, and everything would work great. You could use a different launcher than
the Castle if you please. You can *completely customize* your installation of
KnightOS and everything will work great.

## Further Reading

At this point, you can probably dive into programming on KnightOS. You will probably
want to start with the [userspace programming guide](/documentation/programs.html).
If you have any questions, please feel free to visit us on IRC.
