---
# vim: tw=80
layout: page-header
title: Contributor Guidelines
---

Ready to get cracking? There are a few guidelines to follow. First of all,
please please please join our [IRC
channel](http://webchat.freenode.net/?channels=knightos&uio=d4) to talk about
what you'd like to accomplish. Odds are that the collective minds of IRC can
provide more insight into the problem you're solving than you can alone.

Once you've introduced yourself, make a fork of the repository you'd like to
work on and start committing. Please follow the usual guidelines for git
commits, with a brief (and professional) description on the first line and a
more detailed one on the next. When you have completed your feature, simply send
us a pull request. Expect for others to run through it with a fine-toothed comb,
pointing out mistakes and possible improvements. Once we like it, it's merged!

If you do this enough times and you're interested, we can give you write access
to the repositories you contribute to frequently. Joining our team is as simple
as making a few good pull requests.

If you prefer to contribute through a more traditional venue, send patches to
our [mailing lists](http://lists.knightos.org).

## Opening Issues

Please report issues on all official KnightOS subprojects to
[KnightOS/KnightOS](https://github.com/KnightOS/KnightOS/issues). Do not send us
bugs about software that runs on KnightOS unless it's an official project in the
`core` or `extra` repositories. Follow these guidelines when opening a ticket:

* Use English
* Search existing tickets to make sure we don't already know about it
* Check that your system and kernel are up-to-date
* Provide clear instructions on how to reproduce errors
* Mention what kind of calculator you're using (TI-83+, TI-84+ SE, etc)

## General Guidelines

In the kernel, all registers that are not used for output must be kept intact
for all functions exported to userspace. All exported functions must have
accompanying documentation. Do not use the ';;' syntax outside of documentation.

## Coding Guidelines

There are a lot of languages involved in KnightOS, and we enforce a consistent
style across all projects. This style is different for each language in use, and
you'll be asked to fix it if you send pull requests that don't follow the
relevant style. Most of these are just whatever is most common in the language
in question, so you'll probably feel fairly comfortable with it.

### z80 Assembly

    labelName:
        ld a, 10 + 0x13
        push af
        push bc
            add a, b
            jr c, labelName
        pop bc
        pop af
    .localLabel:
        dec a
        cp 10
        jr z, .localLabel
        ret

* Use 0xHEX, not $HEX or HEXh
* Use local labels where possible
* Instructions in lowercase
* camelCase for label names
* 4 spaces, not tabs
* Indent your code to reflect stack usage

### C

    char *returns_string(char *a, int b, struct some_struct c) {
    	b += 10;
    	int i;
    	for (i = 0; i < 10; i++) {
    		b += c.something;
    	}
    	if (b > 40) {
    		return a - b;
    	}
    	return a + b;
    }

* Opening braces on the same line
* C99 is alright but we don't mind tradition
* Tabs instead of spaces
* `char *foobar` instead of `char* foobar`
* Single-line statments get braces anyway

### Python

    import foo
    import bar

    from baz import *

    def test(foo, bar):
        print("hello world")
        return foo + bar

* 4 spaces instead of tabs
* Group `import a`s seperate from `from a import b`s
* Pretty much standard Python

### CSS

    .foo-bar > a {
        color: red;
        background: transparent;
        border-radius: 5px;
    }

* 4 spaces instead of tabs
* Opening braces on the same line
* Use dashed-case for class names and IDs

### JavaScript

    var a = {
        foo: 'a',
        bar: 'b',
        baz: 100
    };

    function example(a, b, c) {
        if (typeof c === "undefined") {
            b = 10;
        }
        return a + b + c;
    }

* 4 spaces instead of tabs
* Opening brace on the same line
* Check for undefined with `typeof variable === "undefined"`
* If you use `==` or `!=` instead of `===` or `!==`, there will be a fight
