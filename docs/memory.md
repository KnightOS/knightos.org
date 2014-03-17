---
title: Memory layout
layout: base
---

# Memory Layout

Memory in KnightOS is seperated into four sections - kernel code, Flash paging, kernel memory, and userspace memory.

It is laid out as follows:

<table class="table">
    <th>Address</th><th>Length</th><th>Description</th>
    <tr><td>0x0000</td><td>0x4000</td><td>Kernel</td></tr>
    <tr><td>0x4000</td><td>0x4000</td><td>Flash paging</td></tr>
    <tr><td>0x8000</td><td>0x100</td><td>Thread table</td></tr>
    <tr><td>0x8100</td><td>0x40</td><td>Library table</td></tr>
    <tr><td>0x8140</td><td>0x40</td><td>Signal table</td></tr>
    <tr><td>0x8180</td><td>0x20</td><td>File stream table</td></tr>
    <tr><td>0x8200</td><td>0x100</td><td>Kernel state</td></tr>
    <tr><td>0x8300</td><td>0x200</td><td>Kernel garbage</td></tr>
    <tr><td>0x8500</td><td>0x7C00</td><td>Userspace memory</td></tr>
</table>

The actual address and length of these portions of memory may change depending on your kernel configuration - the
defaults are shown here. Userspace programs should not have to depend on any of this, but should instead use
kernel-provided routines for manipulating data here. Any correctly built userspace program should be able to run
on any kernel configuration tuned to any particular situation (more threads and less userspace memory, less
libraries and more userspace memory, etc).

Kernel state is not entirely used, but is reserved for future use. It currently holds a few dozen kernel state
variables and isn't structured in any special fashion. See
[kernelmem.inc](https://github.com/KnightOS/kernel/blob/master/inc/kernelmem.inc) for details.

Kernel garbage is only used while interrupts are disabled, and no guarantee is made about its contents. It is
used, for example, to hold kernel Flash code that must run from RAM. It is also used to keep track of state when
performing a garbage collection.

Userspace memory is allocated with [malloc](http://www.knightos.org/docs/reference/system.html#malloc) and is
available for userspace use. Programs run from here and the memory they allocate is assigned here.

## Data Structures

Information about kernel memory tables follows.

### Thread Table

The thread table contains state information about all currently executing threads. Each entry is 8 bytes long.

<table class="table">
    <th>Offset</th><th>Length</th><th>Description</th>
    <tr><td>0000</td><td>1</td><td>Thread ID</td></tr>
    <tr><td>0001</td><td>2</td><td>Executable address</td></tr>
    <tr><td>0003</td><td>2</td><td>Stack pointer</td></tr>
    <tr><td>0005</td><td>1</td><td>Flags</td></tr>
    <tr><td>0006</td><td>2</td><td>Reserved for future use</td></tr>
</table>

Flags is a bitfield:

<table class="table">
    <th>Bit</th><th>Description</th>
    <tr><td>1</td><td>May be suspended</td></tr>
    <tr><td>2</td><td>Is suspended</td></tr>
    <tr><td>3</td><td>Color mode</td></tr>
</table>

### Library Table

The library table stores information about all libraries currently loaded in the system. Each entry is 4 bytes long.

**NOTE**: This table will likely be revised to track which threads are using which libraries, and for 16 bit library IDs.

<table class="table">
    <th>Offset</th><th>Length</th><th>Description</th>
    <tr><td>0000</td><td>1</td><td>Library ID</td></tr>
    <tr><td>0001</td><td>2</td><td>Library address</td></tr>
    <tr><td>0003</td><td>1</td><td>Number of dependent threads</td></tr>
</table>

### Signal Table

All pending signals are stored in the signal table. Each entry is 4 bytes long.

<table class="table">
    <th>Offset</th><th>Length</th><th>Description</th>
    <tr><td>0000</td><td>1</td><td>Target thread</td></tr>
    <tr><td>0001</td><td>1</td><td>Message type</td></tr>
    <tr><td>0002</td><td>2</td><td>Payload</td></tr>
</table>

### File Stream Table

All active file streams are stored in this table.

<table class="table">
    <th>Offset</th><th>Length</th><th>Description</th>
    <tr><td>0000</td><td>1</td><td>Flags/Owner</td></tr>
    <tr><td>0001</td><td>2</td><td>Buffer address</td></tr>
    <tr><td>0003</td><td>1</td><td>Stream pointer</td></tr>
    <tr><td>0004</td><td>2</td><td>Section identifier</td></tr>
    <tr><td>0006</td><td>1</td><td>Length of final block</td></tr>
    <tr><td>0007</td><td>1</td><td>File entry page</td></tr>
    <tr><td>0008</td><td>2</td><td>File entry address</td></tr>
    <tr><td>000A</td><td>3</td><td>Working file size</td></tr>
    <tr><td>000D</td><td>1</td><td>Writable stream flags</td></tr>
    <tr><td>000E</td><td>3</td><td>Reserved for future use</td></tr>
</table>

Flags/owner is the following 8 bit format: FTExxxxx, where xxxxx is the thread ID of the owner. F is set if the stream is currently on the
final block of the file. T is set if thread is writable. E is set if the stream pointer is past the end of the file.

Writable stream flags are xxxxxxF, where F is if the stream has been flushed to disk.

The buffer address is the location of the buffer in memory (the first byte). This 256-byte buffer contains the contents of the current DAT
block. The stream pointer is the offset within this buffer that the stream is currently poitned to. When this offset overflows or underflows,
the system copies the next or prior block (respectively) into the buffer. For writable streams, the stream is first flushed.

The section identifer refers to the current DAT block, and is a section identifier as described by the filesystem specification.

The length of the final block is used in read-only streams to determine when the end of the stream has been reached.
