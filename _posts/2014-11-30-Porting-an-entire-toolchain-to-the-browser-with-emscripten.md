---
# vim: tw=80
layout: post_toolchain
author: Drew DeVault
title: Porting our toolchain to the browser
in_browser: true
---

Emscripten is pretty cool! It lets you write portable C and cross-compile
it to JavaScript so it'll run in a web browser. I looked to emscripten as
a potential means of reducing the cost of entry for new developers hoping
to target the OS.

*Note: This blog post was originally posted on [drewdevault.com](http://www.drewdevault.com) and has been cross-posted here.*

## Rationale for Emscripten

There are several pieces of software in the toolchain that are required to write
and test software for KnightOS:

* [scas](https://github.com/KnightOS/scas) - a z80 assembler
* [genkfs](https://github.com/KnightOS/genkfs) - generates KFS filesystem images
* [kpack](https://github.com/KnightOS/kpack) - packaging tool, like makepkg on Arch Linux
* [z80e](https://github.com/KnightOS/z80e) - a z80 calculator emulator

You also need a copy of the latest kernel and any of your dependencies from
[packages.knightos.org](https://packages.knightos.org). Getting all of this is
not straightforward. On Linux and Mac, there are no official packages for any of
these tools. On Windows, there are still no official packages, and you have to
use Cygwin on top of that. The first step to writing KnightOS programs is to
manually compile and install several tools, which is a lot to ask of someone who
just wants to experiment.

All of the tools in our toolchain are written in C. We saw Emscripten as an
opportunity to reduce all of this effort into simply firing up your web browser.
It works, too! Here's what was involved.

>**Note**: Click the screen on the emulator to the left to give it your
>keyboard. Click away to take it back. You can use your arrow keys, F1-F5,
>enter, and escape (as MODE).

## The final product

Let's start by showing you what we've accomplished. It's now possible for
curious developers to try out KnightOS programming in their web browser. Of
course, they still have to do it in assembly, but we're [working on
that](https://github.com/KnightOS/kcc) 😉. Here's a "hello world" you can run in
your web browser:

<div class="demo">
    <div class="editor" data-source="/sources/helloworld.asm" data-file="main.asm"></div>
    <div class="calculator-wrapper">
        <div class="calculator">
            <canvas width="385" height="256" class="emulator-screen"></canvas>
        </div>
    </div>
</div>

We can also install new dependencies on the fly and use them in our programs.
Here's another program that draws the "hello world" message in a window. You
should install `core/corelib` first:

<input type="text" id="package-name" value="core/corelib" />
<input type="button" id="install-package" value="Install" />

<div class="demo">
    <div class="editor" data-source="/sources/corelib-hello.asm" data-file="main.asm"></div>
    <div class="calculator-wrapper">
        <div class="calculator">
            <canvas width="385" height="256" class="emulator-screen"></canvas>
        </div>
    </div>
</div>

You can find more packages to try out on
[packages.knightos.org](https://packages.knightos.org). Here's another example,
this one launches the file manager. You'll have to install a few packages for it
to work:

Install:
<input type="button" class="install-package-button" data-package="extra/fileman" value="extra/fileman" />
<input type="button" class="install-package-button" data-package="core/configlib" value="core/configlib" />
<input type="button" class="install-package-button" data-package="core/corelib" value="core/corelib" />

<div class="demo">
    <div class="editor" data-source="/sources/fileman.asm" data-file="main.asm"></div>
    <div class="calculator-wrapper">
        <div class="calculator">
            <canvas width="385" height="256" class="emulator-screen"></canvas>
        </div>
    </div>
</div>

Feel free to edit any of these examples! You can run them again with the Run
button, of course. These resources might be useful if you want to play with this
some more:

[z80 instruction set](http://www.z80.info/z80-op.txt) - [z80 assembly tutorial](http://tutorials.eeems.ca/ASMin28Days/lesson/toc.html) - [KnightOS reference documentation](http://www.knightos.org/documentation/reference)

Note: our toolchain has some memory leaks, so eventually emscripten is going to
run out of memory and then you'll have to refresh. Sorry!

## How all of the pieces fit together

When you
loaded this page, a bunch of things happened. First, the [latest
release](https://github.com/KnightOS/kernel/releases) of the [KnightOS
kernel](https://github.com/KnightOS/kernel) was downloaded. Then all of the
emscripten ports of the toolchain were downloaded and loaded. The various
virtual filesystems were set up, and two packages were downloaded and installed:
`core/init`, and `core/kernel-headers`. Extracting those packages involves
copying them into kpack's virtual filesystem and running `kpack -e
path/to/package root/`.

When you click "Run" on one of these text boxes, the contents of the text box is
written to `/main.asm` in the assembler's virtual filesystem. The package
installation process extracts headers to `/include/`, and scas itself is run
with `/main.asm -I/include -o /executable`, which assembles the program and
writes the output to `/executable`.

Then we copy the executable into the genkfs filesystem (this is the tool that
generates filesystem images). We also copy the empty kernel into this
filesystem, as well as any of the packages we've installed. We then run `genkfs
/kernel.rom /root`, which creates a filesystem image from `/root` and bakes it
into `kernel.rom`. This produces a ready-to-emulate ROM image that we can load
into the z80e emulator on the left.

## The emscripten details

Porting all this stuff to emscripten wasn't straightforward. The easiest part
was cross-compiling all of them to JavaScript:

    cd build
    emconfigure cmake ..
    emmake make

The process was basically that simple for each piece of software. There were
[a](https://github.com/KnightOS/genkfs/commit/c4eefa87a3b5bdbafcc6d971654608c594f779a1)
[few](https://github.com/KnightOS/scas/commit/d2044e7d7586a946422ce6493cc6dff01127d1c2)
[changes](https://github.com/KnightOS/scas/commit/8bc31af28e8419a9fa6c421147ea522935bd0df4)
made to some of the tools to fix a few problems. The hard part
came when I wanted to run all of them on the same page. Emscripten compiled code
assumes that it will be the only emscripten module on the page at any given
time, so this was a bit challenging and involved editing the generated JS.

The first thing I did was wrap all of the modules in isolated AMD loaders. You
can see how some of this ended up looking by visiting the actual scripts
(warning, big files):

* [scas.js](http://localhost:4000/tools/scas.js)
* [kpack.js](http://localhost:4000/tools/kpack.js)
* [genkfs.js](http://localhost:4000/tools/genkfs.js)

That was enough to make it so that they could all run. These are part of a
toolchain, though, so somehow they needed to share files. Emscripten's [FS
object](http://kripken.github.io/emscripten-site/docs/api_reference/Filesystem-API.html)
cannot be shared between modules, and their API for mounting filesystems is
pretty crappy. So the solution was to write a little JS:

{% highlight coffeescript %}
copy_between_systems = (fs1, fs2, from, to, encoding) ->
    for f in fs1.readdir(from)
        continue if f in ['.', '..']
        fs1p = from + '/' + f
        fs2p = to + '/' + f
        s = fs1.stat(fs1p)
        log("Writing #{fs1p} to #{fs2p}")
        if fs1.isDir(s.mode)
            try
                fs2.mkdir(fs2p)
            catch
                # pass
            copy_between_systems(fs1, fs2, fs1p, fs2p, encoding)
        else
            fs2.writeFile(fs2p, fs1.readFile(fs1p, { encoding: encoding }), { encoding: encoding })
{% endhighlight %}

With this, we can extract packages in the kpack filesystem and copy them to the
genkfs filesystem:

{% highlight coffeescript %}
install_package = (repo, name, callback) ->
    full_name = repo + '/' + name
    log("Downloading " + full_name)
    xhr = new XMLHttpRequest()
    xhr.open('GET', "https://packages.knightos.org/" + full_name + "/download")
    xhr.responseType = 'arraybuffer'
    xhr.onload = () ->
        log("Installing " + full_name)
        file_name = '/packages/' + repo + '-' + name + '.pkg'
        data = new Uint8Array(xhr.response)
        toolchain.kpack.FS.writeFile(file_name, data, { encoding: 'binary' })
        toolchain.kpack.Module.callMain(['-e', file_name, '/pkgroot'])
        copy_between_systems(toolchain.kpack.FS, toolchain.scas.FS, "/pkgroot/include", "/include", "utf8")
        copy_between_systems(toolchain.kpack.FS, toolchain.genkfs.FS, "/pkgroot", "/root", "binary")
        log("Package installed.")
        callback() if callback?
    xhr.send()
{% endhighlight %}

And this puts all the pieces in place for us to actually pass an assembly file
through our toolchain:

{% highlight coffeescript %}
run_project = (main) ->
    # Assemble
    window.toolchain.scas.FS.writeFile('/main.asm', main)
    log("Calling assembler...")
    ret = window.toolchain.scas.Module.callMain(['/main.asm', '-I/include/', '-o', 'executable'])
    return ret if ret != 0
    log("Assembly done!")
    # Build filesystem
    executable = window.toolchain.scas.FS.readFile("/executable", { encoding: 'binary' })
    window.toolchain.genkfs.FS.writeFile("/root/bin/executable", executable, { encoding: 'binary' })
    window.toolchain.genkfs.FS.writeFile("/root/etc/inittab", "/bin/executable")
    window.toolchain.genkfs.FS.writeFile("/kernel.rom", new Uint8Array(toolchain.kernel_rom), { encoding: 'binary' })
    window.toolchain.genkfs.Module.callMain(["/kernel.rom", "/root"])
    rom = window.toolchain.genkfs.FS.readFile("/kernel.rom", { encoding: 'binary' })

    log("Loading your program into the emulator!")
    if current_emulator != null
        current_emulator.cleanup()
    current_emulator = new toolchain.ide_emu(document.getElementById('screen'))
    current_emulator.load_rom(rom.buffer)
    return 0
{% endhighlight %}

This was fairly easy to put together once we got all the tools to cooperate.
After all, these are all command-line tools. Invoking them is as simple as
calling `main` and then fiddling with the files that come out. Porting z80e, on
the other hand, was not nearly as simple.

## Porting z80e to the browser

[z80e](https://github.com/KnightOS/z80e) is our calculator emulator. It's also
written in C, but needs to interact much more closely with the user. We need to
be able to render the display to a canvas, and to receive input from the user.
This isn't nearly as simple as just calling `main` and playing with some files.

To accomplish this, we've put together
[OpenTI](https://github.com/KnightOS/OpenTI), a set of JavaScript bindings to
z80e. This is mostly the work of my friend puckipedia, but I can explain a bit
of what is involved. The short of it is that we needed to map native structs to
JavaScript objects and pass JavaScript code as function pointers to z80e's
hooks. So far as I know, the KnightOS team is the only group to have attempted
something with this deep of integration between emscripten and JavaScript -
because we had to do a ton of the work ourselves.

OpenTI contains a
[wrap](https://github.com/KnightOS/OpenTI/blob/master/webui/js/OpenTI/wrap.js)
module that is capable of wrapping structs and pointers in JavaScript objects.
This is a tedious procedure, because we have to know the offset and size of each
field in native code. An example of a wrapped object is given here:

{% highlight javascript %}
define(["../wrap"], function(Wrap) {
    var Registers = function(pointer) {
        if (!pointer) {
            throw "This object can only be instantiated with a memory region predefined!";
        }
        this.pointer = pointer;

        Wrap.UInt16(this, "AF", pointer);
        Wrap.UInt8(this, "F", pointer);
        Wrap.UInt8(this, "A", pointer + 1);

        this.flags = {};
        Wrap.UInt8(this.flags, "C",  pointer, 128, 7);
        Wrap.UInt8(this.flags, "N",  pointer,  64, 6);
        Wrap.UInt8(this.flags, "PV", pointer,  32, 5);
        Wrap.UInt8(this.flags, "3",  pointer,  16, 4);
        Wrap.UInt8(this.flags, "H",  pointer,   8, 3);
        Wrap.UInt8(this.flags, "5",  pointer,   4, 2);
        Wrap.UInt8(this.flags, "Z",  pointer,   2, 1);
        Wrap.UInt8(this.flags, "S",  pointer,   1, 0);
        pointer += 2;

        Wrap.UInt16(this, "BC", pointer);
        Wrap.UInt8(this, "C", pointer);
        Wrap.UInt8(this, "B", pointer + 1);
        pointer += 2;

        Wrap.UInt16(this, "DE", pointer);
        Wrap.UInt8(this, "E", pointer);
        Wrap.UInt8(this, "D", pointer + 1);
        pointer += 2;

        Wrap.UInt16(this, "HL", pointer);
        Wrap.UInt8(this, "L", pointer);
        Wrap.UInt8(this, "H", pointer + 1);
        pointer += 2;

        Wrap.UInt16(this, "_AF", pointer);
        Wrap.UInt16(this, "_BC", pointer + 2);
        Wrap.UInt16(this, "_DE", pointer + 4);
        Wrap.UInt16(this, "_HL", pointer + 6);
        pointer += 8;

        Wrap.UInt16(this, "PC", pointer);
        Wrap.UInt16(this, "SP", pointer + 2);
        pointer += 4;

        Wrap.UInt16(this, "IX", pointer);
        Wrap.UInt8(this, "IXL", pointer);
        Wrap.UInt8(this, "IXH", pointer + 1);
        pointer += 2;

        Wrap.UInt16(this, "IY", pointer);
        Wrap.UInt8(this, "IYL", pointer);
        Wrap.UInt8(this, "IYH", pointer + 1);
        pointer += 2;

        Wrap.UInt8(this, "I", pointer++);
        Wrap.UInt8(this, "R", pointer++);

        // 2 dummy bytes needed for 4-byte alignment
    }

    Registers.sizeOf = function() {
        return 26;
    }

    return Registers;
});
{% endhighlight %}

The result of that effort is that you can find out what the current value of a
register is from some nice clean JavaScript: `asic.cpu.registers.PC` (it's <code
id="register-pc"></code>, by the way).

## Conclusions

I've put all of this together on [try.knightos.org](http://try.knightos.org).
The source is available on
[GitHub](https://github.com/KnightOS/try.knightos.org). It's entirely
client-side, so it can be hosted on GitHub Pages. I'm hopeful that this will
make it easier for people to get interested in KnightOS development, but it'll
be a lot better once I can get more documentation and tutorials written. It'd be
pretty cool if we could have interactive tutorials like this!

It was a lot of effort to make this happen, but it was worth it. This is some
pretty cool shit we've got as a result.

If you, reader, are interested in working on some pretty cool shit, there's a
place for you! We have things to do in Assembly, C, JavaScript, Python, and a
handful of other things. Did you notice how bad try.knightos.org looks? Maybe
you have a knack for design and want to help improve it. Whatever the case may
be, if you have interest in this stuff, come hang out with us on IRC: [#knightos
on irc.freenode.net](http://webchat.freenode.net/?channels=knightos&uio=d4).
