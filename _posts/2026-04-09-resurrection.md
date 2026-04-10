---
# vim: tw=80
layout: post
author: Noam Preil
title: We're alive, ish
---

The KnightOS SDK has been unable to build packages for years, as the prior host
of packages.knightos.org has been offline, and no replacement was forthcoming.
Recently, Max Leiter set up an alternative host with some core packages, and
patched the SDK to support using it.

This spurred my attention and, despite recent setbacks (*cough* house fire
*cough* unemployment *cough*), I finally found the time to get the SDK repaired
and packages.knightos.org back online :)

We don't have proper web indexing, at the moment, but all the core packages
found in [Max's repo](https://github.com/maxleiter/knightos-packages) are now
hosted on the new and unimproved packages.knightos.org server, and the SDK has
been updated to be able to fetch them!

New compilers and C libraries also complain about some bugs in kpack, so those
are fixed too. kpack 1.2.0 is now released, which fixes handling of some string
duplication.

With those fixes, new projects now build! :)

The default assembler for the SDK has also been switched over to scas, which
should be complete enough for most userspace code. Sass is available as a
fallback as needed.

<img src="/img/hello.png" style="max-width: 100%; height: auto;">

With any luck, more to share soon. Toodles!

