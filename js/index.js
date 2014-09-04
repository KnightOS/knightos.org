var OpenTI;

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

function print_lcd(lcd) {
    lcd_ctx.fillStyle = "#99B199";
    lcd_ctx.fillRect(0, 0, 120 * 4, 64 * 4);
    lcd_ctx.fillStyle = "black";
    for (var x = 0; x < 120; x++) {
        for (var y = 0; y < 64; y++) {
            if (lcd.readScreen(x, y)) {
                lcd_ctx.fillRect(x * 4, y * 4, 4, 4);
            }
        }
    }
    update_lcd = null;
}

var key_mappings = Array.apply(null, new Array(100)).map(Number.prototype.valueOf, -1);
key_mappings[40] = 0x00; // Down
key_mappings[37] = 0x01; // Left
key_mappings[39] = 0x02; // Right
key_mappings[38] = 0x03; // Up
key_mappings[13] = 0x10; // Enter
key_mappings[27] = 0x60; // MODE / Esc
key_mappings[112] = 0x64; // F1 / 1
key_mappings[113] = 0x63; // F2 / 2
key_mappings[114] = 0x62; // F3 / 3
key_mappings[115] = 0x61; // F4 / 4
key_mappings[116] = 0x60; // F5 / 5

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
            var pointer = allocate(byteArray, 'i8', ALLOC_STACK);
            Module.HEAPU32[asic.mmu._flashPointer] = pointer;

            openti_log.print("KnightOS "+Pointer_stringify(pointer + 0x64)+" loaded!\n");

            exec("run 1000");
            exec("turn_on");

            setTimeout(function tick() {
                if (!asic.stopped || asic.cpu.interrupt) {
                    asic.runloop.tick(asic.clock_rate / 20);
                }
                if (update_lcd) {
                    print_lcd(update_lcd);
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
