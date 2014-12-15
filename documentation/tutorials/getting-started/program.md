---
# vim: tw=80
title: >
    "Hello, world!" on KnightOS
layout: page
---

# "Hello, world!" on KnightOS

It's traditional that the first program you write for any new adventure is a
simple one that shows the phrase "Hello, world!" to the user. Lucky for you, the
KnightOS SDK completely automates that procedure! We'll explain how it works
anyway. To get started, find some directory that you want to work in.

    mkdir hello_world
    cd hello_world

This should be an empty directory. Once there, run this:

    knightos init hello_world

`knightos init` takes the name of your project. In this case, we're calling it
"hello_world". It'll spit out some stuff you probably don't need to worry about
and then you'll be left with this stuff:

    .
    ├── main.asm
    ├── Makefile
    └── package.config

    0 directories, 3 files

There are a few files here. Open them up and examine them. First we have
`main.asm`, which is the actual code for this project. We also have `Makefile`,
which is a [Makefile](https://www.gnu.org/software/make/) that describes how
your project is built. There's also `package.config`, which is an SDK thing that
describes your project. You can run `make` and then `make run` to see the
result of your hard work:

    make
    make run

A window will pop up with the z80e emulator running your project. Press F12 to
turn the emulated calculator on and see your "Hello, world!" message appear.

![](https://cdn.mediacru.sh/L/Lm3vwsSWu-Jx.png)

<div class="alert alert-info">Note that Windows users will see the Wabbitemu
emulator instead of z80e.</div>

If you make changes to `main.asm` and would like to see them in action, just run
`make run` again. If you open up `main.asm` now (reproduced here for
convenience), we can go over how it works.

{% highlight nasm %}
#include "kernel.inc"
    .db "KEXC"
    .db KEXC_ENTRY_POINT
    .dw start
    .db KEXC_STACK_SIZE
    .dw 20
    .db KEXC_NAME
    .dw name
    .db KEXC_HEADER_END
name:
    .db "hello_world", 0
start:
    ; This is an example program, replace it with your own!
    
    ; Get a lock on the devices we intend to use
    pcall(getLcdLock)
    pcall(getKeypadLock)

    ; Allocate and clear a buffer to store the contents of the screen
    pcall(allocScreenBuffer)
    pcall(clearBuffer)

    ; Draw `message` to 0, 0 (D, E = 0, 0)
    kld(hl, message)
    ld de, 0
    pcall(drawStr)

.loop:
    ; Copy the display buffer to the actual LCD
    pcall(fastCopy)

    ; flushKeys waits for all keys to be released
    pcall(flushKeys)
    ; waitKey waits for a key to be pressed, then returns the key code in A
    pcall(waitKey)

    cp kMODE
    jr nz, .loop

    ; Exit when the user presses "MODE"
    ret

message:
    .db "Hello, world!", 0
{% endhighlight %}

Let's go over each part of this in detail to explain how it works. You don't
have to understand everything yet. First, we have the header:

{% highlight nasm %}
#include "kernel.inc"
    .db "KEXC"
    .db KEXC_ENTRY_POINT
    .dw start
    .db KEXC_STACK_SIZE
    .dw 20
    .db KEXC_NAME
    .dw name
    .db KEXC_HEADER_END
name:
    .db "hello_world", 0
start:
{% endhighlight %}

You don't have to worry about this yet. All that matters for the moment
is that your program's name is included here, and your program's code starts
after `start`. At this point, we need to reserve some hardware. On KnightOS,
your program has to cooperate with other running programs. Because of this, we
manage the allocation of each part of the calculator so that your program gets
along with the others. For this example, we need to reserve the screen (aka the
LCD) and the keypad:

{% highlight nasm %}
pcall(getLcdLock)
pcall(getKeypadLock)
{% endhighlight %}

What we're doing here is making two pcalls, or "paged calls". These are similar
to bcalls on TI-OS, or syscalls on Unix. They allow us to access some functions
provided by the system itself. Since the system is responsible for allocating
hardware, we have to use a pcall to ask the system for access. After that, we
start setting some things up:

{% highlight nasm %}
; Allocate and clear a buffer to store the contents of the screen
pcall(allocScreenBuffer)
pcall(clearBuffer)
{% endhighlight %}

<div class="alert alert-info">Any line starting with a semicolon (;) is a
comment, and is ignored by the compiler.</div>

In KnightOS, you have to ask the system for memory with which to do things like
store screen data. There's a pcall that helps with that particular case -
`allocScreenBuffer` will allocate enough memory to hold the screen's contents.
By default you can't predict what this memory will look like, so we call
`clearBuffer` to make sure it's empty. Now that we have memory for the screen,
we can...

{% highlight nasm %}
; Draw `message` to 0, 0 (D, E = 0, 0)
kld(hl, message)
ld de, 0
pcall(drawStr)
{% endhighlight %}

Here, we start getting into the fun stuff. We have three things happening here -
a relative load, an absolute load, and a pcall.

<div class="alert alert-info">Interjection: if you don't know what registers
are, you should stop and read <a
href="http://tutorials.eeems.ca/ASMin28Days/lesson/day03.html">this link</a> before
moving on.</div>

In KnightOS, you can't be sure of where your program is going to execute from in
RAM. It will be given some dynamically allocated memory and has to work from
there, which means that you can't predict ahead of time where your program will
be loaded.

The implication of all that is that you have to use special macros to refer to
values within your program. In this case, we use `kld(hl, message)` to load the
final address of "message" into HL. This is effectively the same as LD but works
no matter where your program is in memory. We also load 0 into DE to serve as
the X, Y coordinates for our text, and then pcall `drawStr`. Because we are
using 0 (the actual value) rather than an address, we don't need to use kld (and
in fact, kld would break it).

There's also `kcall` and `kjp`, which behave like the call and jp z80
instructions. It's easy to know when you need a relative macro - if you're
referring to something within your own program, you need one.

{% highlight nasm %}
.loop:
; Copy the display buffer to the actual LCD
pcall(fastCopy)

; flushKeys waits for all keys to be released
pcall(flushKeys)
; waitKey waits for a key to be pressed, then returns the key code in A
pcall(waitKey)

cp kMODE
jr nz, .loop

; Exit when the user presses "MODE"
ret
{% endhighlight %}

This program ends by looping and waiting for the user to press the MODE key, and
then exiting. ".loop" is a local label, meaning that it's relative to the last
global label. You can have as many labels called ".loop" so long as you only
include one per global label (global labels don't start with a dot. The "start"
label at the start of this program is an example).

We use the `fastCopy` pcall to copy the contents of our screen memory to the
screen itself. Then we call `flushKeys` to wait for the user to release any keys
they have held down, and then `waitKey` to wait for the user to press another.
`waitKey` will return the keycode pressed in the A register, and we can use the
`cp` instruction to compare it to the `kMODE` constant. If they are equal, the Z
flag is set. If the Z flag isn't set, we loop back. Otherwise, we `ret` and exit
the program.

### Next Steps

Play around with this program a bit! Here are some simple ideas for how to
modify it:

* Change the message shown
* Change where it appears on the screen
* Look up the [documentation](/documentation/reference/) for each pcall used
  here

<a href="corelib.html" class="pull-right btn btn-primary">Next »</a>
<a href="environment.html" class="btn btn-primary">« Back</a>
