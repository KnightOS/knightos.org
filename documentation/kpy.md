---
# vim: tw=82
layout: base
title: kpy
---

# kpy

kpy is a scripting language built for KnightOS. It currently exists only
conceptually. The goal is to feel similiar to python, but to additionally be
suitable for use as a student's default mathematical shell. It will replace
TI-Basic and the TI-OS home screen. This document loosely describes the goals and
design of kpy.

## Interactive

{% highlight python %}
> 2+2
  4
> a=100
  100
> a*2
  200
> √(a) # No tokens, this is just sqrt(, but it looks prettier in the shell
  10
> x(a, b)=2a+b
> x(10, 20)
  40
> x(a, b):
   if a ≤ 10: # Remember, no tokens. This is just a prettier version of <=
    a+=10
   return 2a+b
> x(10, 20)
  60
> import files
> file.reads('/var/example')
  "Hello world"
{% endhighlight %}

## Scripts

{% highlight python %}
#!/bin/kpy
# Shebangs are supported in KnightOS, by the way
import drawing
import keyboard

screen=createScreen()
sprite=loadSprite(screen, '/share/foobar/player.kimg')
x=0
y=0
key=0

while key!=KEYS.MODE:
 key=getKey()
 screen.clear()
 if key==KEYS.UP:
  y--
 elif key==KEYS.DOWN:
  y++
 elif key==KEYS.LEFT:
  x--
 elif key==KEYS.RIGHT:
  x++
 sprite.draw(x,y)
 screen.render()
{% endhighlight %}

In theory, it might even be possible to use a Python-compatible subset of kpy to
run kpy scripts on other platforms that support Python.

## Libraries

Libraries are located in `/lib/kpy/`. They could be written in kpy OR assembly.
The idea is that critical stuff could be written in assembly for the sake of
speed, but users could still write stuff in kpy if they please.

`import keyboard` would import `/lib/kpy/keyboard.kpy` (or `/lib/kpy/keyboard.kpc`,
if it were compiled assembly). It would simply execute the `keyboard` script and
make all the objects available to the parent script. If a library wanted local
variables, it could do something like this:

{% highlight python %}
keyboard(exports):
 getKey():
  # pcall(getKey)
  return asm('E70023', returns='A')
 exports.getKey = getKey
keyboard(this)
{% endhighlight %}

This would be similar to the JavaScript way of doing such things.
