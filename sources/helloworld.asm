#include "kernel.inc"
    ; Program header, safe to ignore
    .db "KEXC"
    .db KEXC_ENTRY_POINT
    .dw start
    .db KEXC_STACK_SIZE
    .dw 100
    .db KEXC_HEADER_END
    ; End of program header
hello_world_message:
    .db "Hello, world!", 0 ; <--- Try changing this string
start:
    ; Get a lock on some hardware
    pcall(getLcdLock)

    ; Allocate and clear a display buffer
    pcall(allocScreenBuffer)
    pcall(clearBuffer)

    ; Draw "Hello, world!"
    ld de, 0x0000
    kld(hl, hello_world_message)
    pcall(drawStr)

    ; Copy buffer to display
    pcall(fastCopy)
    jr $ ; hang
