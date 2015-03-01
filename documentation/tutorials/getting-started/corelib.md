---
# vim: tw=80
title: Adding corelib and drawing windows
layout: page
---

# Adding corelib and drawing windows

[corelib](https://packages.knightos.org/core/corelib) is a library that ships
with KnightOS by default. It gives you all the things you need to integrate with
the KnightOS userspace, such as GUI support and app switching. We're going to
bring in corelib as a dependency of our project, wrap our message in a window,
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

Now that we have corelib, let's open up `main.asm` and add the corelib include
file to the header:

{% highlight diff %}
@@ -1,4 +1,5 @@
 #include "kernel.inc"
+#include "corelib.inc"
     .db "KEXC"
     .db KEXC_ENTRY_POINT
     .dw start
{% endhighlight %}

This allows us to reference the corelib macro and the functions provided by
corelib. When you use a library in KnightOS, the library generally ships with an
include file that gives you a handy macro for using it. Before we do that,
however, we need to load the library into memory. The corelib package installs
the library to `/lib/core`. We can load it with
[loadLibrary](http://localhost:4000/documentation/reference/system.html#loadLibrary):

{% highlight diff %}
@@ -12,6 +12,8 @@ name:
     .db "example", 0
 start:
     ; This is an example program, replace it with your own!
+    kld(de, corelib_path)
+    pcall(loadLibrary)
     
     ; Get a lock on the devices we intend to use
     pcall(getLcdLock)
@@ -43,3 +45,5 @@ start:
 
 message:
     .db "Hello, world!", 0
+corelib_path:
+    .db "/lib/core", 0
{% endhighlight %}

<div class="alert alert-info"><strong>Note</strong>: Notice how we're using the
<code>kld</code> macro here. We're referencing a string that's defined within
our program, <code>corelib_path</code>, so we have to use a k-macro to load it
relative to our program in memory.
</div>

Now that we have corelib loaded into memory, we can start to use the functions
provided by it. One of these functions will draw a window in our screen buffer.
Let's modify our code so that the "Hello, world!" message has a nice window
around it.

{% highlight diff %}
@@ -23,6 +23,11 @@ start:
     pcall(allocScreenBuffer)
     pcall(clearBuffer)
 
+    kld(hl, window_title)
+    xor a ; ld a, 0
+    corelib(drawWindow)
+
     ; Draw `message` to 0, 0 (D, E = 0, 0)
     kld(hl, message)
     ld de, 0
@@ -47,3 +52,5 @@ message:
     .db "Hello, world!", 0
 corelib_path:
     .db "/lib/core", 0
+window_title:
+    .db "My First Window", 0
{% endhighlight %}

To draw a window, we use `corelib(drawWindow)`, which is provided by the
`corelib.inc` include file we added earlier. This function wants the title of
the window in HL, and the window flags in A. Don't worry about the window flags
yet - they can just be set to zero.

If you use `make run` now, you'll see the window appear but the title is garbage
- that's because we're still drawing our "Hello, world!" string at coordinates
`0, 0`. Let's correct that:

{% highlight diff %}
@@ -28,9 +28,9 @@ start:
     xor a ; ld a, 0
     corelib(drawWindow)
 
-    ; Draw `message` to 0, 0 (D, E = 0, 0)
+    ; Draw `message` to 2, 8 (D, E = 2, 8)
     kld(hl, message)
-    ld de, 0
+    ld de, 2 << 8 | 8
     pcall(drawStr)
 
 .loop:
{% endhighlight %}

<div class="alert alert-warning"><strong>Assembly tip</strong>: The "DE"
register is used all over the KnightOS world for X and Y coordinates. DE is a
16-bit register, made of two 8-bit registers. We can save a little speed and
space if we set both D and E at the same time, so we set D to 2 and E to 8 by
shifting 2 over 8 bits and then ORing it with 8. You could accomplish the same
thing (though slightly slower) by setting D and E seperately.</div>

Now, running `make run` again should show you a proper window:

![](https://a.pomf.se/vyipga.png)

Now that we have a window, we have two icons on the left and right. In most
KnightOS programs, tapping the left (F1, or Y=) will take you to the application
launcher, and the right will take you to the application switcher. However, in
your app, we are using `getKey`, which gives you direct access to the keyboard.
You could implement the hand-off to the launcher or switcher yourself, but
corelib has got you covered.

{% highlight diff %}
@@ -40,7 +40,7 @@ start:
     ; flushKeys waits for all keys to be released
     pcall(flushKeys)
     ; waitKey waits for a key to be pressed, then returns the key code in A
-    pcall(waitKey)
+    corelib(appWaitKey)
 
     cp kMODE
     jr nz, .loop
{% endhighlight %}

`appWaitKey` is a drop-in replacement for `waitKey`, but if F1 or F5 is pressed,
it will switch to the appropriate application. If you run your app now and press
F1...

![](https://a.pomf.se/ctxisn.png)

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

* Look up `corelib(drawWindow)` and find out what the "window flags" do
* Install more apps and look around in the emulated calculator
* Find out how to launch `/bin/launcher` yourself when the user presses F5

<a href="assembly.html" class="pull-right btn btn-primary">Next »</a>
<a href="program.html" class="btn btn-primary">« Back</a>
