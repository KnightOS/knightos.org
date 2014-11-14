---
# vim: tw=80
title: Writing KnightOS programs in C
layout: base
---

# Writing KnightOS programs in C

As of kernel 0.7.0, KnightOS supports userspace programs written in C.
Currently, C support is **very experimental**. Support is provided via
[kcc](https://github.com/KnightOS/kcc) and
[scas](https://github.com/KnightOS/scas). `kcc` is our fork of
[sdcc](http://sdcc.sourceforge.net/) and serves as our C compiler. `scas` is our
new assembler and linker, which is compatible with the ASxxxx syntax that SDCC
uses, as well as the classical KnightOS syntax. There are several limitations on
C in KnightOS right now:

* You can only use C89 and a very limited subset of C99
* There is no support for floats or doubles
* You cannot write libraries in C
* KnightOS is not a POSIX system or anything like one
* kcc/sdcc is not very space-effecient and will produce large executables
* This is very experimental and it might be horribly broken without warning

We hope to reduce some of these problems as C support matures, but consider
yourself warned. Here's what a simple "Hello world" program looks like in C for
KnightOS:

<div class="row">
<div class="col-md-6">

{% highlight c %}
#include <system.h>
#include <keyboard.h>
#include <display.h>
#include <corelib.h>

void main(void) {
    SCREEN *screen;
    int i;
    load_library("/lib/core");
    get_lcd_lock();
    screen = screen_allocate();
    screen_clear(screen);
    draw_window(screen, "C Demo", 0);
    draw_string(screen, 2, 8, "Hello C world!");
    screen_draw(screen);
    flush_keys();
    wait_key();
}
{% endhighlight %}

</div>
<div class="col-md-6"> <img src="https://cdn.mediacru.sh/5YXv4hRm-Lt-.png" /> </div>
</div>

If you're feeling adventerous enough to give it a try, install kcc and then use
`knightos init --language=c your_project` to get started. To get help and to
help us improve C support, join [#knightos on
irc.freenode.net](http://webchat.freenode.net/?channels=knightos&uio=d4).
