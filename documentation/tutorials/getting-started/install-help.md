---
# vim: tw=80
title: SDK Installation
layout: page
---

# SDK Installation

Here are some more specific instructions for installing the SDK on various
systems. If yours is missing, please figure it out yourself and then document
your steps here - 
[edit this page](https://github.com/KnightOS/knightos.org/edit/gh-pages/documentation/tutorials/getting-started/install-help.md)
to add yours.

---

## Arch Linux
Install `aur/knightos-sdk`.

---

## Mac OS X

###Dependencies
A list of dependencies can be found on the [wiki page](http://wiki.knightos.org/index.php/Tutorials/General/KnightOS_SDK)]

###Installation:

Create a new directory for your KnightOS projects (the source will also live here.)

    cd; mkdir knightos; cd $_

This will create a directory *knightos* in your user's home folder, and change the working directory to the new folder.

Use this automated build script or perform these steps manually:

<div class="alert alert-info">Note: If you use sass (the css-preprocessor) you
will want to rename KnightOS' sass to something distinguishable. I use
kos-sass in a section below.</div>

{% highlight bash %}
#!/bin/bash

list="genkfs mktiupgrade kpack z80e sass"
for project in $list; do
    git clone https://github.com/KnightOS$project.git
done

for dir in $list; do
    pushd $dir
    if [[ $dir == "sass" ]]; then
        # If this fails you probably don't have mono installed
        make; sudo make install
        popd
        continue
    fi
    cmake .; make; sudo make install
    popd
done
{% endhighlight %}

Now you will need [the actual SDK](http://wiki.knightos.org/index.php/Tutorials/General/KnightOS_SDK).

{% highlight bash %}
#!/bin/bash

git clone https://github.com/KnightOS/sdk.git
sudo pip3 install docopt
sudo pip3 install requests
sudo pip3 install pystache
sudo pip3 install pyyaml
pushd sdk
sudo make install
popd
{% endhighlight %}

If everything installed without failures, **congratulations**, you are ready to create knightos projects!

###Using sass with sass:

Clone each project (as presented in the first given script) then `cd` into `sass`.

Save this into a `kos-sass.diff` file.

Then make these changes with `git apply -p0 kos-sass.diff` (make sure you are in the root of `sass`).

Of course you can do this manually too.

    diff --git a/Makefile b/Makefile
    index 48aca36..bae88ed 100644
    --- a/Makefile
    +++ b/Makefile
    @@ -27,12 +27,12 @@ sass/bin/Debug/sass.exe: sass/*.cs
     install:
        mkdir -p $(DESTDIR)/bin/
        mkdir -p $(DESTDIR)/mono/
    -	install -c -m 775 sass/bin/Debug/sass.exe $(DESTDIR)/mono/sass.exe
    -	echo -ne "#!/bin/sh\n$(SASSPREFIX) $(PREFIX)/mono/sass.exe \$$*" > $(DESTDIR)/bin/sass
    -	chmod +x $(DESTDIR)/bin/sass
    +	install -c -m 775 sass/bin/Debug/sass.exe $(DESTDIR)/mono/kos-sass.exe
    +	echo "#!/bin/sh\n$(SASSPREFIX) $(PREFIX)/mono/kos-sass.exe \$$*" > $(DESTDIR)/bin/kos-sass
    +	chmod +x $(DESTDIR)/bin/kos-sass
     
     uninstall:
    -	rm $(DESTDIR)/bin/sass
    -	rm $(DESTDIR)/mono/sass.exe
    +	rm $(DESTDIR)/bin/kos-sass
    +	rm $(DESTDIR)/mono/kos-sass.exe
     
     .PHONY: all install uninstall clean

Doing this means that when creating a knightos project via the sdk you will need to supply the argument `--assembler=kos-sass`.

Now you can use the automated build script provided above.
