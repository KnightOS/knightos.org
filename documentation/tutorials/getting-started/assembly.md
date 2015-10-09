---
# vim: tw=80
title: >
    Diving into z80 assembly on KnightOS
layout: page
---

# Diving into z80 assembly on KnightOS

This tutorial will explain more in depth about assembly on KnightOS. 

I'm bad at explaining stuff but i'll try my best.

I first recommend learning the z80 assembly from <a href="http://tutorials.eeems.ca/ASMin28Days/lesson/toc.html">ASM in 28 days</a> first.

In KnightOS programming use:
- kld instead of ld
- kjp instead of jp
- kcall instead of call
 The reason is because the KnightOS userspace is in a unfixed location in memory.

<a href="userspace.html" class="pull-right btn btn-primary">Next »</a>
<a href="corelib.html" class="btn btn-primary">« Back</a>
