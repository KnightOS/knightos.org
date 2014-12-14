require.config({
    paths: {
        'z80e': '../OpenTI/webui/js/lib/z80e'
    },
    shim: {
        'z80e': {
            exports: 'exports'
        }
    }
});

var Module = {
    memoryInitializerPrefixURL: "OpenTI/webui/js/lib/"
};

require(['z80e', '../OpenTI/webui/js/OpenTI/OpenTI'], function(z80e, OpenTI) {
    var openti_log = {
        print: function(str) {
          console.log(str);
        },
        clear: function() {
          // nop
        }
    };

    var openti_debug = {
        print: function(str) {
          console.log(str);
        },
        clear: function() {
          // nop
        }
    };
    var update_lcd;
    function do_update_lcd(lcd) {
        update_lcd = lcd;
    }

    var lcd_data = [];
    var lcd_colors = [[0x99, 0xB1, 0x99], [0x00, 0x00, 0x00]];
    function gen_pixeldata() {
        for (var i = 0; i <= 0xff; i++) {
            var arr = new Uint8Array(8 * 4 * 4);
            for (var j = 0; j < 8; j++) {
                var set = (i & (1 << j)) ? 1 : 0;
                for (var k = 0; k < 4; k++) {
                    var view = (j * 16) + k * 4;
                    arr[view + 0] = lcd_colors[set][0];
                    arr[view + 1] = lcd_colors[set][1];
                    arr[view + 2] = lcd_colors[set][2];
                    arr[view + 3] = 0xFF;
                }
            }
            lcd_data.push(arr);
        }
    }
    gen_pixeldata();

    function print_lcd(lcd) {
        var data = lcd_ctx.getImageData(0, 0, 384, 256);
        var ram = lcd.ram;
        for (var x = 0; x < (120 * 64) / 8; x++) {
            var octet = x % 15;
            if (octet > 11) {
                continue;
            }
            var line = Math.floor(x / 15) * 4;
            var tocopy = lcd_data[ram[x]];
            data.data.set(tocopy, ((line++) * 12 + octet) * (4 * 8 * 4));
            data.data.set(tocopy, ((line++) * 12 + octet) * (4 * 8 * 4));
            data.data.set(tocopy, ((line++) * 12 + octet) * (4 * 8 * 4));
            data.data.set(tocopy, ((line++) * 12 + octet) * (4 * 8 * 4));
        }
        lcd_ctx.putImageData(data, 0, 0);
        update_lcd = null;
    }

    var key_mappings = Array.apply(null, new Array(100)).map(Number.prototype.valueOf, -1);
    key_mappings[40] = 0x00; // Down
    key_mappings[37] = 0x01; // Left
    key_mappings[39] = 0x02; // Right
    key_mappings[38] = 0x03; // Up
    key_mappings[16] = 0x65; // 2nd / Shift
    key_mappings[13] = 0x10; // Enter
    key_mappings[27] = 0x66; // MODE / Esc
    key_mappings[112] = 0x64; // F1
    key_mappings[113] = 0x63; // F2
    key_mappings[114] = 0x62; // F3
    key_mappings[115] = 0x61; // F4
    key_mappings[116] = 0x60; // F5
    key_mappings[48] = 0x40; // 0
    key_mappings[49] = 0x41; // 1
    key_mappings[50] = 0x31; // 2
    key_mappings[51] = 0x21; // 3
    key_mappings[52] = 0x42; // 4
    key_mappings[53] = 0x32; // 5
    key_mappings[54] = 0x22; // 6
    key_mappings[55] = 0x43; // 7
    key_mappings[56] = 0x33; // 8
    key_mappings[57] = 0x23; // 9

    var lcd_ctx;
    $(function() {
        lcd_ctx = document.getElementById("screen").getContext("2d");
        window.addEventListener('keydown', function(e) {
            if (e.keyCode <= key_mappings.length && key_mappings[e.keyCode] !== -1) {
                e.preventDefault();
                OpenTI.current_asic.hardware.Keyboard.press(key_mappings[e.keyCode]);
            }
        });
        window.addEventListener('keyup', function(e) {
            if (e.keyCode <= key_mappings.length && key_mappings[e.keyCode] !== -1) {
                e.preventDefault();
                OpenTI.current_asic.hardware.Keyboard.release(key_mappings[e.keyCode]);
            }
        });
    });

    var exec;

    require(["../OpenTI/webui/js/OpenTI/OpenTI"], function(oti) {
        OpenTI = oti;

        var asic = new oti.TI.ASIC(oti.TI.DeviceType.TI84pSE);
        asic.debugger = new oti.Debugger.Debugger(asic);

        OpenTI.current_asic = asic;

        asic.hook.addLCDUpdate(do_update_lcd);

        var prev_command = "";
        exec = function(str) {
            openti_debug.print("z80e > "+str+"\n");

            if (str.length == 0) {
                str = prev_command;
            }
            prev_command = str;

            var state = new oti.Debugger.Debugger.State(asic.debugger,
                {
                    print: function(str) { openti_debug.print(str); },
                    new_state: function() { return this; },
                    closed: function() { }
                });

            state.exec(str);
        }

        openti_log.print("OpenTI loaded!\n");

        var oReq = new XMLHttpRequest();
        oReq.open("GET", "http://builds.knightos.org/latest-TI84pSE.rom", true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function (oEvent) {
            var arrayBuffer = oReq.response; // Note: not oReq.responseText
            if (arrayBuffer) {
                var byteArray = new Uint8Array(arrayBuffer);
                var pointer = z80e.Module.allocate(byteArray, 'i8', z80e.Module.ALLOC_STACK);
                Module.HEAPU32[asic.mmu._flashPointer] = pointer;

                openti_log.print("KnightOS "+z80e.Module.Pointer_stringify(pointer + 0x64)+" loaded!\n");

                asic.runloop.tick(1000);
                asic.cpu.halted = 0;

                setTimeout(function tick() {
                    if (!asic.stopped || asic.cpu.interrupt) {
                        asic.runloop.tick(asic.clock_rate / 20);
                    }
                    setTimeout(tick, 0);
                }, 1000 / 60);

                setTimeout(function tick() {
                    if (update_lcd) {
                        print_lcd(update_lcd);
                    }
                    setTimeout(tick, 1000 / 60);
                }, 1000 / 60);
            }
        }

        oReq.send(null);
    });
});
