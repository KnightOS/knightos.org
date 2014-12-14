#include "kernel.inc"
    ; Program header, safe to ignore
    .db "KEXC"
    .db KEXC_ENTRY_POINT
    .dw start
    .db KEXC_STACK_SIZE
    .dw 100
    .db KEXC_HEADER_END
    ; End of program header
fileman_path:
    .db "/bin/fileman", 0
start:
    kld(de, fileman_path)
    pcall(launchProgram)
    ret
