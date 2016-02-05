---
# vim: tw=80
title: Adding corelib, drawing windows, and user input
layout: page
---

# Adding corelib, drawing windows, and user input

[corelib](https://packages.knightos.org/core/corelib) is a library that ships
with KnightOS by default. It gives you all the things you need to integrate with
the KnightOS userspace, such as GUI support and app switching. We're going to
bring in corelib as a dependency of our project, wrap our message in a window, implement user input,
and add support for switching to other apps while ours is placed into the
background.

<div class="alert alert-info"><strong>Note</strong>: As we extend the files in
our project, this tutorial uses a "diff" to show the difference in each step.
Lines that begin with <code>+</code> (in green) are lines added, and lines that
begin with <code>-</code> (in red) are lines removed.</div>

First, we'll add `core/corelib` as a dependency of our project. Run this
command:

    knightos install core/corelib

This downloads corelib, installs it to your working directory, and adds it to
your `package.config` file as a dependency. You can use `--site-only`, by the
way, to download and install packages without adding them to your
`package.config` file. We'll show you how that's useful at the end of this
tutorial.

Now that we have corelib, let's open up `main.c` and add the [corelib header](https://github.com/KnightOS/corelib/blob/master/corelib.h) to the file:
{% highlight diff %}
@@ -1,4 +1,5 @@
 #include <knightos/keys.h>
+#include <corelib.h>

 /* Warning! C support in KnightOS is highly experimental. Your mileage may vary. */

 void main() {
{% endhighlight %}

This allows us to reference the corelib C functions defined in [corelib.h](https://github.com/KnightOS/corelib/blob/master/corelib.h).
Before we're able to use Corelibs helpful functions, we need to load the library into memory. The corelib package installs
the library to `/lib/core`. We can load it with
[load_library](https://github.com/KnightOS/corelib/blob/master/corelib.h):

{% highlight diff %}
@@ -10,1 +12,8 @@ 
#include <corelib.h>

void main(void) {
    SCREEN *screen;
+   load_library("/lib/core");
    get_lcd_lock();
    screen = screen_allocate();
{% endhighlight %}

Now that we have corelib loaded into memory, we can start to use the functions
provided by it. One of these functions will draw a window in our screen buffer.
Let's modify our code so that the "Hello world!" message has a nice window
around it.

{% highlight diff %}
@@ -13,2 +14,4 @@ start:
void main() {
    SCREEN *screen;
    get_lcd_lock();
    screen = screen_allocate();
    screen_clear(screen);
+   draw_window(screen, "C Demo", WIN_DEFAULTS);
+   draw_string(screen, 0, 0, "Hello world!");
    screen_draw(screen);
    while (1);
}
{% endhighlight %}

To draw a window, we use `draw_window(SCREEN* screen, char *title, char flag)`, which is defined in the corelib header file that we added earlier. Don't worry about the flags for now &mdash; we'll go over those later.

If you use `make run` now, you'll see the window appear but the title is garbage
- that's because we're still drawing our "Hello world!" string at coordinates
`0, 0` (which is on top of the window's title bar). Let's correct that:

{% highlight diff %}
@@ -13,4 +13,4 @@
void main(void) {
    SCREEN *screen;
    load_library("/lib/core");
    get_lcd_lock();
    screen = screen_allocate();
    screen_clear(screen);
    draw_window(screen, "C Demo", 0);
-   draw_string(screen, 0, 0, "Hello world!");
+   draw_string(screen, 2, 8, "Hello world!");
    screen_draw(screen);
{% endhighlight %}


Now, running `make run` again should show you a proper window:

![](https://sr.ht/RroK.png)

Now that we have a window, we have two icons on the left and right. In most
KnightOS programs, tapping F1 (or Y=) will take you to the Castle, and F5 will take you to the application switcher.

However, we have no user-input yet. When working with just libc, we would use `get_key()`, which is defined in [knightos/keys.h](https://github.com/KnightOS/libc/blob/master/include/knightos/keys.h). Since we're using corelib, we'll use `app_get_key` instead, which handles the hotkeys.  In order to make use of these two functions, we first need to place them in the `while(1)` loop. Next, we need to define two characters: one to return the pressed key, and the other will be set to 0 if the thread loses focus. We'll call these `key` and `_` respectively. Finally, we'll set `key` to the result of `app_get_key`, and will pass the address of `_` into the function. Let's do that now:

{% highlight diff %}
@@ -13,6 +13,6 @@
    draw_string(screen, 2, 8, "Hello world!");
    screen_draw(screen);
+   while (1) {
+       unsigned char _;
+       unsigned char key;
+       key = app_get_key(&_);
+   }
}
{% endhighlight %}

`app_get_key`is a drop-in replacement for `get_key`, but if F1 or F5 is pressed,
it will switch to the appropriate application. If you run your app now and press
F1...

![](https://sr.ht/GtbI.png)

Kernel panic! This happens because when corelib switches away from your
application, it suspends it to save on CPU time so that the applications that
the user is currently working with can run faster. The kernel will panic if
there every running thread is suspended, because that means that nothing can
interact with the user. But why would that error happen here? The answer is
simple - there is no launcher, and there is no application switcher! The
KnightOS SDK sets you up with the most minimal environment possible, and that
does not include the launcher or app switcher unless you need it.

Try running this:

    knightos install --site-only core/castle core/threadlist

This installs the [castle](https://packages.knightos.org/core/castle) and
[threadlist](https://packages.knightos.org/core/threadlist) packages, which are
the default launcher and app switcher on KnightOS. The `--site-only` flag
prevents them from being added as a dependency in your `package.config`, but
just installs them for you to test with.

If you run your program now, you'll see the same result. That's because corelib
needs to be told that `castle` is the application launcher, and that
`threadlist` is the application switcher. Since KnightOS allows the user to
customize to their heart's content, corelib doesn't assume that you *want* to
use the official launcher and switcher. To set them correctly, you'll need to
create some symbolic links so that `/bin/launcher` and `/bin/switcher` are
accurate. Run these commands to do so:

    ln -s /bin/castle .knightos/pkgroot/bin/launcher
    ln -s /bin/threadlist .knightos/pkgroot/bin/switcher

If you run it now and press F1, you'll be taken to the castle (which is empty
because we haven't configured it with any apps). Press F5 to go to the app
switcher, which should list your app. Press enter here to return to your app.

![](http://a.pomf.se/hciogg.gif)

<div class="alert alert-info"><strong>Note</strong>:
<code>.knightos/pkgroot</code> is a directory used by the KnightOS SDK. The
contents of this directory are the contents of the filesystem on the emulated
calculator when you debug your app. Try installing <a
href="https://packages.knightos.org/extra/fileman">extra/fileman</a> and running
it from the castle to explore this filesystem!</div>

### Next Steps

Here are a few ideas for extending this program.

* Look at the [corelib header](https://github.com/KnightOS/corelib/blob/master/corelib.h) and find out what the "window flags" are.
* Install more apps and look around in the emulated calculator
* Find out how to launch `/bin/launcher` yourself when the user presses F5
* Draw a different string when the user presses a key

<a href="inline-asm.html" class="pull-right btn btn-primary">Next »</a>
<a href="program.html" class="btn btn-primary">« Back</a>
