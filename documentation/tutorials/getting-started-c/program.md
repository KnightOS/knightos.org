---
# vim: tw=80
title: |
  "Hello, world!" on KnightOS in C
layout: page
---

# "Hello, world!" on KnightOS in C
<div class="alert alert-danger">
At the moment, KnightOS and libc only support a subset of POSIX.
</div>

It's traditional that the first program you write for any new adventure is a
simple one that shows the phrase "Hello, world!" to the user. Lucky for you, the
KnightOS SDK completely automates that procedure! We'll explain how it works
anyway. To get started, find some directory that you want to work in.

    mkdir hello_world
    cd hello_world

This should be an empty directory. Once there, run this:

    knightos init hello_world --template='c'

`knightos init` takes the name of your project. In this case, we're calling it
"hello_world". It'll spit out some stuff you probably don't need to worry about
and then you'll be left with this stuff:

    .
    ├── main.c
    ├── Makefile
    ├── package.config
    └── crt0.asm

    0 directories, 4 files

There are a few files here. Open them up and examine them. First we have
`main.c`, which is the actual code for this project. We also have `Makefile`,
which is a [Makefile](https://www.gnu.org/software/make/) that describes how
your project is built. There's also `package.config`, which is an SDK thing that
describes your project. Last, there's `crt0.asm`, which contains some assembly code that ensures that your C code runs correctly. You can run `make` and then `make run` to see the result of your hard work:

    make
    make run

A window will pop up with the z80e emulator running your project. Press F12 to
turn the emulated calculator on and see your "Hello, world!" message appear.

![](https://sr.ht/a7Wu.png)

<div class="alert alert-info">Note that Windows users will see the Wabbitemu
emulator instead of z80e.</div>

If you make changes to `main.c` and would like to see them in action, just run
`make run` again. If you open up `main.c` now (reproduced here for
convenience), we can go over how it works.

{% highlight c %}
#include <knightos/display.h>
#include <knightos/system.h>

/* Warning! C support in KnightOS is highly experimental. Your mileage may vary. */

void main() {
    SCREEN *screen;
    get_lcd_lock();
    screen = screen_allocate();
    screen_clear(screen);
    draw_string(screen, 0, 0, "Hello world!");
    screen_draw(screen);
    while (1);
}

{% endhighlight %}

On KnightOS, your program has to cooperate with other running programs. Because of this, we
manage the allocation of each part of the calculator so that your program gets
along with the others. For this example, we need to reserve and allocate the screen (aka the
LCD): 
{% highlight c %}
get_lcd_lock();
screen = screen_allocate();
{% endhighlight %}

These two functions are defined in [knightos/display.h](https://github.com/KnightOS/libc/blob/master/include/knightos/display.h) and [knightos/system.h](https://github.com/KnightOS/libc/blob/master/include/knightos/system.h) respectively. If you're interested in how these functions work, see the [inline-asm](inline-asm.html) tutorial page.

{% highlight c %}
screen_clear(screen);
draw_string(screen, 0, 0, "Hello world!");
screen_draw(screen);
{% endhighlight %}
First, we clear the screen using `screen_clear()`. Next, we draw the "Hello world" string to the coordinates "0, 0" using `draw_string()`, and finally we copy the screen buffer to the LCD using `screen_draw()`. All three of these functions are in [display.h](https://github.com/KnightOS/libc/blob/master/include/knightos/display.h).

And there we have it! A "Hello world" program in C that compiles to z80 asm and runs on KnightOS! 

### Next Steps

Play around with this program a bit! Here are some simple ideas for how to modify it:

* Change the message shown
* Change where it appears on the screen
* Read the headers
* Play around with `draw_char`, `draw_byte`, and `draw_long`. (all are in `knightos/display.h`)

<a href="corelib.html" class="pull-right btn btn-primary">Next »</a>
<a href="environment.html" class="btn btn-primary">« Back</a>
