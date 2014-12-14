---
# vim: tw=80
layout: post
author: Drew DeVault
title: Process scheduling and multitasking
---

KnightOS is a preemptive multitasking operating system, and it has to figure
out which tasks can use the CPU and when, and make an attempt at keeping things
fair. Let's talk a bit about the details of how this works in KnightOS.

*Note: This blog post was originally posted on [drewdevault.com](http://www.drewdevault.com) and has been cross-posted here.*

So, first of all, what is scheduling? For those who are completely out of the
loop, I'll explain what exactly it is and why it's neccessary. Computers run on
a CPU, which executes a series of instructions in order. Each core is not
capable of running several instructions concurrently. However, you can run
hundreds of processes at once on your computer (and you probably are doing so
as you read this article). There are a number of ways of accomplishing, but the
one that suits the most situations is *preemtive multitasking*. This is what
KnightOS uses. You see, a CPU can only execute one instruction after another,
but you can "raise an interrupt". This will halt execution and move to some
other bit of code for a moment. This can be used to handle various events (for
example, the GameBoy raises an interrupt when a button is pressed). One of
these events is often a timer, which raises an interrupt at a fixed interval.
This is the mechanism by which preemptive multitasking is accomplished.

Let's say for a moment that you have two programs loaded into memory and
running, at addresses 0x1000 and 0x2000. Your kernel has an interrupt handler
at 0x100. So if program A is running and an interrupt fires, the following
happens:

1. 0x1000 is pushed to the stack as the return address
2. The program counter is set to 0x100 and the interrupt runs
3. The interrupt concludes and returns, which pops 0x1000 from the stack and
   into the program counter.

Once the interrput handler runs, however, the kernel has a chance to be sneaky:

1. 0x1000 is pushed to the stack as the return address
2. The program counter is set to 0x100 and the interrupt runs
3. The interrupt removes 0x1000 from the stack and puts 0x2000 there instead
3. The interrupt concludes and returns, which pops 0x2000 from the stack and
   into the program counter.

Now the interrupt has switched the CPU from program A to program B. And the
next time an interrupt occurs, the kernel can switch from program B to program
A. This event is called a "context switch".  This is the basis of preemptive
multitasking. On top of this, however, there are lots of ideas around which
processes should get CPU time and when. Some systems have more complex
schedulers, but KnightOS runs on limited hardware and I wanted the context
switch to be short and sweet so that the running processes get as much of the
CPU as possible. I'll explain the simple KnightOS scheduling algorithm here.
First, its goals:

* Short and simple context switches
* Ability to suspend processes when not in foreground
* Ability to run background processes

What KnightOS uses is a simple round robin with the ability to suspend threads.
That is, we have a list of processes and then some flags, among which is
whether or not the processes is currently suspended. So say we have this list
of processes in memory:

* 1: PC=0x2000, not suspended
* 2: PC=0x2000, not suspended
* 3: PC=0x2000, suspended
* 4: PC=0x2000, not suspended

As process 1 is running and an interrupt fires, the kernel looks at this table
and picks the next non-suspended process to run - process 2. On the next
interrupt, it does it again, skipping process 3 and giving time to process 4.

To actually implement this, we have to think about the stack. KnightOS runs on
z80 processors, which have a single stack and a shared memory space. The CPU
uses the PC register to keep track of which address the current instruction is
at. That is, say you compile this code:

{% highlight nasm %}
ld a, 10
inc a
ld (hl), a
{% endhighlight %}

This compiles to the machine code 3E 0A 3C 77. Say we load this program at
0x8000 - then 0x8000 will point to `ld a, 10`. When the CPU finishes executing
this instruction, it advances PC to 0x8002 (since `ld a, 10` is a two-byte
instruction). The next instruction it executes will be `inc a`, and then PC
advances to 0x8003.

The stack is used for a lot of things. It can be used to save values, and it is
used to call subroutines. It is also used for interrupts. It's like the same
stacks you use in higher level applications, but it's at a very low level. When
an interrupt fires, the current value of PC is pushed to the stack. Then PC is
set to the interrupt routine, and then when that's done the top of the stack is
removed and placed into PC (effectively returning control to the original
location). However, since the stack is used for much more than that, we have
additional things to consider.

In KnightOS, when a new process starts, it's allocated a stack in memory and
the CPU's stack pointer (SP) is set to its address. When an interrupt happens,
we need to change the stack to point at some other process so it has time to
run (since that's where its PC is). However, we need to make sure that the
first processes stack is left intact. Since we allocate a new stack for the
next process, we can simply change SP to that processes stack. This will leave
behind the value of PC that was pushed during the interrupt for the previous
process, and lo and behlod a similar value of PC is waiting on top of the other
processes stack.

So that's it! We do a simple round robin, skipping suspended processes and
following the procedure outlined above to switch between them. This is how
KnightOS shares one CPU with several "concurrent" processes. Operating systems
like Linux use more complicated schedulers with more interesting theory if
you'd like some additional reading. And of course, since KnightOS is open
source, you may enjoy reading all of our code for handling this stuff (in
assembly):

[Context switching](https://github.com/KnightOS/kernel/blob/master/src/00/interrupt.asm)

[Stack allocation during process creation](https://github.com/KnightOS/kernel/blob/master/src/00/thread.asm#L72)

We're hanging out on #knightos on Freenode if you want to chat about cool
low-level stuff like scheduling and memory management.
